# wolfSSL Configuration Assistance

This directory contains an assistance script called [refresh.sh](./refresh.sh) that reads a bash-like command in [cmd.txt](./cmd.txt) 
and runs it. 

The command expected is the wolfSSL `./configure` that expects a potentially _large_ number of parameters. (see the [--help](./help.txt)).

Unlike normal bash commands spanning multiple lines, comments are allowed. Use the same `#` on a line for everything afterwards to be ignored. 

Line continuation characters `\` should not be used.

The multi-line `./configure` command with all parameters on subsequent lines is stripped of comments and everything placed on a single line statement when executed.

Upon execution, the entire output is set to a file called [output.txt](./output.txt). Additionally, the enabled/disabled features (those items with an asterisk in the output and the word "yes" or "no") 
are separated and stored in the respective [Enabled-Features.txt](Enabled-Features.txt) and [Enabled-Features.txt](Enabled-Features.txt) files.

## Installation

Place the  [refresh.sh](./refresh.sh) and [cmd.txt](./cmd.txt) files in a directory. 

It may be convenient for this directory to be in a GitHub repo for easily tracking change the output files, typically your project that is using wolfSSL.

## Configuration:

See the variables in the [refresh.sh](./refresh.sh) script:


#### `WOLFSSL_REPO` 

This the location of wolfSSL where the `./configure script` should run and is typically the location of your wolfSSL `git clone`. 
For example in WSL for a clone in the `C:\workspace` directory, this value would be:

`WOLFSSL_REPO="/mnt/c/workspace/wolfssl"`

#### `WOLFSSL_FILE_ROOT`

The directory where output files go (a github repo is helpful for tracking changes). For example:

`WOLFSSL_FILE_ROOT="/mnt/c/workspace/gojimmypi.github.io/_debug"`


#### `WOLFSSL_CMD_FILE`

This the `.configure` command to edit.

`WOLFSSL_CMD_FILE="$WOLFSSL_FILE_ROOT/cmd.txt"`

#### Output files

The output files currently all go to the `$WOLFSSL_FILE_ROOT` but can be adjusted as needed:

```
WOLFSSL_OUTPUT="$WOLFSSL_FILE_ROOT/output.txt"
WOLFSSL_OPTIONS="$WOLFSSL_FILE_ROOT/options.h"
WOLFSSL_YES="$WOLFSSL_FILE_ROOT/Enabled-Features.txt"
WOLFSSL_NO="$WOLFSSL_FILE_ROOT/Disabled-Features.txt"
```

## Usage

Run the [refresh.sh](./refresh.sh) script and observe output files.


#### Other Resources

Kaleb's [wolfSoFT - wolf Suite of Frameworks and Tools](https://github.com/kaleb-himes/wolfSoFT)

* Note Kaleb is working on a "user settings to configure file" feature to create a wolfSSL `.configure` command with the parameters used to create the provided header file.