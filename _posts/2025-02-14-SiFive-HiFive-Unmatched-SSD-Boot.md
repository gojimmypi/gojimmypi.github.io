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


Log all terminal window output to a file. For `putty.exe` this is under `Session` - `Logging`

First, enter `U-BOOT` and save all SPI environment settings.

```
U-Boot SPL 2024.10-dirty (Oct 07 2024 - 14:54:35 +0000)
Trying to boot from MMC1


U-Boot 2024.10-dirty (Oct 07 2024 - 14:54:35 +0000)

CPU:   sifive,bullet0
Model: SiFive HiFive Unmatched A00
DRAM:  16 GiB
Core:  36 devices, 21 uclasses, devicetree: separate
MMC:   spi@10050000:mmc@0: 0
Loading Environment from SPIFlash... SF: Detected is25wp256 with page size 256 Bytes, erase size 4 KiB, total 32 MiB
OK
EEPROM: SiFive PCB EEPROM format v1
Product ID: 0002 (HiFive Unmatched)
PCB revision: 4
BOM revision: B
BOM variant: 0
Serial number: [omit]
Ethernet MAC address: [omit]
CRC: 619596d4
PCIE-0: Link up (Gen1-x8, Bus0)
In:    serial@10010000
Out:   serial@10010000
Err:   serial@10010000
Model: SiFive HiFive Unmatched A00
Net:   eth0: ethernet@10090000
Working FDT set to ff730cf0
Hit any key to stop autoboot:  0

=>   printenv

arch=riscv
baudrate=115200
board=unmatched
board_name=unmatched
boot_targets=nvme0
bootargs=root=/dev/mmcblk0p4 rootfstype=ext4 rootwait console=ttySIF0,115200 earlycon
bootcmd=load mmc 0:3 ${kernel_addr_r} Image.gz; load mmc 0:3 ${fdt_addr_r} hifive-unmatched-a00.dtb; booti ${kernel_addr_r} - ${fdt_addr_r}
bootdelay=2
cpu=fu740
ethaddr=[omit]
fdt_addr=ff730cf0
fdt_addr_r=0x86000000
fdtaddr=ff730cf0
fdtcontroladdr=ff730cf0
fdtfile="sifive/hifive-unmatched-a00.dtb"
fileaddr=84000000
filesize=7b0391
kernel_addr_r=0x84000000
kernel_comp_addr_r=0x88000000
kernel_comp_size=0x4000000
loadaddr=0x80200000
partitions=name=loader1,start=17K,size=1M,type=${type_guid_gpt_loader1}; name=loader2,size=4MB,type=${type_guid_gpt_loader2}; name=system,size=-,bootable,type=${type_guid_gpt_system};
preboot=setenv fdt_addr ${fdtcontroladdr};fdt addr ${fdtcontroladdr};
pxefile_addr_r=0x8c200000
ramdisk_addr_r=0x8c300000
root=/dev/mmcblk0p4
scriptaddr=0x8c100000
serial#=[omit]
stderr=serial@10010000
stdin=serial@10010000
stdout=serial@10010000
type_guid_gpt_loader1=5B193300-FC78-40CD-8002-E86C45580B47
type_guid_gpt_loader2=2E54B353-1271-4842-806F-E436D6AF6985
type_guid_gpt_system=0FC63DAF-8483-4772-8E79-3D69D8477DE4
vendor=sifive
```

See `/boot/extlinux/extlinux.conf`:

```
default OpenEmbedded-SiFive-HiFive-Unmatched
label OpenEmbedded-SiFive-HiFive-Unmatched
   kernel /Image.gz
   fdt /hifive-unmatched-a00.dtb
   append root=/dev/mmcblk0p4 rootfstype=ext4 rootwait console=ttySIF0,115200 earlycon
```

Edit `mmcblk0p4` and change to `nvme0n1p4`:

```
default OpenEmbedded-SiFive-HiFive-Unmatched
label OpenEmbedded-SiFive-HiFive-Unmatched
   kernel /Image.gz
   fdt /hifive-unmatched-a00.dtb
   append root=/dev/nvme0n1p4 rootfstype=ext4 rootwait console=ttySIF0,115200 earlycon
```



