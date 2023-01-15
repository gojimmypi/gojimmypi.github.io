---
layout: post
title: "Hazard3 soft RISC-V"
date: '2022-11-30'
author: gojimmypi
tags:
- FPGA
---

This is some info for Hazard3. Currently messy and WIP.
The notes are for setting up a real app (wolfSSL benchmark) on 
the soft RISC-V for the ULX3S ECP5 FPGA.

```
export MYOSSCADSUITE=/mnt/c/download/yosyshq
export MY_GITHUB_NAME=gojimmypi
export WORKSPACE="/mnt/c/workspace"

export MY_HAZARD3_NAME="hazard3-$MY_GITHUB_NAME" 
export MY_HAZARD3_PATH="$WORKSPACE/$MY_HAZARD3_NAME"


source $MYOSSCADSUITE/oss-cad-suite/environment
 
cd $MY_HAZARD3_PATH

git fetch upstream
git pull upstream master

. sourceme

cd test/sim/tb_cxxrtl
make

cd ../hellow
make
```


Current point:
see also: C:\temp\testhaz
```
# elf:  /mnt/c/temp/testhaz/hazard3/test/sim/wolfssl_test/tmp/wolfssl_test.elf

# gdb
/opt/riscv/bin/riscv32-unknown-elf-gdb

```

DOS:
```
:: OpenCD
cd C:\temp\riscv-openocd\src\
openocd.exe -f ulx3s-openocd.cfg

```



```
C:\temp\riscv-openocd\src>openocd.exe -f ulx3s-openocd.cfg
```

Run WSL GDB from command prompt
```
wsl "riscv32-unknown-elf-gdb"
```

```
set confirm off
file ./tmp/wolfssl_test.elf
target extended-remote localhost:3333
stop
set remotetimeout 2000
load
compare-sections
# The processor will quit the simulation when after returning from main(), by
# writing to a magic MMIO register. openocd will be quite unhappy that the
# other end of its socket disappeared, so to avoid the resulting error
# messages, add a breakpoint before _exit.
break _exit
run
# Should break at _exit. Check the terminal with the simulator, you should see
# the hello world message. The exit code is in register a0, it should be 123:
info reg a0
```


- wolfSSL [Debugging and Logging](https://www.wolfssl.com/documentation/manuals/wolfssl/chapter08.html)
- GDB [Tutorial](https://www.cs.umd.edu/~srhuang/teaching/cmsc212/gdb-tutorial-handout.pdf)

 
