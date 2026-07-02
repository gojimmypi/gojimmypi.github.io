---
layout: page
sidebar: false
sitemap: false
last_modified_at: 2026-04-24T11:00:00-08:00
---

{%- if site.page_debug -%}
<!-- begin /tinytapeout/index.html -->
{%- endif -%}

Tiny Tapeout makes it more accessible than ever to get your designs manufactured on a real chip! See [tinytapeout.com](https://tinytapeout.com/)
and [zerotoasiccourse.com/newsletter](https://www.zerotoasiccourse.com/newsletter/) to sign up for the newsletter.

Projects are at: [app.tinytapeout.com/projects](https://app.tinytapeout.com/projects)

My GF26 is at:
- [app.tinytapeout.com/projects/4337](https://app.tinytapeout.com/projects/4337/) 
- GitHub: [github.com/gojimmypi/ttgf-UART-FSM-TRNG-Lab](https://github.com/gojimmypi/ttgf-UART-FSM-TRNG-Lab/)
- Post release notes: [gojimmypi.github.io/trng](https://gojimmypi.github.io/trng/)

My SKY26a (draft, not submitted) [PDK](https://skywater-pdk.readthedocs.io/en/main/) is 
- [app.tinytapeout.com/projects/4338/](https://app.tinytapeout.com/projects/4338/)
- GitHub: [github.com/gojimmypi/ttsky-UART-FSM-TRNG-Lab](https://github.com/gojimmypi/ttsky-UART-FSM-TRNG-Lab/)
- Post release notes: [gojimmypi.github.io/trng](https://gojimmypi.github.io/trng/)

See also: 
     
Tiny Tapeout [Calculator](https://app.tinytapeout.com/calculator).

Tiny Tapeout: [Demo Board](https://github.com/TinyTapeout/tt-demo-pcb) and [breakout-pcb](https://github.com/tinytapeout/breakout-pcb) (sold only as a set).

Visit the [GDS Viewer](https://gds-viewer.tinytapeout.com).

Upload a file from a recent successful [gds.yaml workflow](https://github.com/gojimmypi/ttsky-UART-FSM-TRNG-Lab/actions/workflows/gds.yaml) that should have generated an artifact file, such as [this one](https://github.com/gojimmypi/ttsky-UART-FSM-TRNG-Lab/actions/runs/24858949584/artifacts/6612226151).

This will allow you to view the layout of your design and verify that it looks correct before tapeout. You can also share the GDS viewer link with others to get feedback on your design.

## Magic

To build local GDS and LEF files, `Magic` is needed.

- http://opencircuitdesign.com/magic/
- https://github.com/RTimothyEdwards/magic

```
cd "$HOME/ttsetup"

sudo apt update
sudo apt install -y \
    build-essential git m4 csh tcsh \
    libx11-dev tcl-dev tk-dev \
    libcairo2-dev libncurses-dev \
    libglu1-mesa-dev freeglut3-dev mesa-common-dev

git clone https://github.com/RTimothyEdwards/magic.git
cd magic

./configure --prefix="$HOME/ttsetup/magic"
make -j"$(nproc)"
make install

export PATH="$HOME/ttsetup/magic/bin:$PATH"
```

## Create Downstream Update

```
cd /mnt/c/workspace/

mkdir ttgf0p3-analog-UART-FSM-TRNG-Lab

cd ./ttgf0p3-analog-UART-FSM-TRNG-Lab/

git init

# Initialized empty Git repository in /mnt/c/workspace/ttgf0p3-analog-UART-FSM-TRNG-Lab/.git/

git remote add origin https://github.com/$USER/ttgf0p3-analog-UART-FSM-TRNG-Lab.git

git remote add upstream https://github.com/gojimmypi/ttgf0p3-UART-FSM-TRNG-Lab.git

git fetch upstream main

git pull upstream main
```

<iframe
    width="560"
    height="315"
    src="https://www.youtube-nocookie.com/embed/qVWq_XZko-M"
    title="YouTube video player"
    frameborder="0"
    allowfullscreen>
</iframe>