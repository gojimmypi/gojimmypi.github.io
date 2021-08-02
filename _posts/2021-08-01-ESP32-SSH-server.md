---
layout: post
title: "ESP32 SSH Server"
date: '2021-08-01'
author: gojimmypi
tags:
- ESP32
- WolfSSL
- SSH
---

(draft / WIP)

I was inspired by a tweet from [Andrew Zonenberg](https://twitter.com/azonenberg/status/1418651252007706625?s=20):

>  what is the simplest, lowest cost, lowest power way to implement an embedded SSH-to-UART bridge?

I'm using the [Espressif enc28j60 ethernet example](https://github.com/espressif/esp-idf/tree/master/examples/ethernet/enc28j60)
that compiled just fine... but on to the SSH server.

It is best to find a device that has [WolfSSH hardware encryption support](https://www.wolfssl.com/docs/hardware-crypto-support/)

See [WolfSSL Manual](https://www.wolfssl.com/docs/wolfssl-manual/) specfically the [wolfSSL ESP32 Support](https://www.wolfssl.com/docs/espressif/)

I downloaded the 758KB [wolfssh-1.4.6.zip](https://www.wolfssl.com/download/) and saved the WolfSSH zip file contents to my `C:\workspace\WolfSSL` directory.

Note that there are DIFFERENT files in the GitHub repo as compared to zip file. In particular the `autogen.sh` noted in the [Configuring the wolfSSH Lightweight SSH Library blog](https://www.wolfssl.com/configuring-wolfssh-lightweight-ssh-library/) is NOT included in the zip download. :/

```
cd /mnt/c/workspace/
git clone https://github.com/wolfSSL/wolfssh.git --recursive
cd wolfssh
./autogen.sh
./configure
```

yields this error:

```
checking for wolfCrypt_Init in -lwolfssl... no
configure: error: libwolfssl is required for wolfssh. It can be obtained from https://www.wolfssl.com/download.html/ .
```

and of course there are no dowloads that reference `libwolfssl ` at https://www.wolfssl.com/download.html

> In order to use wolfSSL with the Espressif ESP-IDF, a development framework for intended for rapidly developing Internet-of-Things (IoT), deploy wolfSSL source files into the IDE by running a script that can be found in the `wolfssl_root/wolfssl/IDE/Espressif/ESP-IDF/` directory.

Sadly I had no such directory. The only thing was a WolfSSH directory with some source code files.

I next downloaded the 2,339 file 11,559KB [wolfssl-4.8.1.zip](https://www.wolfssl.com/download/) and saved the contents of the zip to `C:\workspace\WolfSSL`

```
. $HOME/esp/esp-idf/export.sh
cd ~/esp
cp -r $IDF_PATH/examples/ethernet/enc28j60 .
cd enc28j60
idf.py build

# the WolfSSH part

cd /mnt/c/workspace/WolfSSL/IDE/Espressif/ESP-IDF
./setup.sh

# the only output from the above ./setup.sh is:
# Copy files into /home/gojimmypi/esp/esp-idf

cd ~/esp
cp -r /mnt/c/workspace/WolfSSL/IDE/Espressif/ESP-IDF/examples/wolfssl_benchmark .
cd wolfssl_benchmark
cp sdkconfig.defaults sdkconfig
make

# the Espressif config pops up
```

the `idf.py build` does not work here.

I got stuck for a rather long time for the message: "configure your TLS 1.3 DH key size":

```
AR build/main/libmain.a
CC build/wolfssl/src/tls.o
In file included from /home/gojimmypi/esp/esp-idf/components/wolfssl/src/tls.c:28:
/home/gojimmypi/esp/esp-idf/components/wolfssl/wolfssl/wolfcrypt/settings.h:2284:14: warning: #warning "For timing resistance / side-channel attack prevention consider using harden options" [-Wcpp]
             #warning "For timing resistance / side-channel attack prevention consider using harden options"
              ^~~~~~~
/home/gojimmypi/esp/esp-idf/components/wolfssl/src/tls.c:90:10: error: #error Please configure your TLS 1.3 DH key size using either: HAVE_FFDHE_2048, HAVE_FFDHE_3072, HAVE_FFDHE_4096, HAVE_FFDHE_6144 or HAVE_FFDHE_8192
         #error Please configure your TLS 1.3 DH key size using either: HAVE_FFDHE_2048, HAVE_FFDHE_3072, HAVE_FFDHE_4096, HAVE_FFDHE_6144 or HAVE_FFDHE_8192
          ^~~~~
/home/gojimmypi/esp/esp-idf/make/component_wrapper.mk:291: recipe for target 'src/tls.o' failed
make[1]: *** [src/tls.o] Error 1
/home/gojimmypi/esp/esp-idf/make/project.mk:646: recipe for target 'component-wolfssl-build' failed
make: *** [component-wolfssl-build] Error 2
```

As I could not seem to find where to fix this, and a simple `#define HAVE_FFDHE_2048` did not work. 

There's an [Espressif esp-wolfssl](https://github.com/espressif/esp-wolfssl) that's interesting. One comment to note:

> Until March 2021, this repository contained binary distribution of wolfSSL libraries, which could be used royalty-free on all Espressif MCU products. This royalty-free binary distribution is not available anymore.

So next

```
cd /mnt/c/workspace/
git clone --recursive https://github.com/espressif/esp-wolfssl
cd esp-wolfssl

```

See  

[~/esp/esp-idf/components/wolfssl/wolfssl/wolfcrypt/settings.h](https://github.com/wolfSSL/wolfssl/blob/master/wolfssl/wolfcrypt/settings.h)

[Problems compiling the tls_client example on ESP-IDF on ATECC608A #3988](https://github.com/wolfSSL/wolfssl/issues/3988)


