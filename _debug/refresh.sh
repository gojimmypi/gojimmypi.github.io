#!/bin/bash

# the location of wolfSSL where the ./configure script should run
WOLFSSL_REPO="/mnt/c/workspace/wolfssl"

# the directory where output files go (a github repo is helpful for tracking changes)
WOLFSSL_FILE_ROOT="/mnt/c/workspace/gojimmypi.github.io/_debug"

# set a variable for the input command
WOLFSSL_CMD_FILE="$WOLFSSL_FILE_ROOT/cmd.txt"

# setup some variables for output files
WOLFSSL_OUTPUT="$WOLFSSL_FILE_ROOT/output.txt"
WOLFSSL_OPTIONS="$WOLFSSL_FILE_ROOT/options.h"
WOLFSSL_YES="$WOLFSSL_FILE_ROOT/Enabled-Features.txt"
WOLFSSL_NO="$WOLFSSL_FILE_ROOT/Disabled-Features.txt"


cd "$WOLFSSL_REPO"

# show the command text found
echo "CMD File= $WOLFSSL_CMD_FILE"
echo ""

# get the contents of the command file, trimming all text after the # character
WOLFSSL_CMD="$(cat $WOLFSSL_CMD_FILE | cut -d'#' -f1)"
echo "CMD = $WOLFSSL_CMD"
echo ""

# Execute the command:
# bash -c $WOLFSSL_CMD
$(echo $WOLFSSL_CMD)  | tee "$WOLFSSL_OUTPUT"

# save the generated options.h
mv wolfssl/options.h "$WOLFSSL_OPTIONS"

# pull out the enabled and disabled features into separate files
grep  "\*" "$WOLFSSL_OUTPUT" | grep yes > "$WOLFSSL_YES"
grep  "\*" "$WOLFSSL_OUTPUT" | grep no > "$WOLFSSL_NO"
