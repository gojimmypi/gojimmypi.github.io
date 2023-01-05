---
layout: post
title: "Notes for Hazard3 RISC-V with JTAG"
date: '2022-09-04'
author: gojimmypi
tags:
- FPGA
- RISC-V
- JTAG
- Hazard3
- X-Windows
- WSL
---


Notes on [Wren6991's Hazard3 Soft RISC-V with JTAG](https://github.com/Wren6991/Hazard3)

See the [YosysHQ OSS CAD Suite Installation](https://github.com/YosysHQ/oss-cad-suite-build#installation)

Be sure to use the `-L` with `curl`. See [Dealing with HTTP 301 redirected file](https://www.cyberciti.biz/faq/download-a-file-with-curl-on-linux-unix-command-line/).

Reminder that the ULX3S needs to have FTDI drivers to program the FPGA, but libusbK drivers to use OpenOCD
on Windows. Zadig is your friend. See [prior blog](https://gojimmypi.github.io/SSH-to-ULX3S-ESP32/).

First install the [YosysHQ OSS CAD Suite](https://github.com/YosysHQ/oss-cad-suite-build)
{% include code_header.html %}
```
# set your preferred location for the download & extracted binary:
export MYOSSCADSUITE=/mnt/c/download/yosyshq

mkdir -p $MYOSSCADSUITE
cd $MYOSSCADSUITE

# See https://github.com/YosysHQ/oss-cad-suite-build/releases, this version is the Sept 4, 2022 build:
curl -L "https://github.com/YosysHQ/oss-cad-suite-build/releases/download/2022-09-04/oss-cad-suite-linux-x64-20220904.tgz"
tar -zxvf oss-cad-suite-linux-x64-20220904.tgz
source $MYOSSCADSUITE/oss-cad-suite/environment
```

```
export MY_GITHUB_NAME=gojimmypi
export WORKSPACE="/mnt/c/workspace"
export MY_HAZARD3_NAME="hazard3-$MY_GITHUB_NAME" 
export MY_HAZARD3_PATH="$WORKSPACE/$MY_HAZARD3_NAME"

cd $WORKSPACE

git clone --recursive https://github.com/$MY_GITHUB_NAME/Hazard3.git "$MY_HAZARD3_NAME"

cd "$MY_HAZARD3_NAME"

# if the above is your fork, then add upstream
git remote add upstream https://github.com/Wren6991/Hazard3.git

# fetch upstream master
git fetch upstream
git pull upstream master
```

or

Fetch [Luke's Hazard3](https://github.com/Wren6991/Hazard3) repo:
```
git clone --recursive https://github.com/$MY_GITHUB_NAME/Hazard3.git 
```

Perform the install steps:
{% include code_header.html %}
```bash

# Set up some paths, add RISC-V toolchain to PATH
. sourceme

cd test/sim/tb_cxxrtl

# yes, make can be slow on some systems. patience:
make
```

Later, once installed, revisit with:
{% include code_header.html %}
```bash
git fetch
git pull

# edit for your own download:
export MYOSSCADSUITE=/mnt/c/download/yosyshq
source $MYOSSCADSUITE/oss-cad-suite/environment

export DISPLAY=:0
/mnt/c/cygwin64/bin/run.exe --quote /usr/bin/bash.exe -l -c " exec /usr/bin/startxwin -- -listen tcp -nowgl"
```

There was a [small problem](https://github.com/Wren6991/Hazard3/issues/4) encountered. Although quickly resolved, for reference, 
this blog uses the [commit at f48177c](https://github.com/Wren6991/Hazard3/tree/f48177c6440c336e5a0f884d1a8d85d8bc0af87d).

Note that the [Makefile](https://github.com/Wren6991/Hazard3/blob/f48177c6440c336e5a0f884d1a8d85d8bc0af87d/test/sim/hellow/Makefile#L1) in `hazard3\test\sim\hellow` may need to be adjusted:

{% include code_header.html %}
```make
SRCS := ../common/init.S main.c
APP  := hellow
CCFLAGS = -march=rv32i -Os
AFLAGS = -march=rv32i

include ../common/src_only_app.mk
```

The RISC-V toolchain that was already installed did not support the z-opcodes, so the `-march=rv32i_zicsr_zba_zbb_zbc_zbs` parameter 
was changed to `-march=rv32i` for this exercise. The specific version of the riscv32 compiler used:

```
0 $  riscv32-unknown-elf-gcc --version
riscv32-unknown-elf-gcc (GCC) 10.1.0
Copyright (C) 2020 Free Software Foundation, Inc.
This is free software; see the source for copying conditions.  There is NO
warranty; not even for MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
```

## X-Windows Server for WSL

This section won't apply to native Linux.

#### Windows Store X-Server

Launch the [Windows X-Server from the Microsoft Store](https://www.microsoft.com/store/productId/9NLP712ZMN9Q). Just click the `Open` button. 
There's no obvious UI, and nothing _appears_ to happen. There should be a `X410` Background Process running as viewed in Windows Task Manager.


This text is from the Windows Store as a reminder:

X410 is an X-Window server for Windows 10 and later. When you want to use X-Window GUI apps on your server from Windows, simply start X410 and connect to the server via SSH with X11 forwarding; your GUI apps are automatically forwarded to Windows as you launch them. X410 also works flawlessly with your locally installed virtual machines and WSL (Windows Subsystem for Linux) as well as Docker containers.


// USAGE TIPS & NOTES

- While X410 is in desktop mode, you can maximize or restore the X410 window by pressing CTRL+ALT+BACKSPACE.
- Running X410 on HiDPI/4K Screens: https://x410.dev/cookbook/running-x410-on-hidpi-screens/
- Opening Ubuntu Desktop in Hyper-V VM on X410 over VSOCK; no need for TCP/IP network or firewall permissions!
https://x410.dev/cookbook/hyperv/using-x410-with-hyper-v-linux-virtual-machines-via-vsock/

For more tips and usage examples, please visit https://x410.dev/.

####

sudo apt-get install gdb-multiarch
gdb-multiarch

#### CygwinX X-Server

I also have a [gist](https://gist.github.com/gojimmypi/7b65583f32434186dd002f35e26c1644) for doing this with the [CygwinX](https://x.cygwin.com/docs/ug/setup.html) in a makefile,
basically just need to:

{% include code_header.html %}
```
export DISPLAY=:0
/mnt/c/cygwin64/bin/run.exe --quote /usr/bin/bash.exe -l -c " exec /usr/bin/startxwin -- -listen tcp -nowgl"
```

May need to do this once:
{% include code_header.html %}
```
cp /mnt/c/cygwin64/home/$(shell cmd.exe /c "echo $$USER")/.Xauthority   ~/.Xauthority
```

Here's the entire makefile section:
{% include code_header.html %}
```
PROJ = ulx3s_adda
sim: 
	rm -f $(PROJ).vcd
	iverilog  -o $(PROJ).vvp $(PROJ).v $(PROJ)_tb.v
	vvp $(PROJ).vvp
	export DISPLAY=:0

## if we are running in WSL, we need a bit of help for GUI XWindows
## and sometimes the WSL username is not the same as the Windows username & we need the *windows* user path.
## this is the Windows %USER% environment variable when called from makefile: $(shell cmd.exe /c "echo $$USER")
	@if [ "$(shell grep Microsoft /proc/version)" != "" ]; then   \
			cp /mnt/c/cygwin64/home/$(shell cmd.exe /c "echo $$USER")/.Xauthority   ~/.Xauthority; \
	fi

	(gtkwave $(PROJ).vcd $(PROJ)_savefile.gtkw)&

xserver:
## launch the Windows cygwin64 startxwin when WSL is detected
	@if [ "$(shell grep Microsoft /proc/version)" != "" ]; then   \
		echo "Launching Windows XServer from WSL...";         \
		(/mnt/c/cygwin64/bin/run.exe --quote /usr/bin/bash.exe -l -c " exec /usr/bin/startxwin -- -listen tcp -nowgl")&  \
	else                                                          \
		echo "Not launching WSL XServer!" ;                   \
	fi
```

I ended up running into an [error I could not resolve](https://github.com/Wren6991/Hazard3/issues/4). 
Thank you, Luke for the [prompt resolution](https://github.com/Wren6991/Hazard3/issues/4#issuecomment-1236430541)!.

Next, [install RISC-C OpenOCD](https://github.com/Wren6991/Hazard3#building-riscv-openocd), in this case for WSL2:
```bash
cd /mnt/c/workspace/

git clone https://github.com/riscv/riscv-openocd.git
cd riscv-openocd
./bootstrap
# Prefix is optional
./configure --enable-remote-bitbang --enable-ftdi --program-prefix=riscv-
make -j $(nproc)

# this next command took a LONG time for me on WSL1 (perhaps because a slow shared file system)
sudo make install
```

For users of WSL1, well, there's no native USB driver support for the FTDI, so there will likely be an error like this:
```text
0 $  riscv-openocd -f ../icebreaker-openocd.cfg
Open On-Chip Debugger 0.11.0+dev-02440-gd6bf02256 (2022-11-27-11:01)
Licensed under GNU GPL v2
For bug reports, read
        http://openocd.org/doc/doxygen/bugs.html
DEPRECATED! use 'ftdi tdo_sample_edge' not 'ftdi_tdo_sample_edge'
DEPRECATED! use 'ftdi device_desc' not 'ftdi_device_desc'
DEPRECATED! use 'ftdi vid_pid' not 'ftdi_vid_pid'
DEPRECATED! use 'ftdi channel' not 'ftdi_channel'
DEPRECATED! use 'ftdi layout_init' not 'ftdi_layout_init'
Info : auto-selecting first available session transport "jtag". To override use 'transport select <transport>'.
Error: libusb_init() failed with LIBUSB_ERROR_OTHER
```

For WSL1, we'll need to cross-compile the Windows native app:
```bash
./bootstrap
./configure --host=i686-w64-mingw32   --enable-remote-bitbang --enable-ftdi --program-prefix=riscv-
make -j $(nproc)
```


First build libusb
install from https://github.com/libusb/libusb/releases/tag/v1.0.26 see [other releases](https://github.com/libusb/libusb/releases)

```
sudo apt install libudev-dev 

cd libusb-1.0.21

./bootstrap.sh

./autogen.sh

./configure --enable-shared=no --enable-static=yes --enable-examples-build  --host=i686-w64-mingw32 --build=i686-pc-linux-gnu
make clean
make -j $(nproc)

cd examples
./listdevs.exe
```


undefined reference:
```
# export LIBUSB1_LIBS="-L/mnt/c/workspace/riscv-openocd/libusb-1.0.21/libusb"
export LIBUSB_VER=libusb-1.0.21
export LIBUSB1_LIBS="-lusb-1.0 -L/mnt/c/temp/riscv-openocd/libusb-1.0.26/libusb"
export LIBUSB1_CFLAGS="-lusb-1.0.21 -isystem /mnt/c/workspace/riscv-openocd/libusb-1.0.21/libusb"
```

now:
```
export LIBUSB_VER=libusb-1.0.21

#export LIBUSB1_LIBS="-L/mnt/c/workspace/riscv-openocd/libusb-1.0.21/libusb/.libs"
export LIBUSB1_LIBS="-L/mnt/c/workspace/riscv-openocd/$LIBUSB_VER/libusb/.libs"


# export LIBUSB1_CFLAGS="-lusb -lusb-1.0.21 -isystem /mnt/c/workspace/riscv-openocd/libusb-1.0.21/libusb/.libs"
export LIBUSB1_CFLAGS="-lusb -lusb-1.0 -isystem /mnt/c/workspace/riscv-openocd/libusb-1.0.21/libusb/.libs"
export LDFLAGS=-L/mnt/c/workspace/riscv-openocd/libusb-1.0.21/libusb/.libs
export CPPFLAGS=-I/mnt/c/workspace/riscv-openocd/libusb-1.0.21/libusb

export LD_LIBRARY_PATH=/mnt/c/workspace/riscv-openocd/libusb-1.0.21/libusb/.libs
export CFLAGS=-I/mnt/c/workspace/riscv-openocd/libusb-1.0.21/libusb
PATH=$PATH:/mnt/c/workspace/riscv-openocd/libusb-1.0.21/libusb/.libs


# export LIBUSB1_CFLAGS="-lusb -lusb-1.0 -isystem /mnt/c/workspace/riscv-openocd/libusb-1.0.21/libusb"
export LIBUSB1_CFLAGS="-lusb -lusb-1.0 -isystem /mnt/c/workspace/riscv-openocd/$LIBUSB_VER/libusb"

echo "LIBS               = $LIBS"
echo "LIBUSB_VER        = $LIBUSB_VER"
echo "LIBUSB1_LIBS      = $LIBUSB1_LIBS"
echo "LIBUSB1_CFLAGS    = $LIBUSB1_CFLAGS"
echo "LDFLAGS           = $LDFLAGS"
echo "CPPFLAGS          = $CPPFLAGS"
echo "LD_LIBRARY_PATH   = $LD_LIBRARY_PATH"
echo "LT_SYS_LIBRARY_PATH = $LT_SYS_LIBRARY_PATH"
echo "PKG_CONFIG_PATH    = $PKG_CONFIG_PATH"

# testing this one
 ./configure --enable-maintainer-mode --build=i686-pc-linux-gnu --host=i686-w64-mingw32 --libdir=/mnt/c/workspace/riscv-openocd/libusb-1.0.21/libusb/.libs  --disable-werror   --with-ftd2xx-win32-zipdir="/mnt/c/download/FTDI/CDM v2.12.24 WHQL Certified/i386"  --with-ftd2xx-lib=static  --enable-ft2232_ftd2xx   --disable-at91rm9200  --enable-remote-bitbang --enable-ftdi --program-prefix=riscv- --enable-debug-log --disable-usb-blaster 


# this is failing:
i686-w64-mingw32-gcc -Wall -Wstrict-prototypes -Wformat-security -Wshadow -Wextra -Wno-unused-parameter -Wbad-function-cast -Wcast-align -Wredundant-decls -Wpointer-arith -Wundef -Wno-error=deprecated-declarations -DFD_SETSIZE=128 -I/mnt/c/workspace/riscv-openocd/libusb-1.0.21/libusb -o src/openocd.exe src/main.o  -L/mnt/c/workspace/riscv-openocd/libusb-1.0.21/libusb/.libs src/.libs/libopenocd.a -L/mnt/c/workspace/riscv-openocd/libusb-1.0.21/libusb -lws2_32 ./jimtcl/libjim.a

# consider x86_64-w64-mingw32

# TADA!!
i686-w64-mingw32-gcc -Wall -Wstrict-prototypes -Wformat-security -Wshadow -Wextra -Wno-unused-parameter -Wbad-function-cast -Wcast-align -Wredundant-decls -Wpointer-arith -Wundef -Wno-error=deprecated-declarations -DFD_SETSIZE=128 -I/mnt/c/workspace/riscv-openocd/libusb-1.0.21/libusb -o src/openocd.exe src/main.o  -L/mnt/c/workspace/riscv-openocd/libusb-1.0.21/libusb/.libs src/.libs/libopenocd.a libusb-1.0.21/libusb/.libs/libusb-1.0.a   -L/mnt/c/workspace/riscv-openocd/libusb-1.0.21/libusb -lws2_32 ./jimtcl/libjim.a
```

next test with libusb

The message: configure: error: libusb-1.x is required for the MPSSE mode of FTDI based devices, means this is needed:

```
export LIBUSB1_LIBS=-L/mnt/c/workspace/riscv-openocd/libusb-1.0.21/libusb/.libs
export LIBUSB1_CFLAGS="-lusb -lusb-1.0 -isystem /mnt/c/workspace/riscv-openocd/libusb-1.0.21/libusb"
```


Final test:

install from https://github.com/libusb/libusb/releases/tag/v1.0.26
(copy zip contents into riscv-openocd )

```
export MY_FTDI_ZIP="/mnt/c/download/FTDI/CDM v2.12.24 WHQL Certified/i386"
export LIBUSB_VER=libusb-1.0.26


# export LIBUSB1_LIBS="-lusb-1.0 -L/mnt/c/temp/riscv-openocd/libusb-1.0.26/libusb"

# -lusb-1.0 -L/mnt/c/temp/riscv-openocd/libusb-1.0.26/libusb
export LIBUSB1_LIBS="-lusb-1.0 -L$PWD/$LIBUSB_VER/libusb"

# LIBUSB1_CFLAGS, for example:
#    -lusb -lusb-1.0 -isystem /mnt/c/temp/riscv-openocd/libusb-1.0.26/libusb
#
export LIBUSB1_CFLAGS="-lusb -lusb-1.0 -isystem $PWD/$LIBUSB_VER/libusb"

echo $LIBUSB_VER
echo $LIBUSB1_LIBS
echo $LIBUSB1_CFLAGS

./configure --enable-maintainer-mode --build=i686-pc-linux-gnu --host=i686-w64-mingw32 --disable-werror   --with-ftd2xx-win32-zipdir="/mnt/c/download/FTDI/CDM v2.12.24 WHQL Certified/i386"  --with-ftd2xx-lib=static  --enable-ft2232_ftd2xx   --disable-at91rm9200  --enable-remote-bitbang --enable-ftdi --program-prefix=riscv-
make clean
make -j $(nproc)
```

- riscv-openocd [source code](https://github.com/riscv/riscv-openocd)
- OpenOCD [CPU Configuration](https://openocd.org/doc/html/CPU-Configuration.html)
- GDB [Specifying a Debug Target](https://ftp.gnu.org/old-gnu/Manuals/gdb/html_chapter/gdb_15.html)
- RISC-V OpenOCD [Can't compile #571](https://github.com/riscv/riscv-openocd/issues/571)
- sifive/freedom-tools [unable to build openocd #5](https://github.com/sifive/freedom-tools/issues/5)
- gcc gnu [Host/Target specific installation notes for GCC](https://gcc.gnu.org/install/specific.html)
- Espressif [Instructions for building OpenOCD on windows are incorrect / incomplete (OCD-545) #221](https://github.com/espressif/openocd-esp32/issues/221)
- libusb [github.com/libusb](https://github.com/libusb/libusb)
- libusb [Windows wiki](https://github.com/libusb/libusb/wiki/Windows)
- libusb [FAQ](https://github.com/libusb/libusb/wiki/FAQ)
- stackoverflow [libusb-1.0 debug information](https://stackoverflow.com/questions/8480388/libusb-1-0-debug-informations)
- stackoverflow [Libusb undefined reference to](https://stackoverflow.com/questions/7050482/libusb-undefined-reference-to)
- mcuee archive [libusb-win32](https://github.com/mcuee/libusb-win32)
- Dangerousprototypes [Cross compiling OpenOCD for Windows](http://dangerousprototypes.com/docs/Compile_OpenOCD_for_Windows)
- [Undefined reference to libusb functions](https://stackoverflow.com/questions/41026957/undefined-reference-to-libusb-functions)
- [How to add a path to LDFLAGS](https://stackoverflow.com/questions/6254245/how-to-add-a-path-to-ldflags)
- FTDI [driver installation](https://ftdichip.com/document/installation-guides/)
- stackoverflow [How to install and use "make" in Windows?](https://stackoverflow.com/questions/32127524/how-to-install-and-use-make-in-windows) - [chocolatey](https://chocolatey.org/install)
- stackoverflow [Installing libusb-1.0 on Windows 7](https://stackoverflow.com/questions/20315797/installing-libusb-1-0-on-windows-7)
- gnu [cross compilation](https://www.gnu.org/software/automake/manual/html_node/Cross_002dCompilation.html)  
- gnu [Specifying target triplets](https://www.gnu.org/savannah-checkouts/gnu/autoconf/manual/autoconf-2.71/html_node/Specifying-Target-Triplets.html#Specifying-Names)
- sourceforce forum [[Libusb-devel] MinGW-W64 build of libusb-1.0 Windows Backend](https://sourceforge.net/p/libusb/mailman/message/25200713/)
- stack exchange [`openocd` configure script cannot find `libusb`](https://unix.stackexchange.com/questions/493785/openocd-configure-script-cannot-find-libusb): see `LIBUSB1_CFLAGS="-isystem /usr/include/libusb-1.0"`
- sifive/freedom-tools [unable to build openocd](https://github.com/sifive/freedom-tools/issues/5)
- bluecmd gist [Building OpenOCD 64-bit on Windows 10 with MSYS2 for ULX3S FTDI JTAG](https://gist.github.com/bluecmd/917e63d30e57e8be90ffd32d4b4f5549)
- Espressif [openocd-esp32/contrib/cross-build.sh](https://github.com/espressif/openocd-esp32/blob/master/contrib/cross-build.sh)
- gojimmypi [Fixing FTDI 2232HL Dual Interface / Single Device](https://gojimmypi.github.io/FTDI2232HL-Dual-Interface-fix/)
- stackoverflow [How to add a path to LDFLAGS](https://stackoverflow.com/questions/6254245/how-to-add-a-path-to-ldflags)
- stackoverflow [Undefined reference to libusb functions](https://stackoverflow.com/questions/41026957/undefined-reference-to-libusb-functions/)
- Espressif [Instructions for building OpenOCD on windows are incorrect / incomplete](https://github.com/espressif/openocd-esp32/issues/221)
- riscv-collab/riscv-gnu-toolchain [fails to build newlib with -march=rv32im_zba_zbb_zbc_zbs](https://github.com/riscv-collab/riscv-gnu-toolchain/issues/1105)
- [internal compiler error: in extract_insn](https://github.com/riscv-collab/riscv-gnu-toolchain/issues/199)
- gojimmypi [riscv-gnu-toolchain/issues/1105 comment](https://github.com/riscv-collab/riscv-gnu-toolchain/issues/1105#issuecomment-1333026702)

