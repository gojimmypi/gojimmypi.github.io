---
layout: post
title: "EdgeRouter-X Port Mirroring: Inspect ESP32 Network Packets V2"
description: "This setup is similar to a prior blog, but this time using an [ExpressVPN Go Router](https://www.expressvpn.com/blog/aircove-go-new-portable-vpn-router/)."
date: '2025-07-18'
author: gojimmypi
tags:
- WireShark
- port monitor
- port mirror
- port span
- switch
- ESP32
---

This setup is similar to a prior blog, but this time using an [ExpressVPN Go Router](https://www.expressvpn.com/blog/aircove-go-new-portable-vpn-router/).

The AirCove Go is cool for a variety of reasons, not only as a VPN for hotel guests, but also for the same feature that it is both a WiFi Station `STA` and Access Point `AP`.

Here, it is being used to connect an entire wired-LAN lab setup to a WiFi HotSpot for Internet.

{% include code_header.html %}
```bash
/sbin/switch mirror monitor [portnumber]        - enable port mirror and indicate monitor port number
/sbin/switch mirror target [portnumber] [mode]  - set port mirror target; 0:off, 1:rx, 2:tx, 3:all
```
cat < /dev/serial0 &
echo "test loopback" > /dev/serial0

This time the configuration is using these ports on the EdgeRouter-X:

`eth0` - Uplink to AriCove Go
`eth1` - Monitoring computer
`eth2` - Another computer
`eth3` - (available)
`eth4` - DUT Router

{% include code_header.html %}
```bash
# we'll monitor from eth1. (ports start at 0, left-most when facing)
sudo /sbin/switch mirror monitor 1

# start mirroring packets from eth4 onto eth1; a value of 3 means all packets
sudo /sbin/switch mirror target 4 3
```


A list of all `switch` command-line parameters:
{% include code_header.html %}
```text
admin@EdgeRouter-X-5-Port# /sbin/switch
Usage:
 /sbin/switch acl etype add [ethtype] [portmap]              - drop etherytype packets
 /sbin/switch acl dip add [dip] [portmap]                    - drop dip packets
 /sbin/switch acl dip meter [dip] [portmap][meter:kbps]      - rate limit dip packets
 /sbin/switch acl dip trtcm [dip] [portmap][CIR:kbps][CBS][PIR][PBS] - TrTCM dip packets
 /sbin/switch acl port add [sport] [portmap]           - drop src port packets
 /sbin/switch acl L4 add [2byes] [portmap]             - drop L4 packets with 2bytes payload
 /sbin/switch add [mac] [portmap]                  - add an entry to switch table
 /sbin/switch add [mac] [portmap] [vlan id]        - add an entry to switch table
 /sbin/switch add [mac] [portmap] [vlan id] [age]  - add an entry to switch table
 /sbin/switch clear                                - clear switch table
 /sbin/switch del mac [mac] vid [vid]              - delete an entry from switch table
 /sbin/switch del mac [mac] fid [fid]            - delete an entry from switch table
 /sbin/switch search mac [mac] vid [vid]                 - search an entry with specific mac and vid
 /sbin/switch search mac [mac] fid [fid]                 - search an entry with specific mac and fid
 /sbin/switch dip add [dip] [portmap]                  - add a dip entry to switch table
 /sbin/switch dip del [dip]                          - del a dip entry to switch table
 /sbin/switch dip dump                                 - dump switch dip table
 /sbin/switch dip clear                                - clear switch dip table
 /sbin/switch dump              - dump switch table
 /sbin/switch ingress-rate on [port] [Kbps]        - set ingress rate limit on port 0~4
 /sbin/switch egress-rate on [port] [Kbps]         - set egress rate limit on port 0~4
 /sbin/switch ingress-rate off [port]              - del ingress rate limit on port 0~4
 /sbin/switch egress-rate off [port]               - del egress rate limit on port 0~4
 /sbin/switch filt [mac]                           - add a SA filtering entry (with portmap 1111111) to switch table
 /sbin/switch filt [mac] [portmap]                 - add a SA filtering entry to switch table
 /sbin/switch filt [mac] [portmap] [vlan id]       - add a SA filtering entry to switch table
 /sbin/switch filt [mac] [portmap] [vlan id] [age] - add a SA filtering entry to switch table
 /sbin/switch igmpsnoop on [Query Interval] [default router portmap] - turn on IGMP snoop and  router port learning (Query Interval 1~255)
 /sbin/switch igmpsnoop off                                  - turn off IGMP snoop and router port learning
 /sbin/switch igmpsnoop enable [port#]                       - enable IGMP HW leave/join/Squery/Gquery
 /sbin/switch igmpsnoop disable [port#]                      - disable IGMP HW leave/join/Squery/Gquery
 /sbin/switch mymac [mac] [portmap]                  - add a mymac entry to switch table
 /sbin/switch mirror monitor [portnumber]            - enable port mirror and indicate monitor port number
 /sbin/switch mirror target [portnumber] [0:off, 1:rx, 2:tx, 3:all]  - set port mirror target
 /sbin/switch phy                                        - dump all phy registers
 /sbin/switch phy [phy_addr]                     - dump phy register of specific port
 /sbin/switch phy mt7530                         - dump mt7530 phy registers
 /sbin/switch crossover [port] [auto/mdi/mdix]   - switch auto or force mdi/mdix mode for crossover cable
 /sbin/switch pvid [port] [pvid]                - set pvid on port 0~4
 /sbin/switch pvid dump                         - dump port pvid setting
 /sbin/switch reg r [offset]                       - register read from offset
 /sbin/switch reg w [offset] [value]               - register write value to offset
 /sbin/switch reg d [offset]                       - register dump
 /sbin/switch sip add [sip] [dip] [portmap]            - add a sip entry to switch table
 /sbin/switch sip del [sip] [dip]                            - del a sip entry to switch table
 /sbin/switch sip dump                                 - dump switch sip table
 /sbin/switch sip clear                                - clear switch sip table
 /sbin/switch tag on [port]                        - keep vlan tag for egress packet on prot 0~4
 /sbin/switch tag off [port]                       - remove vlan tag for egress packet on port 0~4
 /sbin/switch vlan dump                            - dump switch table
 /sbin/switch vlan set [vlan idx (NULL)][vid] [portmap]  - set vlan id and associated member
```