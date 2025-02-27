---
layout: post
title: "VisualGDB Notes for Toolchain and Registry Settings"
date: '2025-02-27'
author: gojimmypi
tags:
- VisualGDB
- Espressif
- Toolchain
---


```
Computer\HKEY_CURRENT_USER\Software\Free Software Foundation
```

Contains:

```
Windows Registry Editor Version 5.00

[HKEY_CURRENT_USER\Software\Free Software Foundation]

[HKEY_CURRENT_USER\Software\Free Software Foundation\SysGCC-arm-eabi-10.3.1]
"BINUTILS"="c:\\sysgcc\\arm-eabi"
"G++"="c:\\sysgcc\\arm-eabi"
"GCC"="c:\\sysgcc\\arm-eabi"

[HKEY_CURRENT_USER\Software\Free Software Foundation\SysGCC-arm-eabi-12.3.1]
"BINUTILS"="c:\\sysgcc\\arm-eabi"
"G++"="c:\\sysgcc\\arm-eabi"
"GCC"="c:\\sysgcc\\arm-eabi"

[HKEY_CURRENT_USER\Software\Free Software Foundation\SysGCC-arm-eabi-13.3.1]
"BINUTILS"="c:\\sysgcc\\arm-eabi"
"G++"="c:\\sysgcc\\arm-eabi"
"GCC"="c:\\sysgcc\\arm-eabi"

[HKEY_CURRENT_USER\Software\Free Software Foundation\SysGCC-arm-eabi-14.2.1]
"BINUTILS"="c:\\sysgcc\\arm-eabi"
"G++"="c:\\sysgcc\\arm-eabi"
"GCC"="c:\\sysgcc\\arm-eabi"

[HKEY_CURRENT_USER\Software\Free Software Foundation\SysGCC-xtensa-esp32-elf-11.2.0]
"BINUTILS"="C:\\SysGCC\\esp32-11.2"
"G++"="C:\\SysGCC\\esp32-11.2"
"GCC"="C:\\SysGCC\\esp32-11.2"

[HKEY_CURRENT_USER\Software\Free Software Foundation\SysGCC-xtensa-esp32-elf-12.2.0]
"BINUTILS"="c:\\SysGCC\\esp32.12.2"
"G++"="c:\\SysGCC\\esp32.12.2"
"GCC"="c:\\SysGCC\\esp32.12.2"

[HKEY_CURRENT_USER\Software\Free Software Foundation\SysGCC-xtensa-esp32-elf-13.2.0]
"BINUTILS"="C:\\SysGCC\\esp32-14.2"
"G++"="C:\\SysGCC\\esp32-14.2"
"GCC"="C:\\SysGCC\\esp32-14.2"

[HKEY_CURRENT_USER\Software\Free Software Foundation\SysGCC-xtensa-esp32-elf-8.4.0]
"BINUTILS"="C:\\SysGCC\\esp32-8.4"
"G++"="C:\\SysGCC\\esp32-8.4"
"GCC"="C:\\SysGCC\\esp32-8.4"

[HKEY_CURRENT_USER\Software\Free Software Foundation\SysGCC-xtensa-lx106-elf-8.4.0]
"BINUTILS"="C:\\SysGCC\\esp8266"
"G++"="C:\\SysGCC\\esp8266"
"GCC"="C:\\SysGCC\\esp8266"
```

User Registry Location

```
Computer\HKEY_USERS\S-1-5-21-[user guid]\Software\Free Software Foundation
```

User Registry Keys

