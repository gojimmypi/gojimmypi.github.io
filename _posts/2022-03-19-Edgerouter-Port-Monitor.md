---
layout: post
title: "EdgeRouter-X Port Mirroring: Inspect ESP32 Network Packets"
description: "By default the Ubiquiti EdgeRouter-X acts as a swtich, meaning packets from other ports will generally not be visible. See the `/sbin/switch` command, in"
date: '2022-03-19'
author: gojimmypi
tags:
- WireShark
- port monitor
- port mirror
- port span
- switch
- ESP32
---

By default the Ubiquiti EdgeRouter-X acts as a swtich, meaning packets from other ports will generally not be visible.

See the `/sbin/switch` command, in particular the `mirror` option:


{% include code_header.html %}
```text
/sbin/switch mirror monitor [portnumber]        - enable port mirror and indicate monitor port number
/sbin/switch mirror target [portnumber] [mode]  - set port mirror target; 0:off, 1:rx, 2:tx, 3:all
```

Monitor packets on port 2 from port 4:
{% include code_header.html %}
```bash
# we'll monitor from eth4. (ports start at 0, left-most when facing)
sudo /sbin/switch mirror monitor 4

# start mirroring packets from eth2 onto eth4; a value of 3 means all packets
sudo /sbin/switch mirror target 2 3
```



Turn off port mirroring:

{% include code_header.html %}
```bash
# stop mirroring packets from eth2 onto eth4; a value of 0 means turn off
sudo /sbin/switch mirror target 2 0
```

Note there are other options, such as calling `tcpdump` from ssh and piping the output to Wireshark from Windows:


{% include code_header.html %}
```dos
ssh ubnt@192.168.75.1 "sudo tcpdump -f -i eth0 -w -" | "C:\Program Files\Wireshark\Wireshark.exe" -k -i -

:: or

ssh ubnt@192.168.75.1 "sudo tcpdump port not 22 -i any -w -" | "C:\Program Files\Wireshark\Wireshark.exe" -k -i -

```

ymmv, as ESP32 traffic was not actually observed with the `tcpdump` method. See also `sudo tcpdump -D` for a list of device interfaces.

For more details on the EdgeRouter-X, see [this post](https://gojimmypi.github.io/dual-wan-openvpn-with-edgerouter-x-or/).

[tcpdump manual](http://manpages.ubuntu.com/manpages/trusty/man8/tcpdump.8.html)