This should work, but does not:

```
setenv bootcmd "nvme scan; nvme dev 0; load nvme 0:3 ${kernel_addr_r} Image.gz; load nvme 0:3 ${fdt_addr_r} hifive-unmatched-a00.dtb; booti ${kernel_addr_r} - ${fdt_addr_r}"
setenv bootargs "root=/dev/nvme0n1p4 rootfstype=ext4 rootwait console=ttySIF0,115200 earlycon"
```



Success:

```
setenv root "/dev/nvme0n1p4"
setenv rootdev "/dev/nvme0n1p4"
setenv fdt_addr_r 0x89000000
printenv

setenv bootcmd "pci enum; pci list; nvme scan; nvme dev 0; load nvme 0:3 ${kernel_addr_r} Image.gz; load nvme 0:3 ${fdt_addr_r} hifive-unmatched-a00.dtb; booti ${kernel_addr_r} - ${fdt_addr_r}"
setenv bootargs "root=PARTUUID=6f61ef04-3325-434c-978c-6a62665426e3 rootfstype=ext4 rootwait console=ttySIF0,115200 earlycon"
saveenv
reset
```

md ${fdt_addr_r} 10

setenv bootargs "console=ttySIF0,115200 earlycon root=/dev/nvme0n1p4 rootfstype=ext4 rootwait nvme_core.default_ps_max_latency_us=0 rootdelay=60 fdt_addr=0x89000000 fdt resize"
saveenv


The init=/init:
setenv bootargs "root=/dev/nvme0n1p4 rootfstype=ext4 rootwait console=ttySIF0,115200 earlycon nvme_core.default_ps_max_latency_us=0 rootdelay=30 init=/init"

setenv bootargs "root=PARTUUID=e08fcc64-9ae9-45f2-bcc6-e681c8f780ce rootfstype=ext4 rootwait console=ttySIF0,115200 earlycon"




setenv bootcmd "nvme dev 0; nvme scan; load nvme 0:3 ${kernel_addr_r} Image.gz; load nvme 0:3 ${fdt_addr_r} hifive-unmatched-a00.dtb; booti ${kernel_addr_r} - ${fdt_addr_r}"
setenv bootcmd 'nvme dev 0; nvme scan; load nvme 0:4 0x84000000 Image.gz; load nvme 0:3 0x86000000 hifive-unmatched-a00.dtb; booti 0x84000000 - 0x86000000'


setenv bootargs "root=PARTUUID=6f61ef04-3325-434c-978c-6a62665426e3 rootfstype=ext4 rootwait console=ttySIF0,115200 earlycon nvme_core.default_ps_max_latency_us=0 rootdelay=20"
setenv bootargs "root=/dev/nvme0n1p4 rootfstype=ext4 rootwait console=ttySIF0,115200 earlycon nvme_core.default_ps_max_latency_us=0 rootdelay=20"

setenv bootargs "root=/dev/nvme0n1p4 rootfstype=ext4 rootwait console=ttySIF0,115200 earlycon nvme_core.default_ps_max_latency_us=0 rootdelay=60 pcie_aspm=off pcie_port_pm=off debug initcall_debug loglevel=7"

Boot with an initramfs and run

setenv bootcmd "nvme dev 0; nvme scan; load nvme 0:3 ${kernel_addr_r} Image.gz-initramfs-unmatched.bin; load nvme 0:3 ${fdt_addr_r} hifive-unmatched-a00.dtb; booti ${kernel_addr_r} - ${fdt_addr_r}"


setenv bootargs "root=PARTUUID=e08fcc64-9ae9-45f2-bcc6-e681c8f780ce rootfstype=ext4 rootwait console=ttySIF0,115200 earlycon nvme_core.default_ps_max_latency_us=0 rootdelay=20"


Resize test:

