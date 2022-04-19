---
layout: post
title: "Getting Started with wolfSSH for Espressif ESP32"
date: '2022-04-10'
author: gojimmypi
tags:
- wolfSSL
- wolfSSH
- Espressif
- ESP32
- SSH
---

Some note on the development of the ESP32 SSH Server. 

TL;DR
* Don't use WSL while debugging; use putty or some other SSH client

Currently in development, there's a freeRTOS thread that has a [server_worker process](https://github.com/gojimmypi/wolfssh/blob/1b8516876bad4028e91146a9ac19fceccb681318/examples/ESP32-SSH-Server/main/ssh_server.c#L122). 

Once an SSH connection has been established, it stays in a [tight little loop](https://github.com/gojimmypi/wolfssh/blob/1b8516876bad4028e91146a9ac19fceccb681318/examples/ESP32-SSH-Server/main/ssh_server.c#L157)
send and receiving characters over the network socket. What needs to be done is the characters _received_ from the network need to be _sent_ to the UART, and characters _from_ the UART
need to be sent out the SSH network socket.

AS the current implementation is a blocking send/receive in the `server_worker` process, the data needs to be shared with a the UART threads.

One of the problems during debugging is the SSH connection will close. Stack overflow has some [suggestions on keeping an SSH connection open](https://stackoverflow.com/questions/4936807/how-to-set-ssh-timeout). 
None of these seemed to work while debugging:

```
ssh -o ConnectTimeout=9999  jill@192.168.1.186 -p 22222

# all of these give an error: jill@192.168.1.186: Permission denied (publickey,password).
ssh -o ConnectTimeout=9999 -o BatchMode=yes  jill@192.168.1.186 -p 22222
ssh -o ConnectTimeout=9999 -o BatchMode=yes  -o StrictHostKeyChecking=no jill@192.168.1.186 -p 22222
sshpass -p upthehill ssh -o ConnectTimeout=9999 -o BatchMode=yes  -o StrictHostKeyChecking=no jill@192.168.1.186 -p 22222
```

There's a [suggesion at superuser.com](https://superuser.com/questions/1591674/idle-ssh-connection-gets-reset-in-ubuntu-20-04-wsl-windows10)
to edit `/etc/ssh/ssh_config` adding these lines:

```
ClientAliveInterval 60
ClientAliveCountMax 5
```
However the WSL client didn't seem to like that:
```
/etc/ssh/ssh_config: line 56: Bad configuration option: clientaliveinterval
/etc/ssh/ssh_config: line 57: Bad configuration option: clientalivecountmax
/etc/ssh/ssh_config: terminating, 2 bad configuration options
```

The important thing here is syntax! The options need to be indented, and perhaps even host-specific.
Unforntuately, even without an error, the timeout problem still occured with a `/etc/ssh/ssh_config` like this:
```
Include /etc/ssh/ssh_config.d/*.conf

Host *
    SendEnv LANG LC_*
    HashKnownHosts yes
    GSSAPIAuthentication yes
    ServerAliveInterval 9000
    ServerAliveCountMax 20
    TCPKeepAlive no
``` 

As it turns out, there seems to be an [open issue](https://github.com/PowerShell/Win32-OpenSSH/issues/1873) on the Windows platform.

Further, the code as-is when debugging does not check for a lost connection during that loop. When the client disconnects the ESP32 SSH
server continues to wait in the loop.

VisualGDB does not like when the target is reset while JTAG debugging is active. Typical results will
be the dreaded _Guru Meditation Error_ 

```
Guru Meditation Error: Core  0 panic'ed (IllegalInstruction). Exception was unhandled.
Memory dump at 0x400d70e8: ffffffff ffffffff ffffffff
Setting breakpoint at 0x400d70ec and returning...
```  

And then even after a power cycle, the image won't boot:
```
E (340) esp_image: Checksum failed. Calculated 0x6 read 0x4e
E (343) boot: Factory app partition is not bootable
E (349) boot: No bootable app partitions in the partition table
ets Jun  8 2016 00:22:57

rst:0x3 (SW_RESET),boot:0x13 (SPI_FAST_FLASH_BOOT)
```
Lesson learned: stop debugging before reset. Otherwise reflash is needed.


The right to do this is of course with a client cert. 

Another issue is sending data.

[the wolfSSH callback](https://github.com/wolfSSL/wolfssh/blob/bb6e6e2ba8ba135a26712dc64a382291c5e39581/wolfssh/ssh.h#L151) looks like this:

```
typedef int (*WS_CallbackIOSend)(WOLFSSH*, void*, word32, void*);
```

I found only [one example](https://github.com/wolfSSL/wolfssh/blob/bb6e6e2ba8ba135a26712dc64a382291c5e39581/ide/Renesas/cs%2B/demo_server/wolfssh_demo.c#L580) 
using the `CallbackIOSend`.

```
static int my_IORecv(WOLFSSH* ssh, void* buff, word32 sz, void* ctx)
{
    int ret;
    ID  cepid;
    if(ctx != NULL)cepid = *(ID *)ctx;
    else return WS_CBIO_ERR_GENERAL;
    
    ret = tcp_rcv_dat(cepid, buff, sz, TMO_FEVR);
    
    return ret;
}

static int my_IOSend(WOLFSSH* ssh, void* buff, word32 sz, void* ctx)
{
    int ret;
    ID  cepid;
    
    if(ctx != NULL)cepid = *(ID *)ctx;
    else return WS_CBIO_ERR_GENERAL;

    ret = tcp_snd_dat(cepid, buff, sz, TMO_FEVR);
    
    return ret;
}
 
int server_test(void)
{
/* ... */

   /* Register callbacks */
    wolfSSH_SetIORecv(ctx, my_IORecv);
    wolfSSH_SetIOSend(ctx, my_IOSend);

/* ... */
}
```

Unfortunately it seems that callback uses a completely different TCP/IP library with [tcp_snd_dat](https://github.com/wolfSSL/wolfssh/search?q=tcp_snd_dat)
found in ["r_t4_itcpip.h"](https://github.com/wolfSSL/wolfssh/blob/bb6e6e2ba8ba135a26712dc64a382291c5e39581/ide/Renesas/cs%2B/demo_server/wolfssh_demo.c#L22)
