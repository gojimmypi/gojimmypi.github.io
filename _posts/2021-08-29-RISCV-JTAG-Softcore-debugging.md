---
layout: post
title: "RISC-V JTAG Debugging"
description: "Some notes on RISC-V debugging. There are JTAG interfaces avilable on many hardware devices for single-step debugging code. But what about a softcore CPU"
date: '2021-08-29'
author: gojimmypi
tags:
- RISCV
- JTAG
- Debugging
- FPGA
---

Some notes on RISC-V debugging.

There are JTAG interfaces avilable on many hardware devices for single-step debugging code. But what about a softcore CPU built on an FPGA?

I [asked on Twitter](https://twitter.com/gojimmypi/status/1431746895152496640?s=20), and received some excellent responses:

First, [Tom Verbeure](https://twitter.com/tom_verbeure/status/1431806782834241538?s=20) has an excellent blog on [VexRiscv, OpenOCD, and Traps](https://tomverbeure.github.io/2021/07/18/VexRiscv-OpenOCD-and-Traps.html).
He also mentioned [Implementing VexRiscv Based Murax SoC on Arty A7 Artix-7 PCB from Digilent and Enabling JTAG Connection through Xilinx BSCANE2 Debug IP](https://github.com/SpinalHDL/VexRiscv/tree/master/doc/nativeJtag)

[Luke Wren Replied](https://twitter.com/wren6991/status/1431967652457689089?s=20) with a link to [Hazard3 a 3-stage RISC-V processor](https://github.com/Wren6991/Hazard3/)

There's also two interesting resources from [@Ruinland_Mask](https://twitter.com/Ruinland_Mask/status/1431899569881706503?s=20) for
this [JTAG Debug Transport Module TAP Spec](https://github.com/riscv/riscv-debug-spec/blob/master/jtagdtm.tex) in the [riscv/riscv-debug-spec](https://github.com/riscv/riscv-debug-spec) repo,
as well as reference implmeneation [RISC-V Debug Support for PULP Cores](https://github.com/pulp-platform/riscv-dbg) and this DTM in VHDL called the [NEORV32 - RISC-V Debug Transport Module](https://github.com/stnolting/neorv32/blob/master/rtl/core/neorv32_debug_dtm.vhd).