```
setenv bootargs "root=PARTUUID=6f61ef04-3325-434c-978c-6a62665426e3 rootfstype=ext4 rootwait console=ttySIF0,115200 earlycon single partx.force=1"

setenv rootdev "/dev/nvme0n1p4"
setenv boot_targets "nvme0"
setenv root "/dev/nvme0n1p4"
```

Run `sudo resize2fs /dev/nvme0n1p4` to expand the disk in single user mode with `partx.force=1`.

```
[  OK  ] Started Rescue Shell.
[  OK  ] Reached target Rescue Mode.
You are in rescue mode. After logging in, type "journalctl -xb" to view
system logs, "systemctl reboot" to reboot, or "exit"
to continue bootup.
Give root password for maintenance
(or press Control-D to continue):

sh-5.2# sudo resize2fs /dev/nvme0n1p4
resize2fs 1.47.1 (20-May-2024)
[  134.697386] EXT4-fs (nvme0n1p4): resizing filesystem from 1984498 to 122060800 blocks
Filesystem at /dev/nvme0n1p4 is mounted on /run/media/root-nvme0n1p4; on-line resizing required
old_desc_blocks = 1, new_desc_blocks = 59
[  135.652039] EXT4-fs (nvme0n1p4): resized filesystem to 122060800
The filesystem on /dev/nvme0n1p4 is now 122060800 (4k) blocks long.
```

```

touch /forcefsck
sync
reboot
```

Original `/etc/fstab`

```
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

Revised

```
# stock fstab - you probably want to override this with a machine specific one

#/dev/root            /                    auto       defaults              1  1
PARTUUID=6f61ef04-3325-434c-978c-6a62665426e3  /  ext4  defaults  0  1

proc                 /proc                proc       defaults              0  0
devpts               /dev/pts             devpts     mode=0620,ptmxmode=0666,gid=5      0  0
tmpfs                /run                 tmpfs      mode=0755,nodev,nosuid,strictatime 0  0
tmpfs                /var/volatile        tmpfs      defaults              0  0

# uncomment this if your device has a SD/MMC/Transflash slot
#/dev/mmcblk0p1       /media/card          auto       defaults,sync,noauto  0  0

/dev/mmcblk0p3  /boot   vfat    defaults        0       0
```




Extend file system:

Adjust UBoot for single user mode:
```
setenv bootargs "root=PARTUUID=6f61ef04-3325-434c-978c-6a62665426e3 rootfstype=ext4 rootwait console=ttySIF0,115200 earlycon single"
boot
```

Enter password for single user maintenance:

```
[  OK  ] Reached target System Initialization.
[  OK  ] Reached target System Time Set.
[  OK  ] Started Rescue Shell.
[  OK  ] Reached target Rescue Mode.
You are in rescue mode. After logging in, type "journalctl -xb" to view
system logs, "systemctl reboot" to reboot, or "exit"
to continue bootup.
Give root password for maintenance
(or press Control-D to continue):
```

Run `parted` for the SSD and use the `resizepart 4 100%` interactive command:

```
parted /dev/nvme0n1
```

Or non-interactively:

```
sudo parted /dev/nvme0n1 set 4 boot on

echo "resizepart 4 100% \nYes\nquit" | parted /dev/nvme0n1
resize2fs /dev/nvme0n1p4
sync

# reboot
```





Boot SD Card

```
setenv root "/dev/mmcblk0p4"
setenv rootdev "/dev/mmcblk0p4"

setenv boot_targets
setenv bootargs "root=/dev/mmcblk0p4 rootfstype=ext4 rootwait console=ttySIF0,115200 earlycon"


setenv bootcmd "load mmc 0:3 ${kernel_addr_r} Image.gz; load mmc 0:3 ${fdt_addr_r} hifive-unmatched-a00.dtb; booti ${kernel_addr_r} - ${fdt_addr_r}"
```

bootcmd=nvme dev 0; nvme scan; load nvme 0:3 0x84000000 Image.gz; load nvme 0:3 0x86000000 hifive-unmatched-a00.dtb; booti 0x84000000 - 0x86000000


```
sudo parted /dev/nvme0n1 --fix

sudo touch /forcefsck

sudo parted /dev/nvme0n1

