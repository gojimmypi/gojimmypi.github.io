---
layout: post
title: "ESP32 Segger JLink ESP32 OpenOCD GDB Debugging"
date: '2021-09-11'
author: gojimmypi
tags:
- ESP32
- GDB
- OpenOCD
- Segger
- JLink
- WSL
- Espressif
---

Some information on using Segger JLink to OpenOCD GDB debug an ESP32 project, specifically
my WIP [wolfSSL SSH Server](https://github.com/gojimmypi/wolfssl-esp32/tree/main/wolfssl_ssh_server).

ESP32 JTAG Pinout Wiring; Segger J-Link using WinUSB (v6.1.7600.16385)
```
TDI -> GPIO12
TCK -> GPIO13
TMS -> GPIO14
TDO -> GPIO15
TRST -> EN / RST (Reset)
GND -> GND
```

See [Espressif JTAG Debugging](https://docs.espressif.com/projects/esp-idf/en/latest/esp32/api-guides/jtag-debugging/) docs.

Install Espressif [Standard Setup of Toolchain for Windows](https://docs.espressif.com/projects/esp-idf/en/latest/esp32/get-started/windows-setup.html).

Proceed to install WSL toolchain components:

Apparently the `xtensa-esp32-elf` expects `python2.7` with `libpython2.7` installed:

```
sudo apt-get install python
apt-get install libpython2.7

sudo apt-get install make libtool pkg-config autoconf automake texinfo
sudo apt-get install libusb-1.0

```

In WSL, install the Espressif [openOCD-esp32](https://github.com/espressif/openocd-esp32):

```bash
cd /mnt/c/workspace/
git clone --recursive https://github.com/espressif/openocd-esp32.git
cd openocd-esp32
./bootstrap
./configure
```

Successful output should end like this:
```
configure: creating ./config.status
config.status: creating Makefile
config.status: creating libjaylink/Makefile
config.status: creating libjaylink/version.h
config.status: creating libjaylink.pc
config.status: creating Doxyfile
config.status: creating config.h
config.status: executing depfiles commands
config.status: executing libtool commands

libjaylink configuration summary:
 - Package version ................ 0.2.0-git-f73ad5e
 - Library version ................ 0:0:0
 - Installation prefix ............ /usr/local
 - Building on .................... x86_64-pc-linux-gnu
 - Building for ................... x86_64-pc-linux-gnu

Enabled transports:
 - USB ............................ yes
 - TCP ............................ yes



OpenOCD configuration summary
--------------------------------------------------
MPSSE mode of FTDI based devices        yes (auto)
cJTAG OSCAN1 tunneled thru MPSSE        yes (auto)
ST-Link Programmer                      yes (auto)
TI ICDI JTAG Programmer                 yes (auto)
Keil ULINK JTAG Programmer              yes (auto)
Altera USB-Blaster II Compatible        yes (auto)
Bitbang mode of FT232R based devices    yes (auto)
Versaloon-Link JTAG Programmer          yes (auto)
TI XDS110 Debug Probe                   yes (auto)
OSBDM (JTAG only) Programmer            yes (auto)
eStick/opendous JTAG Programmer         yes (auto)
Espressif JTAG Programmer               yes (auto)
Andes JTAG Programmer                   yes (auto)
USBProg JTAG Programmer                 yes (auto)
Raisonance RLink JTAG Programmer        yes (auto)
Olimex ARM-JTAG-EW Programmer           yes (auto)
CMSIS-DAP Compliant Debugger            no
Cypress KitProg Programmer              no
Altera USB-Blaster Compatible           yes (auto)
ASIX Presto Adapter                     yes (auto)
OpenJTAG Adapter                        yes (auto)
SEGGER J-Link Programmer                yes (auto)
```

Then `make` and `make install` (this may take a long time):
{% include code_header.html %}
```bash
cd /mnt/c/workspace/openocd-esp32
make
sudo make install
openocd --version
```

The reported `openocd` version should look something like `Open On-Chip Debugger  v0.10.0-esp32-20210902 (2021-09-11-13:52)`.

In a DOS Window (recall WSL doesn't support native USB for Segger J-Link), run `openocd`:

{% include code_header.html %}
```
cd c:\workspace\openocd-esp32\tcl
openocd -f interface/jlink.cfg -c "adapter_khz 4000" -f target/esp32.cfg
```

If errors are encountered, try:

- check JTAG connections
- try another ESP32 board
- try another USB cable
- setting different `adapter_khz` speeds
- repeated launch, try again.

See [JTAG Debugging Using Debugger](https://docs.espressif.com/projects/esp-idf/en/latest/esp32/api-guides/jtag-debugging/using-debugger.html#command-line) for the `gdbinit` file:

```
target remote :3333
set remote hardware-watchpoint-limit 2
mon reset halt
flushregs
thb app_main
c
```

In another Window, in this case WSL, run the `xtensa-esp32-elf-gdb`:

{% include code_header.html %}
```bash
# in case it is in a different locaion:
#
# /home/gojimmypi/.espressif/tools/xtensa-esp32-elf/esp-2021r1-8.4.0/xtensa-esp32-elf/bin/

cd  /mnt/c/workspace/wolfssl-esp32/wolfssl_ssh_server/build
xtensa-esp32-elf-gdb wolfssl_ssh_server.elf -x gdbinit --tui
```

in GDB:

```
# Next (step over)
n

#
```

## Config File Settings

For reference, the `interface/jlink.cfg` looks like [this](https://github.com/espressif/openocd-esp32/blob/master/tcl/interface/jlink.cfg).
Be sure to edit with the respective serial number of your device!

```
#
# SEGGER J-Link
#
# http://www.segger.com/jlink.html
#

interface jlink

# The serial number can be used to select a specific device in case more than
# one is connected to the host.
#
# Example: Select J-Link with serial number 123456789
#
jlink serial 123456789
```

The `target/esp32.cfg` looks like [this](https://github.com/espressif/openocd-esp32/blob/master/tcl/target/esp32.cfg):

```
# The ESP32 only supports JTAG.
transport select jtag

# Source the ESP common configuration file
source [find target/esp_common.cfg]

# Target specific registers
set EFUSE_MAC_ADDR_REG 0x3ff5A004

if { [info exists CHIPNAME] } {
	set _CHIPNAME $CHIPNAME
} else {
	set _CHIPNAME esp32
}

if { [info exists CPUTAPID] } {
	set _CPUTAPID $CPUTAPID
} else {
	set _CPUTAPID 0x120034e5
}

if { [info exists ESP32_ONLYCPU] } {
	set _ONLYCPU $ESP32_ONLYCPU
} else {
	set _ONLYCPU 3
}

if { [info exists ESP32_FLASH_VOLTAGE] } {
	set _FLASH_VOLTAGE $ESP32_FLASH_VOLTAGE
} else {
	set _FLASH_VOLTAGE 3.3
}

set _CPU0NAME cpu0
set _CPU1NAME cpu1
set _TARGETNAME_0 $_CHIPNAME.$_CPU0NAME
set _TARGETNAME_1 $_CHIPNAME.$_CPU1NAME

jtag newtap $_CHIPNAME $_CPU0NAME -irlen 5 -expected-id $_CPUTAPID
if { $_ONLYCPU != 1 } {
	jtag newtap $_CHIPNAME $_CPU1NAME -irlen 5 -expected-id $_CPUTAPID
} else {
	jtag newtap $_CHIPNAME $_CPU1NAME -irlen 5 -disable -expected-id $_CPUTAPID
}

# PRO-CPU
if { $_RTOS == "none" } {
	target create $_TARGETNAME_0 $_CHIPNAME -endian little -chain-position $_TARGETNAME_0 -coreid 0
} else {
	target create $_TARGETNAME_0 $_CHIPNAME -endian little -chain-position $_TARGETNAME_0 -coreid 0 -rtos $_RTOS
}
configure_esp_workarea $_TARGETNAME_0 0x40090000 0x4000 0x3FFC0000 0x18000
configure_esp_flash_bank $_TARGETNAME_0 $_CHIPNAME $_FLASH_SIZE
# APP-CPU
if { $_ONLYCPU != 1 } {
	if { $_RTOS == "none" } {
		target create $_TARGETNAME_1 $_CHIPNAME -endian little -chain-position $_TARGETNAME_1 -coreid 1
	} else {
		target create $_TARGETNAME_1 $_CHIPNAME -endian little -chain-position $_TARGETNAME_1 -coreid 1 -rtos $_RTOS
	}
	configure_esp_flash_bank $_TARGETNAME_1 $_CHIPNAME $_FLASH_SIZE
	target smp $_TARGETNAME_0 $_TARGETNAME_1
}

$_TARGETNAME_0 esp32 flashbootstrap $_FLASH_VOLTAGE
$_TARGETNAME_0 xtensa maskisr on
$_TARGETNAME_0 xtensa smpbreak BreakIn BreakOut
if { $_SEMIHOST_BASEDIR != "" } {
	$_TARGETNAME_0 esp semihost_basedir $_SEMIHOST_BASEDIR
}
$_TARGETNAME_0 configure -event gdb-attach {
	$_TARGETNAME_0 xtensa smpbreak BreakIn BreakOut
	# necessary to auto-probe flash bank when GDB is connected
	halt
}

if { $_ONLYCPU != 1 } {
	$_TARGETNAME_1 configure -event gdb-attach {
		$_TARGETNAME_1 xtensa smpbreak BreakIn BreakOut
		# necessary to auto-probe flash bank when GDB is connected
		halt
	}
}

if { $_FLASH_SIZE == 0 } {
	gdb_breakpoint_override hard
}

# special function to program ESP32, it differs from the original 'program' that
# it verifies written image by reading flash directly, instead of reading memory mapped flash regions
proc program_esp32 {filename args} {
	echo "WARNING: Function (program_esp32) is deprecated, and may be removed in a future release."
	echo "         Use (program_esp) instead."
	program_esp $filename {*}$args
}

add_help_text program_esp32 "write an image to flash, address is only required for binary images. verify, reset, exit are optional"
add_usage_text program_esp32 "<filename> \[address\] \[verify\] \[reset\] \[exit\]"

```

The referenced `target/esp_common.cfg` looks like [this](https://github.com/espressif/openocd-esp32/blob/master/tcl/target/esp_common.cfg):

```
# Common ESP chips definitions

if { [info exists ESP_RTOS] } {
	set _RTOS "$ESP_RTOS"
} else {
	set _RTOS "FreeRTOS"
}

if { [info exists ESP_SEMIHOST_BASEDIR] } {
	set _SEMIHOST_BASEDIR "$ESP_SEMIHOST_BASEDIR"
} else {
	# by default current dir (when OOCD has been started)
	set _SEMIHOST_BASEDIR "."
}

if { [info exists ESP_FLASH_SIZE] } {
	set _FLASH_SIZE $ESP_FLASH_SIZE
} else {
	set _FLASH_SIZE "auto"
}

proc configure_esp_workarea { TGT CODE_ADDR CODE_SZ DATA_ADDR DATA_SZ } {
	#WARNING: be careful when selecting working ares for code and data, they should not overlap due to ESP32 physical memory mappings
	$TGT configure -work-area-phys $CODE_ADDR -work-area-virt $CODE_ADDR -work-area-size $CODE_SZ -work-area-backup 1
	# since ESP32 cannot use single address space for code and data we need additional working area to keep data
	$TGT configure -alt-work-area-phys $DATA_ADDR -alt-work-area-virt $DATA_ADDR -alt-work-area-size $DATA_SZ -alt-work-area-backup 1
}

proc configure_esp_workarea_backups { wab_list awab_list } {
	set index 0
	foreach tgt [target names] {
		$tgt configure -work-area-backup [lindex $wab_list $index]
		$tgt configure -alt-work-area-backup [lindex $awab_list $index]
		incr $index
	}
}

proc configure_esp_flash_bank { TGT DRV SIZE } {
	set _SIZE SIZE
	if { $SIZE == 0 } {
		echo "WARNING: ESP flash support is disabled!"
		return
	} else {
		if { $SIZE == "auto" } {
			# special value for flash driver
			set _SIZE 0
		}
	}
	# whole flash for programming purposes
	# TODO: remove it when support for GDB's 'load' comand is implemented
	flash bank $TGT.flash $DRV 0x0 $_SIZE 0 0 $TGT
	# So define mapped flash regions as separate flashes
	# OOCD creates memory map using registered flash banks
	flash bank $TGT.irom $DRV 0x0 0 0 0 $TGT
	flash bank $TGT.drom $DRV 0x0 0 0 0 $TGT
}

# special function to program ESP chip, it differs from the original 'program' that
# it verifies written image by reading flash directly, instead of reading memory mapped flash regions
proc program_esp {filename args} {
	set exit 0
	set compress 0
	set restore_clock 0

	set flash_list_size [llength [flash list]]
	if { $flash_list_size == 0} {
		program_error "** ESP flash programming is not supported yet! **" $exit
	}

	foreach arg $args {
		if {[string equal $arg "verify"]} {
			set verify 1
		} elseif {[string equal $arg "reset"]} {
			set reset 1
		} elseif {[string equal $arg "exit"]} {
			set exit 1
		} elseif {[string equal $arg "compress"]} {
			set compress 1
		} elseif {[string equal $arg "restore_clock"]} {
			set restore_clock 1
		} else {
			set address $arg
		}
	}

	# make sure init is called
	if {[catch {init}] != 0} {
		program_error "** OpenOCD init failed **" 1
	}

	# reset target and call any init scripts
	if {[catch {reset init}] != 0} {
		program_error "** Unable to reset target **" $exit
	}

	set wab_list {}
	set awab_list {}
	foreach tgt [target names] {
		lappend wab_list [$tgt cget -work-area-backup]
		$tgt configure -work-area-backup 0
		lappend awab_list [$tgt cget -alt-work-area-backup]
		$tgt configure -alt-work-area-backup 0
	}

	if {$compress == 1} {
		eval esp compression "on"
	} else {
		eval esp compression "off"
	}

	# start programming phase
	echo "** Programming Started **"
	if {[info exists address]} {
		set flash_args "$filename $address"
	} else {
		set flash_args "$filename"
	}

	if {[catch {eval esp flash_stub_clock_boost "on"}] != 0} {
		program_error "** Clock configuration set failed **" $exit
	}

	if {[catch {eval flash write_image erase $flash_args}] == 0} {
		echo "** Programming Finished **"
		if {[info exists verify]} {
			# verify phase
			echo "** Verify Started **"
			if {[catch {eval esp verify_bank_hash 0 $flash_args}] == 0} {
				echo "** Verified OK **"
			} else {
				configure_esp_workarea_backups $wab_list $awab_list
				if {$restore_clock == 1} {
					eval esp flash_stub_clock_boost "off"
				}
				program_error "** Verify Failed **" $exit
			}
		}

		configure_esp_workarea_backups $wab_list $awab_list

		if {$restore_clock == 1} {
			if {[catch {eval esp flash_stub_clock_boost "off"}] != 0} {
				program_error "** Clock configuration restore failed **" $exit
			}
		}

		if {[info exists reset]} {
			# reset target if requested
			echo "** Resetting Target **"
			reset run
		}
	} else {
		configure_esp_workarea_backups $wab_list $awab_list
		if {$restore_clock == 1} {
			eval esp flash_stub_clock_boost "off"
		}
		program_error "** Programming Failed **" $exit
	}

	if {$exit == 1} {
		shutdown
	}
	return
}

add_help_text program_esp "write an image to flash, address is only required for binary images. verify, reset, exit, compress, restore_clock are optional"
add_usage_text program_esp "<filename> \[address\] \[verify\] \[reset\] \[exit\] \[compress\] \[restore_clock\]"

proc program_esp_bins {build_dir filename args} {
	set exit 0
	set compress 0
	set restore_clock 0

	foreach arg $args {
		if {[string equal $arg "reset"]} {
			set reset 1
		} elseif {[string equal $arg "verify"]} {
			set verify 1
		} elseif {[string equal $arg "exit"]} {
			set exit 1
		} elseif {[string equal $arg "compress"]} {
			set compress 1
		} elseif {[string equal $arg "restore_clock"]} {
			set restore_clock 1
		} else {
			echo "** Unsupported arg $arg, skipping **"
		}
	}

	# Open and Read file
	set fp [open [file join $build_dir $filename] r]
	set file_data [read $fp]
	close $fp

	# Decode JSON to dict
	set flasher_args [json::decode $file_data]

	set flash_files [dict get $flasher_args flash_files]

	foreach addr [dict keys $flash_files] {
		set bin_file [dict get $flash_files $addr]
		set bin_file_path [file join $build_dir $bin_file]

		echo "Flashing $bin_file_path at $addr"

		if {[info exists verify]} {
			set flash_args "$bin_file_path $addr verify"
		} else {
			set flash_args "$bin_file_path $addr"
		}

		if {$compress == 1} {
			append flash_args " compress"
		}

		if {$restore_clock == 1} {
			append flash_args " restore_clock"
		}

		if {[ catch { eval program_esp  $flash_args} ] == 0} {
			echo "** Flashing done for $bin_file **"
		} else {
			echo "** Flashing Failed **"
			return -1
		}
	}

	# Reset
	if {[info exists reset]} {
		echo "** Resetting Target **"
		reset run
	}

	# Exit
	if {$exit == 1} {
		shutdown
	}

	return 0
}

add_help_text program_esp_bins "write all the images at address specified in flasher_args.json generated while building idf project"
add_usage_text program_esp_bins "<build_dir> flasher_args.json \[verify\] \[reset\] \[exit\] \[compress\] \[restore_clock\]"

proc esp_get_mac {args} {
	global EFUSE_MAC_ADDR_REG
	foreach arg $args {
		if {[string equal $arg "format"]} {
			set format 1
		}
	}

	if { [string equal [target current] esp32c3] } {
		mem2array mac 8 $EFUSE_MAC_ADDR_REG 6
	} else {
		xtensa set_permissive 1
		mem2array mac 8 $EFUSE_MAC_ADDR_REG 6
		xtensa set_permissive 0
	}

	if {[info exists format]}  {
		format %02x:%02x:%02x:%02x:%02x:%02x $mac(5) $mac(4) $mac(3) $mac(2) $mac(1) $mac(0)
	} else {
		format 0x0000%02x%02x%02x%02x%02x%02x $mac(5) $mac(4) $mac(3) $mac(2) $mac(1) $mac(0)
	}
}

add_help_text esp_get_mac "Print MAC address of the chip. Use a `format` argument to return formatted MAC value"
add_usage_text esp_get_mac "\[format\]"

```

A successful connection to the ESP32 should look something like this:

```
c:\workspace\openocd-esp32\tcl>openocd -f interface/jlink.cfg -c "adapter_khz 8000" -f target/esp32.cfg
Open On-Chip Debugger  v0.10.0-esp32-20210401 (2021-04-01-15:46)
Licensed under GNU GPL v2
For bug reports, read
        http://openocd.org/doc/doxygen/bugs.html
adapter speed: 8000 kHz

Info : Listening on port 6666 for tcl connections
Info : Listening on port 4444 for telnet connections
Info : J-Link V10 compiled Aug  9 2021 10:30:48
Info : Hardware version: 10.10
Info : VTarget = 3.290 V
Info : clock speed 8000 kHz
Info : JTAG tap: esp32.cpu0 tap/device found: 0x120034e5 (mfg: 0x272 (Tensilica), part: 0x2003, ver: 0x1)
Info : JTAG tap: esp32.cpu1 tap/device found: 0x120034e5 (mfg: 0x272 (Tensilica), part: 0x2003, ver: 0x1)
Info : esp32.cpu0: Target halted, PC=0x40145A46, debug_reason=00000001
Info : esp32.cpu1: Target halted, PC=0x4014FD96, debug_reason=00000000
Info : Listening on port 3333 for gdb connections
```

## Visual Micro Debug Attach from Visual Studio

If using the Visual Studio [Visual Micro](https://VisualMicro.com/)

Manually copy and rename the ESP-IDF build bin and elf files to the Visual Micro temp debug directory for the project name,
In this case, a project name `GDB test`:

```
C:\Users\gojimmypi\AppData\Local\Temp\VMBuilds\GDB test\esp32_esp32\Debug
```

## Visual Micro OpenmOCD and GDB Notes

Visual Micro has a very old version of ESP32 OpenOCD, and seems to be a hard coded location. Copy a fresh one to:

```
C:\ProgramData\VMicro\tools\openocd-espressif-esp32-10.0.1\bin
```

For example, a fresh install was found here for me:
```
C:\Users\gojimmypi\.espressif\tools\xtensa-esp32-elf\esp-2021r1-8.4.0\xtensa-esp32-elf\bin
```

## Segger JLink Setup Notes

When using a Segger JLink, be sure to edit the `jlink.cfg` files and enable the line with your device serial number.

```
#
# SEGGER J-Link
#
# http://www.segger.com/jlink.html
#

interface jlink

# The serial number can be used to select a specific device in case more than
# one is connected to the host.
#
# Example: Select J-Link with serial number 123456789
#
jlink serial 123456789
```

Found in directories such as this one for VisualMicro:

```
C:\ProgramData\VMicro\tools\openocd-espressif-esp32-10.0.1\share\openocd\scripts\interface
```

And this one for the ESP-IDF:
```
C:\Users\gojimmypi\.espressif\tools\openocd-esp32\v0.10.0-esp32-20210401\openocd-esp32\share\openocd\scripts\interface
```

See also:

OpenOCD
- [openocd.org GDB and OpenOCD](https://openocd.org/doc/html/GDB-and-OpenOCD.html)

GDB
- [GDB - Commands](https://www.tutorialspoint.com/gnu_debugger/gdb_commands.htm)
- [tutorialspoint GDB - Debugging Example](https://www.tutorialspoint.com/gnu_debugger/gdb_debugging_example1.htm)

Espressif
- [TEchnical Documents](https://www.espressif.com/en/support/documents/technical-documents?keys=&field_type_tid%5B%5D=492)
- [Get Started](https://docs.espressif.com/projects/esp-idf/en/latest/esp32/get-started/#get-started-get-esp-idf)
- [esp-idf hello world](https://github.com/espressif/esp-idf/blob/master/examples/get-started/hello_world/main/hello_world_main.c)
- [esp-idf/examples/protocols/ examples](https://github.com/espressif/esp-idf/tree/master/examples/protocols)
- [espressif/esp-wolfssl](https://github.com/espressif/esp-wolfssl)
- [Using the Build System](https://docs.espressif.com/projects/esp-idf/en/latest/esp32/api-guides/build-system.html#using-the-build-system)
- [JTAG Debugging Tips and Quirks](https://docs.espressif.com/projects/esp-idf/en/latest/esp32/api-guides/jtag-debugging/tips-and-quirks.html#jtag-debugging-tip-openocd-configure-target)
- [Help debugging ESP32 WROOM with jlink edu mini](https://www.esp32.com/viewtopic.php?t=13066)
- [ESP32 ESP-IDF Fatal Errors](https://docs.espressif.com/projects/esp-idf/en/latest/esp32/api-guides/fatal-errors.html)
- [Intel net test suite for LwIP network stack](https://github.com/espressif/esp-idf/tree/b63ec47238fd6aa6eaa59f7ad3942cbdff5fcc1f/examples/network/network_tests)
- [Logging library](https://docs.espressif.com/projects/esp-idf/en/latest/esp32/api-reference/system/log.html)
- [openocd-esp32/tcl/interface/ files](https://github.com/espressif/openocd-esp32/tree/master/tcl/interface)

wolfSSL
- [wolfSSL - Embedded SSL Library wolfTcp_listen](https://www.wolfssl.com/forums/post5624.html#p5624)
- [Confusion about include path](https://www.wolfssl.com/forums/topic1517-solved-confusion-about-include-path.html)

Visual Micro
- [VisualMicro How to debug an ESP32 with an Arduino project and GDB](https://www.visualmicro.com/page/ESP32-Debugging.aspx)
- [VisualMicro Debugging Using Custom Hardware](https://www.visualmicro.com/page/Debugging-Using-Custom-Hardware.aspx)

Other stuff
- [Tom Verbeure VexRiscv, OpenOCD, and Traps](https://tomverbeure.github.io/2021/07/18/VexRiscv-OpenOCD-and-Traps.html)
- [SasounTorossian/ESP32-TCP-Server](https://github.com/SasounTorossian/ESP32-TCP-Server/blob/master/main/tcp_server.c)
- [How to step-into, step-over and step-out with GDB?](https://unix.stackexchange.com/questions/297982/how-to-step-into-step-over-and-step-out-with-gdb)
- [visualgdb.com](https://visualgdb.com/)
- [Tigard Tools](https://github.com/tigard-tools/tigard)
