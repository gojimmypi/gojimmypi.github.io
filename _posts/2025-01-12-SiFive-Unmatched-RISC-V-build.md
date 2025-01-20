---
layout: post
title: "SiFive Unmatched RISC-V Build"
date: '2025-1-12'
author: gojimmypi
tags:
- SiFive
- RISC-V
- Unmatched
- wolfSSL
---

Components used:

* [HiFive Unmatched Rev B Freedom HF105-001, Mouser 115-HF105-001](https://www.mouser.com/ProductDetail/SiFive/HF105-001?qs=Imq1NPwxi75JBw6ulD0quQ%3D%3D).
* [Intel Wi-Fi 6 Multiprotocol Modules Wi-Fi 6 AX201 (Gig+), 2230, 2x2 AX+BT, vPro](https://www.mouser.com/ProductDetail/607-AX201.NGWG), [datasheet](https://www.mouser.com/datasheet/2/612/wi_fi_6_ax201_module_brief-1661650.pdf).
* [Fractal Design Ridge Black - PCIe 4.0 Riser Card Included - 2X 140mm PWM Aspect Fans Included - Type C USB - m-ITX PC Gaming Case](https://www.amazon.com/dp/B0C2CKPDG4).
* [Corsair SF850L Fully Modular Low-Noise SFX Power Supply - ATX 3.0 & PCIe 5.0 Compliant - Quiet 120mm PWM Fan - 80 Plus Gold Efficiency - Zero RPM Mode - 105°C-Rated Capacitors - Black](https://www.amazon.com/dp/B0DBWF6WMR).
* [XFX Radeon RX 580 GTS XXX Edition 1386MHz OC+, 8GB GDDR5, VR Ready, Dual BIOS, 3xDP HDMI DVI, AMD Graphics Card (RX-580P8DFD6)](https://www.amazon.com/gp/product/B06Y66K3XD/) (optional).
* [Samsung MZ-V7S500B/AM 500GB 970 EVO Plus M.2 (2280)](https://www.amazon.com/dp/B07M7Q21N7).
* [SanDisk 32GB Ultra microSDHC UHS-I Memory Card with Adapter - 98MB/s, C10, U1, Full HD, A1, Micro SD Card - SDSQUAR-032G-GN6MA](https://www.amazon.com/gp/product/B073JWXGNT/).
* [Energizer 1220 3V Batteries, 3 Volt Battery Lithium Coin](https://www.amazon.com/gp/product/B00004YK0L).


See [Running on Hardware](https://github.com/sifive/freedom-u-sdk#running-on-hardware):

> "Disk images files use `<image>-<machine>.<output_format>` format, for example,
`demo-coreip-cli-unmatched.rootfs.wic.xz`. We are interested in `.wic.xz` disk images for writing to uSD card."

Download [demo-coreip-cli-unmatched.rootfs.wic.xz](https://github.com/sifive/freedom-u-sdk/releases/download/2024.10.00/demo-coreip-cli-unmatched.rootfs.wic.xz).
This is the `2024.10.00` version from the https://github.com/sifive/freedom-u-sdk/releases.

Pay close attention to the image type (`cli` or `xfce4`) and _board name_ (`freedom-u540` or `unmatched`).

For this build, the `cli`-`unmatched` was used.

The download is a compressed file, so extract the `demo-coreip-cli-unmatched.rootfs.wic` directory that should contain an 8GB file of the same name.
Windows 11 allows a right-click-extract for `.xz` files which works the same way as `.zip` files.

Be sure to write the _uncompressed file_ called `demo-coreip-cli-unmatched.rootfs.wic` to an SD card, such as
[this SanDisk 32GB Ultra microSDHC UHS-I Memory Card with Adapter - 98MB/s, C10, U1, Full HD, A1, Micro SD Card - SDSQUAR-032G-GN6MA](https://www.amazon.com/gp/product/B073JWXGNT/).

Windows users can utilize the [win32diskimager from sourceforge](http://sourceforge.net/projects/win32diskimager/files/latest/download).

Ensure the dip switches are set for the MSEL for Unmatched.

The fan shipped with the board is impressively and undesirably loud. Consider buying a [DC 25mm Fan 12V 2510 Hydraulic Bearing Brushless Cooling 25mmx10mm](https://www.amazon.com/gp/product/B07KS36L66/).
Make extra note that it is a 12v fan.

NOTE: ssh is _enabled_ by default. See [docs](https://github.com/sifive/freedom-u-sdk?tab=readme-ov-file#connecting-using-ssh) to disable:

```
systemctl disable sshd.socket
systemctl stop sshd.socket
```

Change the default password and setup user login:

```bash
THIS_USER=gojimmypi

echo "Setting up usder: $THIS_USER with sudo permissions..."
sudo useradd -m -s /bin/bash $THIS_USER
sudo usermod -aG sudo $THIS_USER
groups $THIS_USER
sudo passwd $THIS_USER

# change password from default for root user
sudo passwd root
```

Manually edit `/etc/sudoers`:

```
nano /etc/sudoers
```

Ensure the `/etc/sudoers` file contains this text:

```
##
## User privilege specification
##
root ALL=(ALL:ALL) ALL
gojimmypi ALL=(ALL:ALL) ALL
```


Note the `$PATH` value for the `root` user. Set this as needed for new users.

```
echo $PATH
/usr/local/bin:/usr/bin:/bin:/usr/local/sbin:/usr/sbin:/sbin
```

View the release:

```text
root@unmatched:~# cat /etc/*-release
ID=freedom-u-sdk
NAME="FreedomUSDK (SiFive Freedom Unleashed SDK)"
VERSION="2024.10.00 (2024November)"
VERSION_ID=2024.10.00
VERSION_CODENAME="2024November"
PRETTY_NAME="FreedomUSDK (SiFive Freedom Unleashed SDK) 2024.10.00 (2024November)"
CPE_NAME="cpe:/o:openembedded:freedom-u-sdk:2024.10.00"
```

There's a fairly minimal Linux. There's no `apt-get`, no `dpkg`, no `opkg`. The wired Ethernet is called `end0` and NOT `eth0`.

Setup network:

```bash
sudo ip addr add 192.168.1.105/24 dev end0
sudo ip route add default via 192.168.1.1
echo "nameserver 8.8.8.8" | sudo tee /etc/resolv.conf
ping -c 4 8.8.8.8
```

There are however, all the essentials to bake your own cake: `gcc`, `make`, `git`:

```text
root@unmatched:~# which gcc
/usr/bin/gcc

root@unmatched:~# gcc --version
gcc (GCC) 14.2.0
Copyright (C) 2024 Free Software Foundation, Inc.
This is free software; see the source for copying conditions.  There is NO
warranty; not even for MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.

root@unmatched:~# which make
/usr/bin/make

root@unmatched:~# make --version
GNU Make 4.4.1
Built for riscv64-freedomusdk-linux-gnu
Copyright (C) 1988-2023 Free Software Foundation, Inc.
License GPLv3+: GNU GPL version 3 or later <https://gnu.org/licenses/gpl.html>
This is free software: you are free to change and redistribute it.
There is NO WARRANTY, to the extent permitted by law.

root@unmatched:~#  which git
/usr/bin/git

root@unmatched:~# git --version
git version 2.47.0
```



I wrote a 5-part blog on using wolfSSL with RISC-V systems:

* [Part 1: Ready for Integration: wolfSSL and RISC-V](https://www.wolfssl.com/part-1-ready-for-integration-wolfssl-and-risc-v/)
* [Part 2: Installing and Configuring wolfSSL on RISC-V](https://www.wolfssl.com/part-2-installing-and-configuring-wolfssl-on-risc-v/)
* [Part 3: Sample Application: Integrating wolfSSL with a RISC-V](https://www.wolfssl.com/part-3-sample-application-integrating-wolfssl-with-a-risc-v/)
* [Part 4: Customization and Advanced wolfSSL Features on RISC-V](https://www.wolfssl.com/part-4-customization-and-advanced-wolfssl-features-on-risc-v/)
* [Part 5: 5 Real-World Use Cases and Troubleshooting](https://www.wolfssl.com/part-5-5-real-world-use-cases-and-troubleshooting/)


demo-coreip-cli-unmatched.rootfs.wic.xz

Other links:

- https://www.sifive.com/boards/hifive-unmatched
- https://forums.sifive.com/t/installing-ubuntu-21-04-on-the-hifive-unmatched/4710/12
*