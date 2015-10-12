#!/bin/sh

EXPORT_DIR="$1"

if [ "$EXPORT_DIR" == "" ]; then
    EXPORT_DIR="/var/tmp/export"
fi

# create export dir
mkdir -p $EXPORT_DIR

# export the content
katello-disconnected export -t $EXPORT_DIR
