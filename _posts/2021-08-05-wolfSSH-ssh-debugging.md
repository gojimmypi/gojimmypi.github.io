---
layout: post
title: "wolfSSH ssh debugging"
description: "NOTE: This page is retained only for historical / reference reasons only. GH Pages fails to render it, and worse: fails to indicate that there was an error."
date: '2021-08-05'
author: gojimmypi
tags:
- ESP32
- wolfSSL
- SSH
- Espressif
---

NOTE: This page is retained only for historical / reference reasons only. GH Pages fails to render it, and worse: fails to indicate that there was an error.

- ## Overview

There are two Visual Studio solution files: a regular, 32-bit environment, and a 64-bit one. 
Oddly, my Visual Studio 2019 did not seem to be happy with the 64 bit solution. Although the code would compile,
there were hundreds of false errors related to IDE processing (or lack thereof) dependency files.

`ctx` is "SSL Context"; See [wolfSSL Context and Session Set Up](https://www.wolfssl.com/doxygen/group__Setup.html)

`ourDhParam` is "the filename of the Diffie-Hellman cert we will use". Default: `./certs/dh2048.pem`.

see [line 1940 of wolfssl/wolfssl/test.h](https://github.com/wolfSSL/wolfssl/blob/bd6b765b17299e8fa9d1a6dc432c4da9597f0cf9/wolfssl/test.h#L1940) for blocking accept(); 
This is 5 packet init exchange that should include `hello`:
```
    *clientfd = accept(*sockfd, (struct sockaddr*)client_addr,
                      (ACCEPT_THIRD_T)client_len);
```

- ## WSL SSH Server

- ### Configure WSL SSH Server Service

See `/etc/ssh/sshd_config`:
```
Port 2211
ListenAddress 192.168.1.25
```

- ### Start the service

```
sudo service ssh start
```

- ### Generate keys

```
C:\workspace\wolfssl-demo>ssh-keygen
Generating public/private rsa key pair.
Enter file in which to save the key (C:\Users\gojimmypi/.ssh/id_rsa): c:\workspace\wolfssl-demo\cert\gojimmypi
...etc
```

- ### Append the public key to the WSL ~/.ssh/authorized_keys

Note the server is running in WSL, so the keys are in `~/.ssh`. Adding this `authorized_key` allows us to connecte to 
local ssh server from local host.

```
cat /mnt/c/workspace/wolfssl-demo/cert/gojimmypi.pub >> ~/.ssh/authorized_keys
```

- ### Connect to WSL SSH Server from DOS, specifying the private key file:

```
ssh -p 2211 -vvvv -i c:\workspace\wolfssl-demo\cert\gojimmypi 192.168.1.25
```

- ## Set WiFi

See: `sdkconfig.h`

```
#define CONFIG_EXAMPLE_WIFI_SSID "yourwifi"
#define CONFIG_EXAMPLE_WIFI_PASSWORD "yourpassword"
```
in
```
C:\workspace\wolfssl-demo\IDE\Espressif\ESP-IDF\examples\wolfssl_server\build\include\sdkconfig.h
```

- ## Building 
See [wolfSSH requires the wolfSSL library. The steps are:](https://github.com/wolfSSL/wolfssl/issues/4272#issuecomment-891199577)
```
sudo echo "Here we go. If prompted for password, press ctrl-c"
git clone https://github.com/wolfssl/wolfssl.git wolfssl-demo
cd wolfssl-demo
./autogen.sh
./configure --enable-openssh
make
sudo make install
sudo ldconfig

. $HOME/esp/esp-idf/export.sh
cd /mnt/c/workspace/wolfssl-demo/IDE/Espressif/ESP-IDF/examples/wolfssl_server

# For Linux:
# python /home/gojimmypi/esp/esp-idf/components/esptool_py/esptool/esptool.py --chip esp32 --port /dev/ttyUSB0 --baud 115200 --before default_reset --after hard_reset write_flash -z --flash_mode dio --flash_freq 40m --flash_size detect 0x1000 /mnt/c/workspace/wolfssl-demo/IDE/Espressif/ESP-IDF/examples/wolfssl_server/build/bootloader/bootloader.bin  0x10000  /mnt/c/workspace/wolfssl-demo/IDE/Espressif/ESP-IDF/examples/wolfssl_server/build/tls_server.bin 0x8000  /mnt/c/workspace/wolfssl-demo/IDE/Espressif/ESP-IDF/examples/wolfssl_server/build/partitions_singleapp.bin

# For WSL:
/mnt/c/python36/python.exe c:\\workspace\\esp-build\\esptool.py                --chip esp32 --port COM4        --baud 115200 --before default_reset --after hard_reset write_flash -z --flash_mode dio --flash_freq 40m --flash_size detect 0x1000 c:\\workspace\\wolfssl\\IDE\\Espressif\\ESP-IDF\\examples\\wolfssl_server\\build\\bootloader\\bootloader.bin 0x10000  c:\\workspace\\wolfssl\\IDE\\Espressif\\ESP-IDF\\examples\\wolfssl_server\\build\\tls_server.bin 0x8000  c:\\workspace\\wolfssl\\IDE\\Espressif\\ESP-IDF\\examples\\wolfssl_server\\build\\partitions_singleapp.bin

```

- # Espressif ESP32GH missing fix 2
```
cd ~/esp
. $HOME/esp/esp-idf/export.sh
cp -r /mnt/c/workspace/WolfSSL/IDE/Espressif/ESP-IDF/examples/wolfssl_server .
cd wolfssl_server

cp ~/esp/esp-idf/components/esptool_py/esptool/esptool.py /mnt/c/workspace/esp-build/esptool.py

# from WSL:
/mnt/c/python36/python.exe c:\\workspace\\esp-build\\esptool.py --chip esp32 --port COM4 --baud 115200 --before default_reset --after hard_reset write_flash -z --flash_mode dio --flash_freq 40m --flash_size detect 0x1000 c:\\workspace\\wolfssl\\IDE\\Espressif\\ESP-IDF\\examples\\wolfssl_server\\build\\bootloader\\bootloader.bin 0x10000 c:\\workspace\\wolfssl\\IDE\\Espressif\\ESP-IDF\\examples\\wolfssl_server\\build\\tls_server.bin 0x8000 c:\\workspace\\wolfssl\\IDE\\Espressif\\ESP-IDF\\examples\\wolfssl_server\\build\\partitions_singleapp.bin

make menuconfigure
idf.py build

grep -rnw './' -e 'WOLFSSL_AES_COUNTER' | grep " #define "
grep -rnw '/mnt/c/workspace/WolfSSL' -e 'WOLFSSL_AES_COUNTER'
```

WSL attempt to connect to ESP32 (not working)
```
ssh -p 11111 -vvvvv -i /mnt/c/workspace/wolfssl-demo/certs/gojimmypi  gojimmypi@192.168.1.31
```

WSL attempt to connect to local ssh server
```

```

DOS connect to local ssh server:
```
ssh -p 2211 -vvvv -i c:\workspace\wolfssl-demo\cert\gojimmypi 192.168.1.25
```

- ## Wireshark Settings

```
(ip.src == 127.0.0.1 || ip.dst == 127.0.0.1) && ip.dst != 239.255.255.250
```
or
```
(ip.src == 127.0.0.1 || ip.dst == 127.0.0.1 || tcp.dstport == 11111 || tcp.srcport == 11111 ) && ip.dst != 239.255.255.250
```

- ## Certs

In `ssl.c` this code section is using a value of `./certs/server-cert.pem` by default in Visual Studio:

```
WOLFSSL_ABI
int wolfSSL_CTX_use_certificate_file(WOLFSSL_CTX* ctx, const char* file,
                                     int format)
{
    WOLFSSL_ENTER("wolfSSL_CTX_use_certificate_file");

    if (ProcessFile(ctx, file, format, CERT_TYPE, NULL, 0, NULL,
                    GET_VERIFY_SETTING_CTX(ctx)) == WOLFSSL_SUCCESS) {
        return WOLFSSL_SUCCESS;
    }

    return WOLFSSL_FAILURE;
}

```

- ## Troubleshooting

Load key invalid format / Permission denied (publickey)

```
debug3: send_pubkey_test
debug3: send packet: type 50
debug2: we sent a publickey packet, wait for reply
debug3: receive packet: type 51
debug1: Authentications that can continue: publickey
debug1: Trying private key: /home/gojimmypi/certs/gojimmypi
Load key "/home/gojimmypi/certs/gojimmypi": invalid format
debug2: we did not send a packet, disable method
debug1: No more authentication methods to try.
gojimmypi@192.168.1.25: Permission denied (publickey).
```
Was the key file generated in Windows and being used in WSL/Linux? Replace CR/LF with LF:

```
dos2unix ~/certs/gojimmypi
```

- ### Identity File

See [Specifying an IdentityFile with SSH](https://unix.stackexchange.com/questions/494483/specifying-an-identityfile-with-ssh)
> _ This can be problematic when using sites like github with multiple accounts. You'll need to include "IdentitiesOnly yes_

```
ssh -p 11111 -vvvv -o IdentitiesOnly=yes -i c:\workspace\wolfssl-demo\cert\gojimmypi 192.168.1.31
```

- ### Error Messages

[What does 'key_load_public: no such file or directory' mean?](https://superuser.com/questions/962888/what-does-key-load-public-no-such-file-or-directory-mean)

> _the file mentioned below, not above. You have just the regular public keys, but you do not have the SSH certificates for them (presumably because you just don't need them). OpenSSH however will always try to load the associated .pub-cert file for each identity key_


see also:

- [wolfSSH Manual](https://www.wolfssl.com/docs/wolfssh-manual/)
- [OpenSSH Manual Pages](https://www.openssh.com/manual.html)
- [wolfSSL examples](https://github.com/wolfSSL/wolfssl/tree/master/examples)
- [ssh - OpenSSH remote login client man page](https://man.openbsd.org/ssh)
- [wolfSSL Espressif Support](https://www.wolfssl.com/docs/espressif/)
- [wolfSSL Support for ESP-IDF and ESP32-WROOM-32](https://www.wolfssl.com/wolfssl-support-esp-idf-esp32-wroom-32/)
- [ESP-IDF Programming Guide: Getting Started with the ESP32](https://docs.espressif.com/projects/esp-idf/en/latest/esp32/get-started/index.html)
- [wolfSSL ESP-IDF port](https://github.com/wolfSSL/wolfssl/tree/master/IDE/Espressif/ESP-IDF)
- [wolfSSH testing notes](https://github.com/wolfSSL/wolfssh/blob/master/README.md#testing-notes); note `user` and `password` defaults
- [wolfSSH Getting Started Client Example](https://github.com/wolfSSL/wolfssl/wiki/Getting-Started#33-client-example)
- [How to SSH into WSL2 on Windows 10 from an external machine](https://www.hanselman.com/blog/how-to-ssh-into-wsl2-on-windows-10-from-an-external-machine)

my GitHub issues:

- [wolfSSL/wolfssh add commands noted in wolfssl/issues/4272](https://github.com/wolfSSL/wolfssh/pull/356)
- [wolfSSL/wolfssl #4281 unable to connect to ssh example echoserver with putty](https://github.com/wolfSSL/wolfssl/issues/4281)
- [wolfSSL/wolfssl #4272 Where to find libwolfssl ?](https://github.com/wolfSSL/wolfssl/issues/4272)
