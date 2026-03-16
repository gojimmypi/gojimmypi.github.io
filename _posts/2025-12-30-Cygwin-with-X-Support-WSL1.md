---
layout: post
title: "Setup Cygwin Xwin X-Windows server for WSL1"
description: "Notes on installing an X-Windows Cygwin/X (XWin) server for WSL1"
date: '2025-12-30'
author: gojimmypi
tags:
    - WSL
    - WSL1
    - X-Windows
    - XWin
    - CygwinX
    - xorg-server
    - xauth
    - xinit
    - xterm
---

Here are some notes on installing an X-Windows Cygwin/X (XWin) server for WSL1.

Why would you want Xwin support? Well for one: [GTKwave](https://gtkwave.github.io/gtkwave/) from a WSL prompt.

If you choose to use WSL2 (WSLg) instead, the XWindows support is already built in, so stop now.

WSL1 has much better disk performance on shared directories (e.g. `c:\workspace` and `/mnt/c/workspace`)

This is an update to my prior blog on [WSL GUI - Using Cygwin X-Server for Graphical Interfac](../wsl-gui-using-cygwin-x-server-for/)

## 1. Install Cygwin with X support (Windows side)

Download [Cygwin installer](https://www.cygwin.com/install.html) and run `setup-x86_64.exe`, then explicitly select
these additional items:

```text
xorg-server
xinit
xauth
xterm (recommended)
```

Let Cygwin auto-select dependencies.

Do not manually chase dependencies (GTK, dbus, fonts, etc.).
Cygwin will pull in everything required.

dbus being installed is normal. It does not need to run.

## 2. Start the X server correctly for WSL 1

Important: XWin must listen on TCP and allow local access.

From a Cygwin terminal:

```bash
startxwin -- -listen tcp -ac
```

What this does:

`-listen tcp` : required for WSL 1

`-ac` : disables X authentication (avoids .Xauthority issues)

Verify:

X icon appears in system tray

An xterm window opens

## 3. Configure WSL 1 to use the X server

In WSL:

```bash
export DISPLAY=:0
```


(Optional, persistent)

```bash
echo 'export DISPLAY=:0' >> ~/.bashrc
```

## 4. Install test X applications in WSL

```bash
sudo apt update
sudo apt install x11-apps
```

Test:

```bash
xclock
```

If the window appears, X connectivity is confirmed.

## 5. Fix locale warnings (optional but clean)

If you see:

Warning: Missing charsets in String to FontSet conversion

Generate and enable a UTF-8 locale in WSL

```
sudo apt install locales
sudo locale-gen en_US.UTF-8
sudo update-locale LANG=en_US.utf8
```

Restart WSL, then verify:

```
locale
```

Ensure:

```
LANG=en_US.utf8 (or en_US.UTF-8)

LC_ALL is unset
```

If you want the simplest possible workaround instead:

LC_ALL=C xclock

## 6. Install and run GTKWave (WSL side)

```
sudo apt install gtkwave
gtkwave
```

GTKWave runs entirely in WSL; Cygwin only provides the display server.

## 7. Antivirus note (important)

Some antivirus tools may flag:

```DOS
C:\cygwin64\bin\dbus-launch.exe
```

This is a false positive (IDP.Generic / heuristic).
It is a normal Cygwin dbus helper.

Options:

Restore + whitelist C:\cygwin64\

Or leave it quarantined (GTKWave/XWin still works)

## 8. Example output

If successfully installed and configured, the results of `startxwin -- -listen tcp -ac` should looks something list this:

```text
gojimmypi@Notebook ~
$ startxwin -- -listen tcp -ac

Welcome to the XWin X Server
Vendor: The Cygwin/X Project
Release: 1.21.1.15
OS: CYGWIN_NT-10.0-26100 Notebook 3.6.5-1.x86_64 2025-10-09 17:21 UTC x86_64
OS: Windows 10  [Windows NT 10.0 build 26100] x64
Package: version 21.1.15-1 built 2025-01-26

XWin was started with the following command line:

/usr/bin/XWin :0 -multiwindow -listen tcp -ac -auth
 /home/gojimmypi/.serverauth.1580

(II) xorg.conf is not supported
(II) See http://x.cygwin.com/docs/faq/cygwin-x-faq.html for more information
winUpdateDpi - primary monitor native DPI x 120 y 120
LoadPreferences: /home/gojimmypi/.XWinrc not found
LoadPreferences: Loading /etc/X11/system.XWinrc
LoadPreferences: Done parsing the configuration file...
winDetectSupportedEngines - RemoteSession: no
winDetectSupportedEngines - DirectDraw4 installed, allowing ShadowDDNL
winDetectSupportedEngines - Returning, supported engines 00000005
winSetEngine - Multi Window or Rootless => ShadowGDI
winScreenInit - Using Windows display depth of 32 bits per pixel
winAllocateFBShadowGDI - Creating DIB with width: 4480 height: 1724 depth: 32
winFinishScreenInitFB - Masks: 00ff0000 0000ff00 000000ff
winInitVisualsShadowGDI - Masks 00ff0000 0000ff00 000000ff BPRGB 8 d 24 bpp 32
MIT-SHM extension disabled due to lack of kernel support
XFree86-Bigfont extension local-client optimization disabled due to lack of shared memory support in the kernel
glWinSelectGLimplementation: Loaded 'cygnativeGLthunk.dll'
(II) AIGLX: Testing pixelFormatIndex 1
GL_VERSION:     4.6.0 - Build 32.0.101.7077
GL_VENDOR:      Intel
GL_RENDERER:    Intel(R) Iris(R) Xe Graphics
(II) GLX: enabled GLX_SGI_make_current_read
(II) GLX: enabled GLX_SGI_swap_control
(II) GLX: enabled GLX_MESA_swap_control
(II) GLX: enabled GLX_SGIX_pbuffer
(II) GLX: enabled GLX_ARB_multisample
(II) GLX: enabled GLX_SGIS_multisample
(II) GLX: enabled GLX_ARB_fbconfig_float
(II) GLX: enabled GLX_EXT_fbconfig_packed_float
(II) GLX: enabled GLX_ARB_create_context
(II) GLX: enabled GLX_ARB_create_context_profile
(II) GLX: enabled GLX_ARB_create_context_robustness
(II) GLX: enabled GLX_EXT_create_context_es2_profile
(II) GLX: enabled GLX_ARB_framebuffer_sRGB
(II) AIGLX: enabled GLX_MESA_copy_sub_buffer
(II) 111 pixel formats reported by wglGetPixelFormatAttribivARB
(II) 74 fbConfigs
(II) ignored pixel formats: 1 not OpenGL, 0 unknown pixel type, 36 unaccelerated
(II) GLX: Initialized Win32 native WGL GL provider for screen 0
winPointerWarpCursor - Discarding first warp: 2240 862
(--) 5 mouse buttons found
(--) Setting autorepeat to delay=500, rate=31
(--) Windows keyboard layout: "00000409" (00000409) "US", type 4
(--) Found matching XKB configuration "English (USA)"
(--) Model = "pc105" Layout = "us" Variant = "none" Options = "none"
Rules = "base" Model = "pc105" Layout = "us" Variant = "none" Options = "none"
winInitMultiWindowWM - DISPLAY=:0.0
winMultiWindowXMsgProc - DISPLAY=:0.0
winMultiWindowXMsgProc - xcb_connect() returned and successfully opened the display.
winProcEstablishConnection - winInitClipboard returned.
winClipboardThreadProc - DISPLAY=:0.0
winInitMultiWindowWM - xcb_connect () returned and successfully opened the display.
winClipboardProc - xcb_connect () returned and successfully opened the display.
Using Composite redirection
OS has icon alpha channel support: yes
```
