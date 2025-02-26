---
layout: post
title: "SiFive HiFive Unmatched Ubuntu NVMe SSD Boot"
date: '2025-02-17'
author: gojimmypi
tags:
- SiFive
- RISC-V
- Unmatched
- NVMe
- SSD
- Ubuntu
---

Some notes on setting up the SiFive Unmatched RISC-V to boot from an NVMe SSD.

# Download Ubuntu Image

Download [cdimage.ubuntu.com/releases/24.10/release/ubuntu-24.10-preinstalled-server-riscv64+unmatched.img.xz](https://cdimage.ubuntu.com/releases/24.10/release/ubuntu-24.10-preinstalled-server-riscv64+unmatched.img.xz)
from [cdimage.ubuntu.com/releases/](https://cdimage.ubuntu.com/releases/).  Serch for `preinstalled-server-riscv64+unmatched.img.xz` in other latest releases.

The `.xz` is a compressed file, and Windows 11 will recognize it as such. Extract the one file:

Use the [Raspberry Pi Imager](https://www.raspberrypi.com/software/).

# Config Steps

The basic Ubuntu boot, using revised `uInitrd`.

```
ext4load mmc 0:1 0x80200000 /boot/vmlinuz-6.11.0-8-generic
ext4load mmc 0:1 0x84000000 /boot/uInitrd
ext4load mmc 0:1 0x88000000 /boot/dtb-6.11.0-8-generic
booti 0x80200000 0x84000000 0x88000000
```

## Boot HiFive from SD

Original boot from SD card.

```
load mmc 0:3 ${kernel_addr_r} Image.gz;
load mmc 0:3 ${fdt_addr_r} hifive-unmatched-a00.dtb;
setenv bootargs "root=/dev/mmcblk0p4 rootfstype=ext4 rootwait console=ttySIF0,115200 earlycon"
booti ${kernel_addr_r} - ${fdt_addr_r}

cat /etc/os-release
```


## Ubuntu from SD Card
```
ext4load mmc 0:1 0x80200000 /boot/vmlinuz-6.11.0-8-generic
ext4load mmc 0:1 0x88000000 /boot/initrd.img-6.11.0-8-generic

ext4load mmc 0:1 0x8C000000 /boot/dtb-6.11.0-8-generic
printenv




setenv bootcmd "nvme scan; nvme dev 0; ${kernel}; ${initrd}; ${dtb}; booti 0x80200000 0x88000000 0x8C000000"

saveenv

setenv bootcmd 'mmc dev 0; ext4load mmc 0:1 0x80200000 /boot/vmlinuz-6.11.0-8-generic; ext4load mmc 0:1 0x88000000 /boot/initrd.img-6.11.0-8-generic; ext4load mmc 0:1 0x8C000000 /boot/dtb-6.11.0-8-generic; setenv bootargs root=/dev/mmcblk0p1 rootfstype=ext4 rw console=ttyS0,115200 earlycon debug loglevel=7; booti 0x80200000 0x88000000 0x8C000000'
setenv bootargs root=/dev/mmcblk0p1 rootfstype=ext4 rw console=ttyS0,115200 earlycon debug loglevel=7
saveenv

booti 0x80200000 - 0x8C000000

booti 0x80200000 0x88000000 0x8C000000

```

## Boot from NVMe

```
setenv fdtfile "/boot/dtb-6.11.0-8-generic"
setenv

nvme scan;
nvme dev 0;
setenv ramdisk_addr_r 0x90000000
setenv fdt_addr_r 0x8c000000

setenv preboot "nvme scan; nvme dev 0; setenv fdt_addr ${fdtcontroladdr};fdt addr ${fdtcontroladdr};"

echo $kernel_addr_r
echo $ramdisk_addr_r
echo $fdt_addr_r


ext4load nvme 0:1 ${kernel_addr_r} /boot/vmlinuz-6.11.0-8-generic

# we manually created uInitrd
ext4load nvme 0:1 ${ramdisk_addr_r} /boot/uInitrd
ext4load nvme 0:1 ${fdt_addr_r} /boot/dtbs/6.11.0-8-generic/sifive/hifive-unmatched-a00.dtb


setenv bootcmd "nvme scan; nvme dev 0; ${kernel}; ${initrd}; ${dtb}; booti 0x80200000 0x88000000 0x8C000000"

setenv bootargs "root=/dev/nvme0n1p1 rootfstype=ext4 rw console=ttyS0,115200 earlycon debug loglevel=7 nvme_core.default_ps_max_latency_us=0"
setenv bootargs "root=/dev/nvme0n1p1 rootfstype=ext4 rw console=ttyS0,115200 earlycon debug loglevel=7 nvme_core.default_ps_max_latency_us=0 init=/sbin/init"

# consider mmc /boot/extlinux/extlinux.conf
setenv bootargs "root=/dev/nvme0n1p1 rootfstype=ext4 rw console=ttyS0,115200 earlycon debug loglevel=7 nvme_core.default_ps_max_latency_us=0 init=/bin/bash"

setenv bootargs "root=/dev/nvme0n1p1 rootfstype=ext4 rw console=ttyS0,115200 earlycon init=/sbin/init"

# Boot with initramfs
booti ${kernel_addr_r} ${ramdisk_addr_r} ${fdt_addr_r}

# Boot without initramfs
booti ${kernel_addr_r} - ${fdt_addr_r}

saveenv

booti 0x80200000 - 0x8C000000

booti 0x80200000 0x88000000 0x8C000000

```




## Image Fresh Disk and Mount NVMe

Ubuntu 24.10 pre-installed server riscv64 unmatched.

~ 1GB file to fetch from Internet, ~ 5 GB to expanded and write.

```
# Original from blogjawn.stufftoread.com
# wget http://cdimage.ubuntu.com/ubuntu/releases/21.04/release/ubuntu-21.04-preinstalled-server-riscv64+unmatched.img.xz
# unxz ./ubuntu-21.04-preinstalled-server-riscv64+unmatched.img.xz

# or
# http ubuntu-24.10:
# wget http://cdimage.ubuntu.com/ubuntu/releases/24.10/release/ubuntu-24.10-preinstalled-server-riscv64+unmatched.img.xz

# or
# https ubuntu-24.10:
wget https://cdimage.ubuntu.com/releases/24.10/release/ubuntu-24.10-preinstalled-server-riscv64+unmatched.img.xz


unxz ./ubuntu-24.10-preinstalled-server-riscv64+unmatched.img.xz

# Write to NVMe SSD:
sudo dd if=./ubuntu-24.10-preinstalled-server-riscv64+unmatched.img of=/dev/nvme0n1 bs=1M status=progress

# Probably needed if not enough free disk space:
xz -dc ./ubuntu-24.10-preinstalled-server-riscv64+unmatched.img.xz | sudo dd  of=/dev/nvme0n1 bs=1M status=progress

# growpart is typically not installed
# sudo growpart /dev/nvme0n1 1

sync

sudo umount /mnt
sudo umount /run/media/CIDATA-nvme0n1p12
sudo umount /run/media/UEFI-nvme0n1p15

# Ensure all drives unmounted
lsblk

# resize disk. Enter "w" at the prompt
sudo fdisk /dev/nvme0n1

# reboot to mmc again. See Boot HiFive from SD:
reboot


sudo fdisk /dev/nvme0n1
# p to print partitions  (make note of nvme0n1p1 starting sector, in this case 235520)
# d to delete partition 1
# 1 for partition #1
# n to create a new partition
# 1 for partition #1
# confirm 23550 (should be the default)
# Enter for defaults
# N do not remove signature
# w to write
# (should automatically exit)

sync
# Reboot to mms again. See Boot HiFive from SD:
reboot

lsblk

# Confirm typie is ext4
sudo blkid /dev/nvme0n1p1

# Resize the drive
sudo resize2fs /dev/nvme0n1p1

# done

sudo mount /dev/nvme0n1p1 /mnt
sudo chroot /mnt
cat /etc/os-release
```

# Create uInitrd

```
echo "nvme" | sudo tee -a /etc/initramfs-tools/modules
echo "nvme-core" | sudo tee -a /etc/initramfs-tools/modules

# sudo update-initramfs -u -k 6.11.0-8-generic

# sudo mkimage -A riscv -T ramdisk -C gzip -d /boot/initrd.img-6.11.0-8-generic /boot/uInitrd
sudo mkimage -A riscv -O linux -T ramdisk -C none -n "Ubuntu Initrd" -d /run/media/cloudimg-rootfs-nvme0n1p1/boot/initrd.img-6.11.0-8-generic /run/media/cloudimg-rootfs-nvme0n1p1/boot/uInitrd

# no longer copy
# Copy to mmc SD
# sudo cp /mnt/boot/uInitrd /boot/
# sudo cp /mnt/boot/vmlinuz-6.11.0-8-generic /boot/
# sync

# mount | grep "on / type"

```

## UBoot NVMe with uInitrd ramdisk


```
setenv devnum 0
setenv bootargs "root=/dev/nvme0n1p1 rootfstype=ext4 rootwait console=ttySIF0,115200 earlycon"

load nvme ${devnum}:1 ${kernel_addr_r} /boot/vmlinuz-6.11.0-8-generic
load nvme ${devnum}:1 ${ramdisk_addr_r} /boot/uInitrd
load nvme ${devnum}:1 ${fdt_addr_r} /boot/dtbs/6.11.0-8-generic/hifive-unmatched-a00.dtb
booti ${kernel_addr_r} ${ramdisk_addr_r} ${fdt_addr_r}
```


# Some NVMe possible fixes
```
sudo mkdir -p /mnt/nvme
sudo mount /dev/nvme0n1p1 /mnt/nvme
for i in /dev /dev/pts /proc /sys /run; do sudo mount --bind $i /mnt/nvme$i; done
sudo chroot /mnt/nvme

# Add U_BOOT_ROOT="root=/dev/nvme0n1p1" to /etc/default/u-boot

dpkg -l | grep u-boot

cat /etc/default/u-boot
echo 'U_BOOT_ROOT="root=/dev/nvme0n1p1"' | sudo tee -a /etc/default/u-boot
u-boot-update
```


## TODO review

```
setenv bootcmd 'mmc dev 0; ext4load mmc 0:1 0x80200000 /boot/vmlinuz-6.11.0-8-generic; ext4load mmc 0:1 0x88000000 /boot/initrd.img-6.11.0-8-generic; ext4load mmc 0:1 0x8C000000 /boot/dtb-6.11.0-8-generic; '
```

## NVMe Boot WIP TODO review

Reminder: no trailing `;` in bootargs:

```
setenv bootargs 'root=/dev/nvme0n1p1 rootfstype=ext4 rw console=ttyS0,115200 earlycon debug loglevel=7'

x setenv bootcmd 'nvme dev 0; ext4load nvme 0:1 0x80200000 /boot/vmlinuz-6.11.0-8-generic; ext4load nvme 0:1 0x88000000 /boot/initrd.img-6.11.0-8-generic; ext4load nvme 0:1 0x8C000000 /boot/dtb-6.11.0-8-generic; booti 0x80200000 0x88000000 0x8C000000'


setenv bootcmd "nvme dev 0; ext4load nvme 0:1 0x80200000 /boot/vmlinuz-6.11.0-8-generic; ext4load nvme 0:1 0x88000000 /boot/initrd.img-6.11.0-8-generic;
ext4load nvme 0:1 0x8C000000 /boot/dtbs/6.11.0-8-generic/sifive/hifive-unmatched-a00.dtb; booti 0x80200000 0x88000000 0x8C000000"

saveenv
```

## SD Boot

```
setenv root "/dev/mmcblk0p4"
setenv rootdev "/dev/mmcblk0p4"

setenv boot_targets mmc
setenv bootargs "root=/dev/mmcblk0p4 rootfstype=ext4 rootwait console=ttySIF0,115200 earlycon"


setenv bootcmd "load mmc 0:3 ${kernel_addr_r} Image.gz; load mmc 0:3 ${fdt_addr_r} hifive-unmatched-a00.dtb; booti ${kernel_addr_r} - ${fdt_addr_r}"

load mmc 0:3 ${kernel_addr_r} Image.gz;
load mmc 0:3 ${fdt_addr_r} hifive-unmatched-a00.dtb;

booti ${kernel_addr_r} - ${fdt_addr_r}
```

NVMe printenv:

```
arch=riscv
baudrate=115200
board=unmatched
board_name=unmatched
bootargs=root=/dev/nvme0n1p1 rootfstype=ext4 rw console=ttyS0,115200 earlycon debug loglevel=8 nvme_core.default_ps_max_latency_us=0
bootcmd=bootflow scan
bootdelay=2
cpu=fu740
ethaddr=[omit]
fdt_addr=ff730cf0
fdt_addr_r=0x8c000000
fdtaddr=ff730cf0
fdtcontroladdr=ff730cf0
fdtfile="sifive/hifive-unmatched-a00.dtb"
fileaddr=8c000000
filesize=2b9b
kernel_addr_r=0x80200000
kernel_comp_addr_r=0x88000000
kernel_comp_size=0x4000000
loadaddr=0x80200000
partitions=name=loader1,start=17K,size=1M,type=${type_guid_gpt_loader1}; name=loader2,size=4MB,type=${type_guid_gpt_loader2}; name=system,size=-,bootable,type=${type_guid_gpt_system};
preboot=setenv fdt_addr ${fdtcontroladdr};fdt addr ${fdtcontroladdr};
pxefile_addr_r=0x8c200000
ramdisk_addr_r=0x90000000
scriptaddr=0x8c100000
serial#=[omit]
stderr=serial@10010000
stdin=serial@10010000
stdout=serial@10010000
type_guid_gpt_loader1=5B193300-FC78-40CD-8002-E86C45580B47
type_guid_gpt_loader2=2E54B353-1271-4842-806F-E436D6AF6985
type_guid_gpt_system=0FC63DAF-8483-4772-8E79-3D69D8477DE4
vendor=sifive

Environment size: 1136/131068 bytes
```

Convert Initrd to uboot format

```
FreedomUSDK (SiFive Freedom Unleashed SDK) 2024.12.00 unmatched ttySIF0

unmatched login: root
Password:
root@unmatched:~# lsblk -o NAME,MOUNTPOINT,FSTYPE,SIZE
NAME         MOUNTPOINT                           FSTYPE   SIZE
mmcblk0                                                   29.7G
|-mmcblk0p1                                                  1M
|-mmcblk0p2                                                  4M
|-mmcblk0p3  /boot                                vfat     130M
`-mmcblk0p4  /                                    ext4     7.6G
nvme0n1                                                  465.8G
|-nvme0n1p1  /run/media/cloudimg-rootfs-nvme0n1p1 ext4     4.4G
|-nvme0n1p12 /run/media/CIDATA-nvme0n1p12         vfat       4M
|-nvme0n1p13                                                 1M
|-nvme0n1p14                                                 4M
`-nvme0n1p15 /run/media/UEFI-nvme0n1p15           vfat     106M
root@unmatched:~# mount /dev/nvme0n1p1 /mnt
root@unmatched:~# ls /mnt
bin   dev  home    lib         media  opt   root  sbin  srv  tmp  var
boot  etc  initrd  lost+found  mnt    proc  run   snap  sys  usr
root@unmatched:~# mkimage -A riscv -O linux -T ramdisk -C none -a 0x90000000 -e 0x90000000 -n "Ubuntu Initrd" -d /mnt/boot/initrd.img-6.11.0-8-generic /mnt/boot/uInitrd
Image Name:   Ubuntu Initrd
Created:      Tue Feb 18 00:56:17 2025
Image Type:   RISC-V Linux RAMDisk Image (uncompressed)
Data Size:    62569708 Bytes = 61103.23 KiB = 59.67 MiB
Load Address: 90000000
Entry Point:  90000000
root@unmatched:~# ls -lh /mnt/boot/uInitrd
-rw-r--r-- 1 root root 60M Feb 18 00:56 /mnt/boot/uInitrd

```


## Links:

Some links for reference.

### SiFive
- [sifive.com/boards/hifive-unmatched-revb](https://www.sifive.com/boards/hifive-unmatched-revb)
- [sifive/freedom-u-sdk](https://github.com/sifive/freedom-u-sdk)
- [HiFive Unmatched Software Reference Manual Version 1.0 pdf - CN starfivetech](https://www.starfivetech.com/uploads/hifive-unmatched-sw-reference-manual-v1p0.pdf)
- [2023 Unmatched Rev B boot from NVME - HiFive Unmatched - SiFive Forums](https://forums.sifive.com/t/2023-unmatched-rev-b-boot-from-nvme/6373/3)
- [Building the SiFive Unmatched RISC-V board boot requirements - carlosedp riscv-bringup](https://github.com/carlosedp/riscv-bringup/blob/master/unmatched%2FReadme.md)
- [github.com/sifive/freedom-u-sdk/releases](https://github.com/sifive/freedom-u-sdk/releases)
- [Stuck loading device tree - forums.sifive.com](https://forums.sifive.com/t/stuck-loading-device-tree/5022)

### U-Boot
- [github/u-boot HiFive Unmatched FU740-C000 RISC-V SoC](https://github.com/u-boot/u-boot/blob/master/doc/board/sifive/unmatched.rst)
- [blogjawn.stufftoread.com/install-ubuntu-on-hifive-unmatched.html on wayback](https://web.archive.org/web/20220117214034/https://blogjawn.stufftoread.com/install-ubuntu-on-hifive-unmatched.html).
- [U-Boot for HiFive Unmatched - docs.u-boot.org](https://docs.u-boot.org/en/latest/board/sifive/unmatched.html)

### Ubuntu

- [Installing Ubuntu 21.04 on the HiFive Unmatched - HiFive Unmatched - SiFive Forums](https://forums.sifive.com/t/installing-ubuntu-21-04-on-the-hifive-unmatched/4710?page=4)
- [Ubuntu 24.10 (Oracular Oriole) Releases](http://cdimage.ubuntu.com/ubuntu/releases/24.10/release/)

### Debian
[Installing Debian On SiFive HiFive Unmatched](https://wiki.debian.org/InstallingDebianOn/SiFive/%20HiFiveUnmatched#Boot_from_onboard_SPI_Flash_.2B-_NVMe_drive)


### NMVe
- [NVME not functioning - forums.sifive.com](https://forums.sifive.com/t/nvme-not-functioning/4762)
- [nvme-cli - Linux.org](https://www.linux.org/threads/nvme-cli.47099/)

### Misc
- [linux - How to change filesystem UUID (2 same UUID)? - Unix & Linux Stack Exchange](https://unix.stackexchange.com/questions/12858/how-to-change-filesystem-uuid-2-same-uuid)

