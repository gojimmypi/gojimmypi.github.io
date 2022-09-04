---
layout: post
title: "Hazard3-FPGA-SOFT-CPU-RISCV-JTAG"
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


{% include code_header.html %}
```
git clone --recursive https://github.com/Wren6991/Hazard3.git hazard3
cd hazard3
# Set up some paths, add RISC-V toolchain to PATH
. sourceme

cd test/sim/tb_cxxrtl
make

```


## X-Windows Server for WSL

This section won't apply to native Linux.

Launch the [Windows X-Server from the Microsoft Store](https://www.microsoft.com/store/productId/9NLP712ZMN9Q). Just click the `Open` button. 
There's no obvious UI, and nothing _appears_ to happen.

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

I ended up running into an error I could not resolve. Update coming hopefully soon here.


