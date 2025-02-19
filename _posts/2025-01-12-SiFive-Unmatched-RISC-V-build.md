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

This is a blog about my SiFive HiFive Unmatched build.

Components used:

* [HiFive Unmatched Rev B Freedom HF105-001, Mouser 115-HF105-001](https://www.mouser.com/ProductDetail/SiFive/HF105-001?qs=Imq1NPwxi75JBw6ulD0quQ%3D%3D).
* [Intel Wi-Fi 6 Multiprotocol Modules Wi-Fi 6 AX201 (Gig+), 2230, 2x2 AX+BT, vPro](https://www.mouser.com/ProductDetail/607-AX201.NGWG), [datasheet](https://www.mouser.com/datasheet/2/612/wi_fi_6_ax201_module_brief-1661650.pdf).
* [Fractal Design Ridge Black - PCIe 4.0 Riser Card Included - 2X 140mm PWM Aspect Fans Included - Type C USB - m-ITX PC Gaming Case](https://www.amazon.com/dp/B0C2CKPDG4).
* [Corsair SF850L Fully Modular Low-Noise SFX Power Supply - ATX 3.0 & PCIe 5.0 Compliant - Quiet 120mm PWM Fan - 80 Plus Gold Efficiency - Zero RPM Mode - 105 C-Rated Capacitors - Black](https://www.amazon.com/dp/B0DBWF6WMR).
* [XFX Radeon RX 580 GTS XXX Edition 1386MHz OC+, 8GB GDDR5, VR Ready, Dual BIOS, 3xDP HDMI DVI, AMD Graphics Card (RX-580P8DFD6)](https://www.amazon.com/gp/product/B06Y66K3XD/) (optional).
* [Samsung MZ-V7S500B/AM 500GB 970 EVO Plus M.2 (2280)](https://www.amazon.com/dp/B07M7Q21N7).
* [SanDisk 32GB Ultra microSDHC UHS-I Memory Card with Adapter - 98MB/s, C10, U1, Full HD, A1, Micro SD Card - SDSQUAR-032G-GN6MA](https://www.amazon.com/gp/product/B073JWXGNT/).
* [Energizer 1220 3V Batteries, 3 Volt Battery Lithium Coin](https://www.amazon.com/gp/product/B00004YK0L).


See [Running on Hardware](https://github.com/sifive/freedom-u-sdk#running-on-hardware):

> "Disk images files use `<image>-<machine>.<output_format>` format, for example,
`demo-coreip-cli-unmatched.rootfs.wic.xz`. We are interested in `.wic.xz` disk images for writing to uSD card."

Download [demo-coreip-cli-unmatched.rootfs.wic.xz](https://github.com/sifive/freedom-u-sdk/releases/download/2024.12.00/demo-coreip-cli-unmatched.rootfs.wic.xz).
This is the `2024.12.00` version from the https://github.com/sifive/freedom-u-sdk/releases.

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

Change the default root password from `sifive` and setup user login:

```bash
THIS_USER=gojimmypi

echo "Setting up user: $THIS_USER with sudo permissions..."
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


```
    1  mkdir workspace
    2  cd workspace
    3  ls -al
    4  df
    5  pwd
    6  lsblk
    7  sudo shutdown
    8  login root
    9  logout
   10  THIS_USER=gojimmypi
   11  echo $THIS_USER
   12  ping -c 4 8.8.8.8
   13  cat /etc/resolv.conf
   14  sudo ip addr add 192.168.1.105/24 dev end0
   15  sudo
   16  sudo ip addr add 192.168.1.105/24 dev end0
   17  logout
   18  sudo ip addr add 192.168.1.105/24 dev end0
   19  visudo
   20  cat /etc/sudoer
   21  nano
   22  nano /etc/sudoers
   23  logout
   24  sudo ip addr add 192.168.1.105/24 dev end0
   25  sudo ip route add default via 192.168.1.1
   26  ip
   27  which ip
   28  busybox ip
   29  sudo reboot
   30  shutdown
   31  logout
   32  ls -al
   33  ping google.com
   34  shutdown
   35  sudo reboot
   36  history

```


```
sudo cat /boot/extlinux/extlinux.conf
```

```
default OpenEmbedded-SiFive-HiFive-Unmatched
label OpenEmbedded-SiFive-HiFive-Unmatched
   kernel /Image.gz
   fdt /hifive-unmatched-a00.dtb
   append root=/dev/mmcblk0p4 rootfstype=ext4 rootwait console=ttySIF0,115200 earlycon

```

Use Win32DiskImager to write image to SSD.

boot and press a key to enter uboot.

Interrupt the U-Boot countdown by pressing any key when you see:

```
Hit any key to stop autoboot: 0
```

```
pci
```

Output something like this:

```
BusDevFun  VendorId   DeviceId   Device Class       Sub-Class
_____________________________________________________________
00.00.00   0xf15e     0x0000     Bridge device           0x04
01.00.00   0x1b21     0x2824     Bridge device           0x04
02.00.00   0x1b21     0x2824     Bridge device           0x04
02.02.00   0x1b21     0x2824     Bridge device           0x04
02.03.00   0x1b21     0x2824     Bridge device           0x04
02.04.00   0x1b21     0x2824     Bridge device           0x04
02.08.00   0x1b21     0x2824     Bridge device           0x04
04.00.00   0x1b21     0x1142     Serial bus controller   0x03
06.00.00   0x144d     0xa808     Mass storage controller 0x08
=> nvme scan
=> nvme info
Device 0: Vendor: 0x144d Rev: 2xxxxxx7 Prod: S5xxxxxxxxxxxxR
            Type: Hard Disk
            Capacity: 476940.0 MB = 465.7 GB (976773168 x 512)
```

Force U-Boot to rescan PCI devices and initialize NVMe:

```
nvme scan

ls nvme 0:3

ls nvme 0
```

```
nvme scan

nvme info
```

Output of `nvme info`:

```
Device 0: Vendor: 0x144d Rev: 2xxxxxx7 Prod: S5xxxxxxxxxxxxR
            Type: Hard Disk
            Capacity: 476940.0 MB = 465.7 GB (976773168 x 512)
```


```
part list nvme 0
```

Output something like this:

```
Partition Map for nvme device 0  --   Partition Type: EFI

Part    Start LBA       End LBA         Name
        Attributes
        Type GUID
        Partition GUID
  1     0x00000022      0x00000821      "primary"
        attrs:  0x0000000000000000
        type:   5b193300-fc78-40cd-8002-e86c45580b47
                (5b193300-fc78-40cd-8002-e86c45580b47)
        guid:   4ccb1962-0f94-4337-a843-fe083f83a51d
  2     0x00000822      0x00002821      "primary"
        attrs:  0x0000000000000000
        type:   2e54b353-1271-4842-806f-e436d6af6985
                (2e54b353-1271-4842-806f-e436d6af6985)
        guid:   434da497-7451-45de-b29d-a863cdbcb012
  3     0x00004000      0x00044fff      "boot"
        attrs:  0x0000000000000004
        type:   ebd0a0a2-b9e5-4433-87c0-68b6b72699c7
                (data)
        guid:   274a18ad-c485-43c3-a30a-ab2af0891226
  4     0x00046000      0x00f69f8f      "root"
        attrs:  0x0000000000000000
        type:   0fc63daf-8483-4772-8e79-3d69d8477de4
                (linux)
        guid:   6f61ef04-3325-434c-978c-6a62665426e3

```

Next

```
gpt verify nvme 0
No partition list provided - only basic check
Verify GPT: success!
```

```
fatload nvme 0:3 ${loadaddr} /extlinux/extlinux.conf
md.b ${loadaddr} 100
```

```
80200000: 64 65 66 61 75 6c 74 20 4f 70 65 6e 45 6d 62 65  default OpenEmbe
80200010: 64 64 65 64 2d 53 69 46 69 76 65 2d 48 69 46 69  dded-SiFive-HiFi
80200020: 76 65 2d 55 6e 6d 61 74 63 68 65 64 0a 6c 61 62  ve-Unmatched.lab
80200030: 65 6c 20 4f 70 65 6e 45 6d 62 65 64 64 65 64 2d  el OpenEmbedded-
80200040: 53 69 46 69 76 65 2d 48 69 46 69 76 65 2d 55 6e  SiFive-HiFive-Un
80200050: 6d 61 74 63 68 65 64 0a 20 20 20 6b 65 72 6e 65  matched.   kerne
80200060: 6c 20 2f 49 6d 61 67 65 2e 67 7a 0a 20 20 20 66  l /Image.gz.   f
80200070: 64 74 20 2f 68 69 66 69 76 65 2d 75 6e 6d 61 74  dt /hifive-unmat
80200080: 63 68 65 64 2d 61 30 30 2e 64 74 62 0a 20 20 20  ched-a00.dtb.
80200090: 61 70 70 65 6e 64 20 72 6f 6f 74 3d 2f 64 65 76  append root=/dev
802000a0: 2f 6d 6d 63 62 6c 6b 30 70 34 20 72 6f 6f 74 66  /mmcblk0p4 rootf
802000b0: 73 74 79 70 65 3d 65 78 74 34 20 72 6f 6f 74 77  stype=ext4 rootw
802000c0: 61 69 74 20 63 6f 6e 73 6f 6c 65 3d 74 74 79 53  ait console=ttyS
802000d0: 49 46 30 2c 31 31 35 32 30 30 20 65 61 72 6c 79  IF0,115200 early
```

u-boot to boot from SD
boot_targets=mmc0

```
setenv kernel_addr_r 0x84000000
setenv fdt_addr_r 0x86000000
setenv root /dev/mmcblk0p4

setenv bootargs 'root=/dev/mmcblk0p4 rootfstype=ext4 rootwait console=ttySIF0,115200 earlycon'

setenv bootcmd 'load mmc 0:3 ${kernel_addr_r} Image.gz; load mmc 0:3 ${fdt_addr_r} hifive-unmatched-a00.dtb; booti ${kernel_addr_r} - ${fdt_addr_r}'

saveenv
reset

```
       bootargs 'root=/dev/mmcblk0p3 rootfstype=ext4 rootwait console=ttySIF0,115200 earlycon
       bootcmd   load mmc 0:3 ${kernel_addr_r} Image.gz; load mmc 0:3 ${fdt_addr_r} hifive-unmatched-a00.dtb; booti ${kernel_addr_r} - ${fdt_addr_r}
partitions=name=loader1,start=17K,size=1M,type=${type_guid_gpt_loader1}; name=loader2,size=4MB,type=${type_guid_gpt_loader2}; name=system,size=-,bootable,type=${type_guid_gpt_system};

Manual boot:

```
fatload mmc 0:3 ${kernel_addr_r} Image.gz
fatload mmc 0:3 ${fdt_addr_r} hifive-unmatched-a00.dtb
booti ${kernel_addr_r} - ${fdt_addr_r}
```

NVMe (experimental)

```
setenv bootargs "root=/dev/nvme0n1p4 rootfstype=ext4 rootwait console=ttySIF0,115200 earlycon"
setenv boot_targets nvme0
saveenv
reset
```

Saving Environment to SPIFlash... Erasing SPI flash...Writing to SPI flash...done
OK

```
setenv loadaddr 0x80200000

mw.b 0x80200000 61 1  # 'a'
mw.b 0x80200001 70 1  # 'p'
mw.b 0x80200002 70 1  # 'p'
mw.b 0x80200003 65 1  # 'e'
mw.b 0x80200004 6e 1  # 'n'

mw.b 0x80200005 64 1  # 'd'
mw.b 0x80200006 20 1  # ' '
mw.b 0x80200007 72 1  # 'r'
mw.b 0x80200008 6f 1  # 'o'
mw.b 0x80200009 6f 1  # 'o'

mw.b 0x8020000a 74 1  # 't'
mw.b 0x8020000b 3d 1  # '='
mw.b 0x8020000c 2f 1  # '/'
mw.b 0x8020000d 64 1  # 'd'
mw.b 0x8020000e 65 1  # 'e'

mw.b 0x8020000f 76 1  # 'v'
mw.b 0x80200010 2f 1  # '/'
mw.b 0x80200011 6e 1  # 'n'
mw.b 0x80200012 76 1  # 'v'
mw.b 0x80200013 6d 1  # 'm'

mw.b 0x80200014 65 1  # 'e'
mw.b 0x80200015 30 1  # '0'
mw.b 0x80200016 6e 1  # 'n'
mw.b 0x80200017 31 1  # '1'
mw.b 0x80200018 70 1  # 'p'

mw.b 0x80200019 34 1  # '4'
mw.b 0x8020001a 20 1  # ' '
mw.b 0x8020001b 72 1  # 'r'
mw.b 0x8020001c 6f 1  # 'o'
mw.b 0x8020001d 6f 1  # 'o'

mw.b 0x8020001e 74 1  # 't'
mw.b 0x8020001f 66 1  # 'f'
mw.b 0x80200020 73 1  # 's'
mw.b 0x80200021 74 1  # 't'
mw.b 0x80200022 79 1  # 'y'

mw.b 0x80200023 70 1  # 'p'
mw.b 0x80200024 65 1  # 'e'
mw.b 0x80200025 3d 1  # '='
mw.b 0x80200026 65 1  # 'e'
mw.b 0x80200027 78 1  # 'x'

mw.b 0x80200028 74 1  # 't'
mw.b 0x80200029 34 1  # '4'
mw.b 0x8020002a 20 1  # ' '
mw.b 0x8020002b 72 1  # 'r'
mw.b 0x8020002c 6f 1  # 'o'

mw.b 0x8020002d 6f 1  # 'o'
mw.b 0x8020002e 74 1  # 't'
mw.b 0x8020002f 77 1  # 'w'
mw.b 0x80200030 61 1  # 'a'
mw.b 0x80200031 69 1  # 'i'

mw.b 0x80200032 74 1  # 't'
mw.b 0x80200033 20 1  # ' '
mw.b 0x80200034 63 1  # 'c'
mw.b 0x80200035 6f 1  # 'o'
mw.b 0x80200036 6e 1  # 'n'

mw.b 0x80200037 73 1  # 's'
mw.b 0x80200038 6f 1  # 'o'
mw.b 0x80200039 6c 1  # 'l'
mw.b 0x8020003a 65 1  # 'e'
mw.b 0x8020003b 3d 1  # '='

mw.b 0x8020003c 74 1  # 't'
mw.b 0x8020003d 74 1  # 't'
mw.b 0x8020003e 79 1  # 'y'
mw.b 0x8020003f 53 1  # 'S'
mw.b 0x80200040 49 1  # 'I'

mw.b 0x80200041 46 1  # 'F'
mw.b 0x80200042 30 1  # '0'
mw.b 0x80200043 2c 1  # ','
mw.b 0x80200044 31 1  # '1'
mw.b 0x80200045 31 1  # '1'

mw.b 0x80200046 35 1  # '5'
mw.b 0x80200047 32 1  # '2'
mw.b 0x80200048 30 1  # '0'
mw.b 0x80200049 30 1  # '0'
mw.b 0x8020004a 20 1  # ' '

mw.b 0x8020004b 65 1  # 'e'
mw.b 0x8020004c 61 1  # 'a'
mw.b 0x8020004d 72 1  # 'r'
mw.b 0x8020004e 6c 1  # 'l'
mw.b 0x8020004f 79 1  # 'y'

mw.b 0x80200050 63 1  # 'c'
mw.b 0x80200051 6f 1  # 'o'
mw.b 0x80200052 6e 1  # 'n'
mw.b 0x80200053 0a 1  # newline

fatwrite nvme 0:3 ${loadaddr} /extlinux/extlinux.conf 84
```


```
unmatched:~$ cat /etc/fstab
# stock fstab - you probably want to override this with a machine specific one

/dev/root            /                    auto       defaults              1  1
proc                 /proc                proc       defaults              0  0
devpts               /dev/pts             devpts     mode=0620,ptmxmode=0666,gid=5      0  0
tmpfs                /run                 tmpfs      mode=0755,nodev,nosuid,strictatime 0  0
tmpfs                /var/volatile        tmpfs      defaults              0  0

# uncomment this if your device has a SD/MMC/Transflash slot
#/dev/mmcblk0p1       /media/card          auto       defaults,sync,noauto  0  0

/dev/mmcblk0p3  /boot   vfat    defaults        0       0
```



```
unmatched:~$ sudo cat /boot/extlinux/extlinux.conf
default OpenEmbedded-SiFive-HiFive-Unmatched
label OpenEmbedded-SiFive-HiFive-Unmatched
   kernel /Image.gz
   fdt /hifive-unmatched-a00.dtb
   append root=/dev/nvme0n1p4 rootfstype=ext4 rootwait console=ttySIF0,115200 earlycon
```


```
sudo mkdir -p /etc/yum.repos.d/

sudo tee /etc/yum.repos.d/freedom-usdk.repo <<EOF
[freedom-usdk]
name=FreedomUSDK Packages
baseurl=http://sifive.freedomusdk.org/packages/2024.10/
enabled=1
gpgcheck=0
EOF
```

```
cat /etc/yum.repos.d/freedom-usdk.repo

sudo dnf clean all
sudo dnf makecache
sudo dnf repolist

sudo dnf install parted
```

export PATH=$PATH:/usr/sbin


sudo nano /etc/fstab

/dev/nvme0n1p3        /boot                vfat       defaults  0  0


ls /boot


```
unmatched:~$ ls -al /boot
total 23876
drwxr-xr-x  4 root root    16384 Jan  1  1970  .
drwxr-xr-x 17 root root     4096 Apr  5  2011  ..
-rwxr-xr-x  1 root root  8061841 Apr  5  2011  Image.gz
-rwxr-xr-x  1 root root 16342647 Apr  5  2011  Image.gz-initramfs-unmatched.bin
drwxr-xr-x  2 root root     4096 Dec 28 19:18 'System Volume Information'
drwxr-xr-x  2 root root     4096 Apr  5  2011  extlinux
-rwxr-xr-x  1 root root    10785 Apr  5  2011  hifive-unmatched-a00.dtb

```

```
# Ensure everything is written to disk
sudo sync

sudo reboot
```

```
export PATH=$PATH:/usr/sbin
```

Manual boot SD Card (mmc)  mmcblk0p3 nvme0n1p4

```
setenv bootargs "console=ttySIF0,115200 earlycon root=/dev/mmcblk0p3 rw init=/bin/sh"
load mmc 0:3 0x80200000 /Image.gz-initramfs-unmatched.bin
load mmc 0:3 0x84000000 /hifive-unmatched-a00.dtb
booti 0x80200000 - 0x84000000
```


Manual boot NVme

```
# List available storage
mmc dev 0
nvme scan

# List boot files
ls mmc 0:3
ls nvme 0:3

# Manually boot the kernel
setenv bootargs "root=/dev/nvme0n1p3 rw console=ttySIF0,115200 earlycon"
load nvme 0:3 0x80200000 /Image.gz
load nvme 0:3 0x82000000 /hifive-unmatched-a00.dtb
booti 0x80200000 - 0x82000000

```

