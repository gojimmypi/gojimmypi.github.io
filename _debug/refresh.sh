#!/bin/bash

WOLFSSL_CMD_FILE="/mnt/c/workspace/gojimmypi.github.io/_debug/cmd.txt"
WOLFSSL_OUTPUT="/mnt/c/workspace/gojimmypi.github.io/_debug/output.txt"
WOLFSSL_OPTIONS="/mnt/c/workspace/gojimmypi.github.io/_debug/options.h"
WOLFSSL_YES="/mnt/c/workspace/gojimmypi.github.io/_debug/Enabled-Features.txt"
WOLFSSL_NO="/mnt/c/workspace/gojimmypi.github.io/_debug/Disabled-Features.txt"

echo "CMD File= $WOLFSSL_CMD_FILE"
echo ""

WOLFSSL_CMD="$(cat $WOLFSSL_CMD_FILE)"
echo "CMD = $WOLFSSL_CMD"
echo ""

# Execute the command:
bash -c $WOLFSSL_CMD
$(echo $WOLFSSL_CMD)  | tee "$WOLFSSL_OUTPUT"

# save the generated options.h
mv wolfssl/options.h "$WOLFSSL_OPTIONS"

# pull out the enabled and disabled features into separate files
grep  "\*" "$WOLFSSL_OUTPUT" | grep yes > "$WOLFSSL_YES"
grep  "\*" "$WOLFSSL_OUTPUT" | grep no > "$WOLFSSL_NO"