```
Windows Registry Editor Version 5.00

[HKEY_USERS\S-1-5-21-186964195-3530471707-4236117787-1002\Software\Free Software Foundation]

[HKEY_USERS\S-1-5-21-186964195-3530471707-4236117787-1002\Software\Free Software Foundation\SysGCC-arm-eabi-10.3.1]
"BINUTILS"="c:\\sysgcc\\arm-eabi"
"G++"="c:\\sysgcc\\arm-eabi"
"GCC"="c:\\sysgcc\\arm-eabi"

[HKEY_USERS\S-1-5-21-186964195-3530471707-4236117787-1002\Software\Free Software Foundation\SysGCC-arm-eabi-12.3.1]
"BINUTILS"="c:\\sysgcc\\arm-eabi"
"G++"="c:\\sysgcc\\arm-eabi"
"GCC"="c:\\sysgcc\\arm-eabi"

[HKEY_USERS\S-1-5-21-186964195-3530471707-4236117787-1002\Software\Free Software Foundation\SysGCC-arm-eabi-13.3.1]
"BINUTILS"="c:\\sysgcc\\arm-eabi"
"G++"="c:\\sysgcc\\arm-eabi"
"GCC"="c:\\sysgcc\\arm-eabi"

[HKEY_USERS\S-1-5-21-186964195-3530471707-4236117787-1002\Software\Free Software Foundation\SysGCC-arm-eabi-14.2.1]
"BINUTILS"="c:\\sysgcc\\arm-eabi"
"G++"="c:\\sysgcc\\arm-eabi"
"GCC"="c:\\sysgcc\\arm-eabi"

[HKEY_USERS\S-1-5-21-186964195-3530471707-4236117787-1002\Software\Free Software Foundation\SysGCC-xtensa-esp32-elf-11.2.0]
"BINUTILS"="C:\\SysGCC\\esp32-11.2"
"G++"="C:\\SysGCC\\esp32-11.2"
"GCC"="C:\\SysGCC\\esp32-11.2"

[HKEY_USERS\S-1-5-21-186964195-3530471707-4236117787-1002\Software\Free Software Foundation\SysGCC-xtensa-esp32-elf-12.2.0]
"BINUTILS"="c:\\SysGCC\\esp32.12.2"
"G++"="c:\\SysGCC\\esp32.12.2"
"GCC"="c:\\SysGCC\\esp32.12.2"

[HKEY_USERS\S-1-5-21-186964195-3530471707-4236117787-1002\Software\Free Software Foundation\SysGCC-xtensa-esp32-elf-13.2.0]
"BINUTILS"="C:\\SysGCC\\esp32-14.2"
"G++"="C:\\SysGCC\\esp32-14.2"
"GCC"="C:\\SysGCC\\esp32-14.2"

[HKEY_USERS\S-1-5-21-186964195-3530471707-4236117787-1002\Software\Free Software Foundation\SysGCC-xtensa-esp32-elf-8.4.0]
"BINUTILS"="C:\\SysGCC\\esp32-8.4"
"G++"="C:\\SysGCC\\esp32-8.4"
"GCC"="C:\\SysGCC\\esp32-8.4"

[HKEY_USERS\S-1-5-21-186964195-3530471707-4236117787-1002\Software\Free Software Foundation\SysGCC-xtensa-lx106-elf-8.4.0]
"BINUTILS"="C:\\SysGCC\\esp8266"
"G++"="C:\\SysGCC\\esp8266"
"GCC"="C:\\SysGCC\\esp8266"


```


```
Computer\HKEY_CURRENT_USER\Software\Sysprogs\GNUToolchains
```

```
Windows Registry Editor Version 5.00

[HKEY_CURRENT_USER\Software\Sysprogs\GNUToolchains]
"SysGCC-xtensa-esp32-elf-11.2.0"="C:\\SysGCC\\esp32-11.2"
"SysGCC-xtensa-lx106-elf-8.4.0"="C:\\SysGCC\\esp8266"
"SysGCC-xtensa-esp32-elf-8.4.0"="C:\\SysGCC\\esp32-8.4"
"SysGCC-arm-eabi-10.3.1"="c:\\sysgcc\\arm-eabi"
"SysGCC-arm-eabi-12.3.1"="c:\\sysgcc\\arm-eabi"
"SysGCC-xtensa-esp32-elf-12.4.0"="C:\\SysGCC\\esp32-12.4"
"SysGCC-xtensa-esp32-elf-master"="C:\\SysGCC\\esp32-master"
"SysGCC-arm-eabi-13.3.1"="c:\\sysgcc\\arm-eabi"
"SysGCC-xtensa-esp32-elf-13.2.0"="C:\\SysGCC\\esp32-14.2"
"SysGCC-arm-eabi-14.2.1"="c:\\sysgcc\\arm-eabi"
```
