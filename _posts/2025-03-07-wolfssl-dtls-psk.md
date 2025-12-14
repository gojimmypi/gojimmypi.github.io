---
layout: post
title: "wolfSSL DTLS PSK"
date: '2025-03-07'
author: gojimmypi
tags:
- wolfSSL
- DTLS
- PSK
---

Some notes on using PSK.

Rebuild wolfSSL, create static shared library in `$HOME/wolfssl-install-psk`.

```bash
make clean
make distclean
rm -rf "$HOME/wolfssl-install-psk"

./configure --enable-all --disable-crypttests \
            --disable-examples \
            --enable-opensslall --enable-opensslextra \
            --enable-tls13 --enable-dtls13 --enable-dtls --enable-psk \
            CFLAGS="-DWOLFSSL_STATIC_PSK" --enable-shared \
            --prefix="$HOME/wolfssl-install-psk"

make
make install
```


# Build client-dtls-callback example

See https://github.com/wolfSSL/wolfssl-examples/blob/master/dtls/client-dtls-callback.c

Cloned in WSL here to directory: `C:\workspace\wolfssl-examples-gojimmypi`.

Edit port number as appropriate. Default is `11111`.

```
cd /mnt/c/workspace/wolfssl-examples-gojimmypi/dtls

export WOLFSSL_DIR="$HOME/wolfssl-install-psk"
export CFLAGS="-I$WOLFSSL_DIR/include"
export LDFLAGS="-L$WOLFSSL_DIR/lib"

export LD_LIBRARY_PATH="$HOME/wolfssl-install-psk/lib:$LD_LIBRARY_PATH"

gcc -o client-dtls-psk client-dtls-psk.c \
    -I$HOME/wolfssl-install-psk/include \
    -L$HOME/wolfssl-install-psk/lib -Wl,-rpath=$HOME/wolfssl-install-psk/lib -lwolfssl -lm

ldd $HOME/wolfssl-install-psk/lib/libwolfssl.so
```


```
./configure --disable-crypttests \
            --disable-examples \
            --enable-psk --enable-dtls --enable-dtls13   \
            --enable-aesccm --enable-aesgcm --enable-hkdf \
            --enable-rsa --enable-curve25519 --enable-ed25519 \
            CFLAGS="-DWOLFSSL_STATIC_PSK" --enable-shared \
            --prefix="$HOME/wolfssl-install-psk"
```

```
client-dtls-psk 127.0.0.1
```

WIP testing

wolfSSL install check:

```ps
cd C:\workspace\wolfssl-gojimmypi\wrapper\CSharp\Debug\x64\
dir *.dll
dumpbin /exports wolfssl.dll | Select-String psk
```

Client:

```
cd /mnt/c/workspace/wolfssl-examples-gojimmypi/dtls
/mytest.sh
```
