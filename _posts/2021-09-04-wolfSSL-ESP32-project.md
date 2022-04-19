---
layout: post
title: "wolfSSL ESP32 project"
date: '2021-09-04'
author: gojimmypi
tags:
- ESP32
- wolfSSL
- SSH
- WSL
---

Some notes on a sample wolfSSL project for the ESP32.

the wolfssh include directory needs to be manually copied to the `components/wolfssl`.

As the Espressif IDE options is missing from [wolfssh/ide/](https://github.com/wolfSSL/wolfssh/tree/master/ide), 
files need to be manually copied:
{% include code_header.html %}
```bash
cd ~/esp/esp-idf/components/wolfssl/
cp -r /usr/local/include/wolfssh/ .
```

Environment setup:
{% include code_header.html %}
```
# set the project name here; should match the PROJECT_NAME in Makefile, and project() parameter in CMakeLists.txt
THIS_PROJECT=my_wolfssl2

WORKSPACE=/mnt/c/workspace

DOS_WORKSPACE=c:\\workspace

# when calling exe
ESP32_COM=COM9

# when using only WSL / Linux
ESP32_COM=/dev/ttyS9


PYTHON_EXE=/mnt/c/Users/$USER/AppData/Local/Programs/Python/Python38/python.exe 

cd ~/esp/esp-idf
. $HOME/esp/esp-idf/export.sh


cd $WORKSPACE

cp -r $IDF_PATH/examples/protocols/wolfssl_benchmark $THIS_PROJECT

# Edit Makefile and  CMakeLists.txt files as appropriate: PROJECT_NAME and project() parameter

cd $THIS_PROJECT
make

# menu will pop up, defaults can be accepted, so just exit

# for convenience and consistency, we'll copy the esptool.py tool to our project directory
cp $HOME/esp/esp-idf/components/esptool_py/esptool/esptool.py .

# Note in WSL, we'll can call the Windows exe, since we don't have native USB support for programming the device


$PYTHON_EXE $DOS_WORKSPACE\\$THIS_PROJECT\\esptool.py  --chip esp32  --port $ESP32_COM  --baud 115200 \
  --before default_reset  --after hard_reset write_flash -z  --flash_mode dio  --flash_freq 40m  --flash_size detect \
  0x1000  $DOS_WORKSPACE\\$THIS_PROJECT\\build\\bootloader\\bootloader.bin  \
  0x10000 $DOS_WORKSPACE\\$THIS_PROJECT\\build\\$THIS_PROJECT.bin           \
  0x8000  $DOS_WORKSPACE\\$THIS_PROJECT\\build\\partitions_singleapp.bin      

# but we don't need native USB, so programming over /dev/ttyS[x] in WSL also works:
/home/gojimmypi/esp/esp-idf/components/esptool_py/esptool/esptool.py --chip esp32 --port  $ESP32_COM --baud 115200 \
    --before default_reset --after hard_reset write_flash -z --flash_mode dio --flash_freq 40m --flash_size detect \
    0x1000  $WORKSPACE/$THIS_PROJECT/build/bootloader/bootloader.bin \
    0x10000 $WORKSPACE/$THIS_PROJECT/build/my_wolfssl.bin            \
    0x8000  $WORKSPACE/$THIS_PROJECT/build/partitions_singleapp.bin 

```

> _"If you are trying to use a `user_settings.h` with the `configure` script I would not recommend that approach instead when using the configure script it will generate the file `<wolfssl/options.h>` which is the replacement for `user_settings.h` when building with `./configure.`"_

From [Confusion about include path](https://www.wolfssl.com/forums/topic1517-solved-confusion-about-include-path.html)

See also:

[wolfssl Espressif ESP-IDF](https://github.com/wolfSSL/wolfssl/blob/master/IDE/Espressif/ESP-IDF/README.md)
[esp-idf hello world](https://github.com/espressif/esp-idf/blob/master/examples/get-started/hello_world/main/hello_world_main.c)