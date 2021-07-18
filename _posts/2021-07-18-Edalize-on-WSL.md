---
layout: post
title: "Edalize on WSL"
date: '2021-07-17'
author: gojimmypi
tags:
- FPGA
- Verilog
- Edalize
---

(draft - WIP)

I've been wanting to learn more about some of the [EDA](https://en.wikipedia.org/wiki/Electronic_design_automation) tools avialable, 
in particular the open source [Edalize](https://github.com/olofk/edalize) that [Olof Kindgren](https://twitter.com/olofkindgren) has created.

There was a [minor stumble](https://github.com/olofk/edalize/issues/258) during my first attempt just to install Edalize on WSL.
It seems I had a Python library dependency that was ever-so-slightly the wrong version.

First, I also have an old version of `Python` installed, so this failed:
```
$ python -m pip install -e .
DEPRECATION: Python 2.7 will reach the end of its life on January 1st, 2020. Please upgrade your Python as Python 2.7 won't be maintained after that date. A future version of pip will drop support for Python 2.7.
File "setup.py" not found. Directory cannot be installed in editable mode: /home/gojimmypi
You are using pip version 19.0.2, however version 20.3.4 is available.
You should consider upgrading via the 'pip install --upgrade pip' command.
```

You can see which versions of Python libraries are isntalled with `pip freeze` and `pip3 freeze`.

As noted in [edalize #258](https://github.com/olofk/edalize/issues/258), my `Jinja2` was a bit [outdated](https://github.com/olofk/edalize/blob/master/setup.py#L57), and was fixed like this: `pip3 install -U Jinja2`

The [Edalize install script is named setup.py](https://github.com/olofk/edalize/blob/master/setup.py)

Here's what I did to install Edalize:

{% include code_header.html %}
```bash
# on WSL, I keep all my stuff in C:\workspace
mkdir -p /mnt/c/workspace

cd /mnt/c/workspace/

git clone https://github.com/olofk/edalize.git
cd edalize

# update dependencies:
pip3 install -U Jinja2
pip3 install -U MarkupSafe

# install Edalize
python -m pip install -e .

```

Next, I created a Edalize_blinky directory with these files:

```
blinky.v
blinky_tb.v
myTest.py
vlog_tb_utils.v
```

A matter of personal preference, I like to have samples files complete, rather than separate narrated sections.
This is from the [How to use it](https://github.com/olofk/edalize#how-to-use-it):
{% include code_header.html %}
```
# file name: myTest.py
#
# First we have to import Edalize objects:
from edalize import *

# The os module is also required for this tutorial:
import os

# Then register the files to use:
work_root = 'build'

files = [
  {'name' : os.path.relpath('blinky.v', work_root),
   'file_type' : 'verilogSource'},
  {'name' : os.path.relpath('blinky_tb.v', work_root),
   'file_type' : 'verilogSource'},
  {'name' : os.path.relpath('vlog_tb_utils.v', work_root),
   'file_type' : 'verilogSource'}
]

# The design has a toplevel Verilog parameter with the name clk_freq_hz that accepts integers. 
# We set its default value to 1000. The testbench also has an option to enable waveform dumping by setting a plusarg called vcd:
parameters = {'clk_freq_hz' : {'datatype' : 'int', 'default' : 1000, 'paramtype' : 'vlogparam'},
              'vcd' : {'datatype' : 'bool', 'paramtype' : 'plusarg'}}

# Let Edalize know we intend to use Icarus Verilog for our simulation:
tool = 'icarus'

# And put it all into a single data structure together with some info about the toplevel and name for the project:
edam = {
  'files'        : files,
  'name'         : 'blinky_project',
  'parameters'   : parameters,
  'toplevel'     : 'blinky_tb'
}

# Now we need to get ourselves a backend object from Edalize:
backend = get_edatool(tool)(edam=edam,
                            work_root=work_root)

# Create the directory and the project files:
os.makedirs(work_root)
backend.configure()

# At this point, we still haven't run the actual EDA tool and the files in the `work_root` directory 
# can be used without Edalize if that is preferred. But let's continue the example with Edalize.

# Build the simulation model:
backend.build()

# And finally run it, with our arguments. Some types of parameters (e.g. plusargs) are defined aat runtime,
# and at this point we can change their value by passing the name and new value to run(). Or we could skip
# it altogether, and the default value from the configure stage would be used. Let's run with VCD logging enabled:

args = {'vcd' : True}
backend.run(args)

```

The [blinky.v](https://github.com/fusesoc/blinky/blob/master/blinky.v):
{% include code_header.html %}
```
module blinky
  #(parameter clk_freq_hz = 0)
   (input  clk,
    output reg q = 1'b0);

   reg [$clog2(clk_freq_hz)-1:0] count = 0;

   always @(posedge clk) begin
      count <= count + 1;
      if (count == clk_freq_hz-1) begin
	 q <= !q;
	 count <= 0;
      end
   end

endmodule
```

The [blinky_tb.v](https://github.com/fusesoc/blinky/blob/master/blinky_tb.v) file:
{% include code_header.html %}
```
`timescale 1ns/1ns
module blinky_tb;

   parameter clk_freq_hz = 50_000;
   parameter pulses = 5;
   localparam clk_half_period = 1000_000_000/clk_freq_hz/2;

   reg clk = 1'b1;

   always #clk_half_period clk <= !clk;


   wire led;

   vlog_tb_utils vtu();

   blinky
     #(.clk_freq_hz (clk_freq_hz))
   dut
     (.clk (clk),
      .q   (led));

   integer i;
   time last_edge = 0;

   initial begin
      @(posedge clk);
      @(led);
      last_edge = $time;
      for (i=0; i<pulses;i=i+1) begin
	 @(led);
	 if (($time-last_edge) != 1_000_000_000) begin
	    $display("Error! Length of pulse was %0d ns", $time-last_edge);
	    $finish;
	 end else
	   $display("Pulse %0d/%0d OK!", i+1, pulses);
	 last_edge = $time;
      end
      $display("Testbench finished OK");
      $finish;
   end

endmodule
```

The [vlog_tb_utils.v](https://github.com/fusesoc/vlog_tb_utils/blob/master/vlog_tb_utils.v) file:

{% include code_header.html %}
```verilog
/*
 *  Utility module for verilog testbenches
 *
 *  Copyright (C) 2016  Olof Kindgren <olof.kindgren@gmail.com>
 *
 *  Permission to use, copy, modify, and/or distribute this software for any
 *  purpose with or without fee is hereby granted, provided that the above
 *  copyright notice and this permission notice appear in all copies.
 *
 *  THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
 *  WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
 *  MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
 *  ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
 *  WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
 *  ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
 *  OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 */

module vlog_tb_utils;
   parameter MAX_STRING_LEN = 128;
   localparam CHAR_WIDTH = 8;

   //Force simulation stop after timeout cycles
   reg [63:0] timeout;
   initial
     if($value$plusargs("timeout=%d", timeout)) begin
	#timeout $display("Timeout: Forcing end of simulation");
	$finish;
     end

   //FIXME: Add more options for VCD logging
   reg [MAX_STRING_LEN*CHAR_WIDTH-1:0] testcase;

   initial begin
      if($test$plusargs("vcd")) begin
	 if($value$plusargs("testcase=%s", testcase))
	   $dumpfile({testcase,".vcd"});
	 else
	   $dumpfile("testlog.vcd");
	 $dumpvars;
      end
   end

   //Heartbeat timer for simulations
   reg [63:0] heartbeat;
   initial begin
      if($value$plusargs("heartbeat=%d", heartbeat))
	forever #heartbeat $display("Heartbeat : Time=%0t", $time);
   end

endmodule // vlog_tb_utils
```


See also:

[A first look at Edalize for ASIC flows](http://olofkindgren.blogspot.com/2021/04/a-first-look-at-edalize-for-asic-flows.html)