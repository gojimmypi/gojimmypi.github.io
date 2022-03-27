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
* Use the [setup_win](https://github.com/wolfSSL/wolfssl/blob/master/IDE/Espressif/ESP-IDF/setup_win.bat) 
(see also my [updated version ](https://github.com/gojimmypi/wolfssl/blob/master/IDE/Espressif/ESP-IDF/setup_win.bat)) to copy selected files
into your `{IDF_PATH}/components/` directory.
* include some wolfSSL setthings and include files:


{% include code_header.html %}
```C
#define WOLFSSL_ESPIDF
#define WOLFSSL_ESPWROOM32
#define WOLFSSL_USER_SETTINGS
#include <wolfssl/wolfcrypt/settings.h> // make sure this appears before any other wolfSSL headers
#include <wolfssl/ssl.h>

#ifdef WOLFSSL_TRACK_MEMORY
#include <wolfssl/wolfcrypt/mem_track.h>
#endif
```

## Examples

## Tips and Troubleshooting

You must have at least SOME solfSSL-specific `#define` values *before* the includes.

Make sure that `<wolfssl/wolfcrypt/settings.h>` is included *before* any other woldSSL includes.

Check that there are no stray source files in your `{IDF_PATH}/components/`. It seems that `build` processes will compile, but `clean` does not remove object files
in the compoenents directory. The resulting errors can be rather unintuitive (yes, I learned this the hard way) 


