#!/bin/bash

# Unmounts an NFS share with at predefined target
# that attempts to prevent things like unmounting other FSes
#
# Usage:
#  safe-umount.sh 123


if ! [[ "$1" =~ ^[0-9]+$ ]]; then
  echo "Bad deployment id."
  exit 1
fi

mount="/tmp/fusor-test-mount-$1"

umount $mount 2> /dev/null