```

root@unmatched:~# sudo gdisk /dev/nvme0n1
GPT fdisk (gdisk) version 1.0.10

Partition table scan:
  MBR: protective
  BSD: not present
  APM: not present
  GPT: present

Found valid GPT with protective MBR; using GPT.

Command (? for help): p
Disk /dev/nvme0n1: 976773168 sectors, 465.8 GiB
Model: Samsung SSD 970 EVO Plus 500GB
Sector size (logical/physical): 512/512 bytes
Disk identifier (GUID): 00000000-0000-0000-0000-00004D9B9EF0
Partition table holds up to 128 entries
Main partition table begins at sector 2 and ends at sector 33
First usable sector is 34, last usable sector is 976773134
Partitions will be aligned on 8-sector boundaries
Total free space is 10206 sectors (5.0 MiB)

Number  Start (sector)    End (sector)  Size       Code  Name
   1              34            2081   1024.0 KiB  FFFF  primary
   2            2082           10273   4.0 MiB     FFFF  primary
   3           16384          282623   130.0 MiB   0700  boot
   4          286720       976773134   465.6 GiB   8300  root

Command (? for help): f
b       back up GPT data to a file
c       change a partition's name
d       delete a partition
i       show detailed information on a partition
l       list known partition types
n       add a new partition
o       create a new empty GUID partition table (GPT)
p       print the partition table
q       quit without saving changes
r       recovery and transformation options (experts only)
s       sort partitions
t       change a partition's type code
v       verify disk
w       write table to disk and exit
x       extra functionality (experts only)
?       print this menu

Command (? for help): x

Expert command (? for help): f

Expert command (? for help): w

Final checks complete. About to write GPT data. THIS WILL OVERWRITE EXISTING
PARTITIONS!!

Do you want to proceed? (Y/N): Y
OK; writing new GUID partition table (GPT) to /dev/nvme0n1.
The operation has completed successfully.
root@unmatched:~# lsblk -o NAME,SIZE,UUID,PARTUUID,MOUNTPOINT
NAME          SIZE UUID                                 PARTUUID                             MOUNTPOINT
mmcblk0      29.7G
|-mmcblk0p1     1M                                      4ccb1962-0f94-4337-a843-fe083f83a51d
|-mmcblk0p2     4M                                      434da497-7451-45de-b29d-a863cdbcb012
|-mmcblk0p3   130M 756C-0B0D                            274a18ad-c485-43c3-a30a-ab2af0891226 /boot
`-mmcblk0p4   7.6G 29ee5087-762f-48af-a52a-51e7bff14330 6f61ef04-3325-434c-978c-6a62665426e3 /
nvme0n1     465.8G
|-nvme0n1p1     1M                                      b676a139-eae7-4f2d-b422-d4a122e3d581
|-nvme0n1p2     4M                                      a86d6a83-e0a8-4bdd-a066-f70a42939536
|-nvme0n1p3   130M 756C-0B0D                            506f3406-3011-4c1a-8a8e-3a2a87dda4d9
`-nvme0n1p4 465.6G                                      e08fcc64-9ae9-45f2-bcc6-e681c8f780ce
root@unmatched:~#




 210  parted /dev/nvme0n1 set 4 msftdata off
  211  parted /dev/nvme0n1 set 4 boot off
  212  parted /dev/nvme0n1 set 4 esp off




  sudo mkdir -p /mnt/source /mnt/destination

sudo mount /dev/mmcblk0p4 /mnt/source
sudo mount /dev/nvme0n1p4 /mnt/destination
sudo rsync -aAXv /mnt/source/ /mnt/destination/
sudo umount /mnt/source
sudo umount /mnt/destination

echo "nvme-core" | sudo tee -a /etc/modules-load.d/nvme.conf
echo "nvme" | sudo tee -a /etc/modules-load.d/nvme.conf


echo "nvme-core" | sudo tee -a /mnt/my4/etc/modules-load.d/nvme.conf
echo "nvme" | sudo tee -a /mnt/my4/etc/modules-load.d/nvme.conf

