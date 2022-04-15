---
layout: post
title: "Getting Started with wolfSSL for Espressif ESP32"
date: '2022-03-27'
author: gojimmypi
tags:
- wolfSSL
- Espressif
- ESP32
---

Some tips for using wolfSSL on the Espressif ESP32

# Getting Started with wolfSSL for Espressif ESP32

Like many things: _it's easy when you know how_. Here are some notes on getting started with wolfSSL encryption on the Espressif ESP32.

TL;DR:

* Install the [ESP-IDF](https://docs.espressif.com/projects/esp-idf/en/latest/esp32/get-started/index.html).
* Use the [setup_win](https://github.com/gojimmypi/wolfssl/blob/master/IDE/Espressif/ESP-IDF/setup_win.bat) to copy selected files
into your `{IDF_PATH}/components/` directory.
* Include some wolfSSL settings and headers:

```

git clone https://github.com/gojimmypi/wolfssl.git wolfssl-gojimmypi-ESP32 --depth 1
cd wolfssl
./autogen.sh
./configure --enable-ssh
make check

# installs to /usr/local/lib
sudo make install


# install the SSH compoentents (wolfSSH)
git clone https://github.com/gojimmypi/wolfssh.git wolfssh-gojimmypi-ESP32
cd wolfssh-gojimmypi-ESP32
./autogen.sh

# the default shows /usr/local/ but it is actually in /usr/local/lib/ (why not default to wolfSSL?)
./configure --with-wolfssl=/usr/local/
make check
```


{% include code_header.html %}
```c
#define WOLFSSL_ESPIDF
#define WOLFSSL_ESPWROOM32
#define WOLFSSL_USER_SETTINGS
#include <wolfssl/wolfcrypt/settings.h> // make sure this appears before any other wolfSSL headers
#include <wolfssl/ssl.h>
```

* Edit user setting file is found in `{IDF_PATH}/components/wolfssl/include/user_settings.h`
* Plug in real certificates. See [DER to C](https://github.com/wolfSSL/wolfssl/blob/master/scripts/dertoc.pl).
* Reminder embedded RTOS has limited space. Beware of printf, etc.

## Install wolfSSL component

Start an EDP-IDF command prompt (or a regular DOS prompt if installing for VisualGDB)

```batch
# choose your workspace drive and directory:
c:
SET WORKSPACE=\workspace\

# fetch wolfSSL code and install to ESP32 component directory
if not exist %WORKSPACE% mkdir %WORKSPACE%
cd %WORKSPACE%
git clone https://github.com/wolfSSL/wolfssl.git
git clone https://github.com/wolfSSL/wolfssl-examples.git
cd wolfssl\IDE\Espressif\ESP-IDF

# install for the current %IDF_PATH%
.\setup_win.bat

# Alternatively, pass a parameter for an alternate ESP-IDF path (e.g. VisualGDB)
# .\setup_win.bat C:\SysGCC\esp32\esp-idf\v4.4
```

## Examples

I've created some heavily commented examples of using wolfSSL TLS1.3 on the Espressif ESP32 WROOM using
the VisualGDB extension for Visual Studio:

#### ESP32 TLS 1.3 Server

- [Wireless STA server](https://github.com/gojimmypi/wolfssl-examples/blob/ESP32_development/ESP32/TLS13-wifi_station-server/README.md)
- [Wired ENC28J60 server](https://github.com/gojimmypi/wolfssl-examples/blob/ESP32_development/ESP32/TLS13-ENC28J60-server/README.md)


#### ESP32 TLS 1.3 Client

- [Wireless STA client](https://github.com/gojimmypi/wolfssl-examples/blob/ESP32_development/ESP32/TLS13-wifi_station-client/README.md)
- [Wired ENC28J60 client](https://github.com/gojimmypi/wolfssl-examples/blob/ESP32_development/ESP32/TLS13-ENC28J60-client/README.md)

Although the examples were created with VisualGDB, they can be edited with your favorite editor an compiled with the ESP-IDF.

To aid in troubleshooting the ESP32 apps, I've also created [TLS1.3 Linux Projects](https://github.com/gojimmypi/wolfssl-examples/tree/ESP32_development/tls/VisualGDB-tls)
for all of the [wolfSSL-examples for TLS](https://github.com/wolfSSL/wolfssl-examples/tree/master/tls), also in the VisualGDB
environment. Of particular interest are the TLS1.3 apps:

- [Linux/WSL TLS1.3 Client](https://github.com/gojimmypi/wolfssl-examples/tree/ESP32_development/tls/VisualGDB-tls/client-tls13)
- [Linux/WSL TLS1.3 Server](https://github.com/gojimmypi/wolfssl-examples/tree/ESP32_development/tls/VisualGDB-tls/server-tls13)




## Tips and Troubleshooting

You must have at least _some_ wolfSSL-specific `#define` values *before* the includes.

Make sure that `<wolfssl/wolfcrypt/settings.h>` is included *before* any other woldSSL includes.

Check that there are no stray source files in your `{IDF_PATH}/components/`. It seems that `build` processes will compile, but `clean` does not remove object files
in the compoenents directory. The resulting errors can be rather unintuitive (yes, I learned this the hard way) 

If you are going to peek at packets, make sure you are using a hub and not a switch (recall a [switch](https://en.wikipedia.org/wiki/Network_switch) 
will suppress non-broadcast packets on your port). If you don't have a hub, then perhaps your switch can be configured for
[post monitoring](https://en.wikipedia.org/wiki/Port_mirroring). See my [prior blog for doing this with a Ubiquiti Edgerouter-X](https://gojimmypi.github.io/Edgerouter-Port-Monitor/).


`Error: Target not halted`, typically means there's a wiring problem.
```
VisualGDB_OpenOCD_Ready
Info : Listening on port 6666 for tcl connections
Info : Listening on port 61188 for telnet connections
Info : J-Link V10 compiled Nov  2 2021 12:14:50
Info : Hardware version: 10.10
Info : VTarget = 3.361 V
Info : clock speed 500 kHz
Error: JTAG scan chain interrogation failed: all ones
Error: Check JTAG interface, timings, target power, etc.
Error: Trying to use configured scan chain anyway...
Error: esp32.cpu0: IR capture error; saw 0x1f not 0x01
Warn : Bypassing JTAG setup events due to errors
Warn : target esp32.cpu0 examination failed
Warn : target esp32.cpu1 examination failed
Info : starting gdb server for esp32.cpu0 on 61190
Info : Listening on port 61190 for gdb connections
Info : accepting 'gdb' connection on tcp/61190
Error: Target not examined yet
Error executing event gdb-attach on target esp32.cpu0:

Warn : No symbols for FreeRTOS!
Error: Target not halted
Error: auto_probe failed
Error: Connect failed. Consider setting up a gdb-attach event for the target to prepare target for GDB connect, or use 'gdb_memory_map disable'.
Error: attempted 'gdb' connection rejected
```
