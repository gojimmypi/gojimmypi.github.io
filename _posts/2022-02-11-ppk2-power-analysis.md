---
layout: post
title: "PPK2 Power Analysis"
date: '2022-02-11'
author: gojimmypi
tags:
- PPK2
- Power
- Debugging
---

As part of my homework for the Making Embedded Systems class, here are some of my notes.

The PPK2 works in one of two modes: either [Measuring current in Source Meter mode](https://infocenter.nordicsemi.com/index.jsp?topic=%2Fug_ppk2%2FUG%2Fppk%2Fmeasure_current_source_meter.html&cp=10_8_5_1)
or [Measuring current in Ampere Meter mode](https://infocenter.nordicsemi.com/index.jsp?topic=%2Fug_ppk2%2FUG%2Fppk%2Fmeasure_current_source_meter.html&anchor=concept_kkn_bwn_lnb__fig_yny_jn4_lnb).
I'm using it in source mode to power the isolated side of the [Analog Devices EVAL-ADUM4160 USB Development Board](https://www.analog.com/en/design-center/evaluation-hardware-and-software/evaluation-boards-kits/eval-adum4160.html). 

![PPK3_power_analysis.png](./images/PPK3_power_analysis.png)

[nRF Connect for Desktop](https://www.nordicsemi.com/Products/Development-tools/nrf-connect-for-desktop)

[download](https://www.nordicsemi.com/Products/Development-tools/nRF-Connect-for-desktop/Download#infotabs)

[Power Profiler Kit v1.1.0 User Guide](https://infocenter.nordicsemi.com/pdf/PPK1_User_Guide_20210226.pdf)

[](https://infocenter.nordicsemi.com/index.jsp?topic=%2Fug_ppk%2FUG%2Fcommon%2Fnrf_connect_app_installing.html)