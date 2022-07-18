---
layout: post
title: "Fixing FTDI2232HL Dual Interface that appears as only one device"
date: '2022-07-16'
author: gojimmypi
tags:
- ESP32
- 2232HL
- FTDI2232HL
---

Fixing FTDI2232HL Dual Interface that appears as only one device.

The FTDI 2232, such as the one found on the [Espressif ESP32-Ethernet-Kit V1.2](https://docs.espressif.com/projects/esp-idf/en/latest/esp32/hw-reference/esp32/get-started-ethernet-kit.html#) 
is _normally_ a 2-interface device. But sometimes Microsoft Windows... well, you know.

If for some reason Windows just insists that there's only one device, there's hope! As reported in Zadig:

![single-FTDI2232HL.png](../images/single-FTDI2232HL.png)

Although the board will technically work with only once device, a decision will need to be made as to whether
that the respective interface is used for JTAG _or_ Serial. During development _and_ an interface for COM-port 
serial output.

To resolve this situation, first ensure the board is plugged in and manually install the "Compoosite Device" driver. 

![pick_new_driver.png](../images/esp32-devkit/pick_new_driver.png)
![pick_composite_device.png](../images/esp32-devkit/pick_composite_device.png)
![newly_dual_RS232-HS_devices.png](../images/esp32-devkit/newly_dual_RS232-HS_devices.png)
![interface_0_WinUSB.png](../images/esp32-devkit/interface_0_WinUSB.png)
![interface_1_FTDIBUS.png](../images/esp32-devkit/interface_1_FTDIBUS.png)
![JTAG_success.png](../images/esp32-devkit/JTAG_success.png)

![interface_0_WinUSB.png](../images/interface_0_WinUSB.png)
![](../images)
[](https://docs.espressif.com/projects/esp-idf/en/latest/esp32/hw-reference/esp32/get-started-ethernet-kit.html#get-started-esp32-ethernet-kit-v1-2)
[ft2232hl](https://ftdichip.com/products/ft2232hl/)