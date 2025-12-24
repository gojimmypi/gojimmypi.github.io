---
layout: post
title: "WSL missing USB mapping"
date: '2025-04-30'
author: gojimmypi
tags:
- WSL
- USB
---


```
$ readlink -f /mnt/f
/mnt/f
```

but `ls /mnt/f` does not show the files in the root of the USB `F:\` drive.


```
sudo mkdir -p /mnt/usb
sudo mount -t drvfs F: /mnt/usb
ls /mnt/usb
```

Backup `C:\Sysgcc`

```
sudo rsync -a --exclude='*.tmp' /mnt/c/SysGCC/ /mnt/usb/Backup2/SysGCC/
```