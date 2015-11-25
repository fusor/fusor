#!/bin/bash

# Mounts an NFS share with a predefined configuration (readonly, target, etc)
# that attempts to prevent things like whitespace.
#
# Usage:
#  safe-mount.sh 123 www.example.com /nfs_share


regex='[[:space:]]+'

if ! [[ "$1" =~ ^[0-9]+$ ]]; then
  echo "Bad deployment id."
  exit 1
fi

mount="/tmp/fusor-test-mount-$1"

if [[ "$2" =~ $regex ]]; then
  echo "Bad hostname format."
  exit 1
fi

if [[ "$3" =~ $regex ]]; then
  echo "Bad NFS share format."
  exit 1
fi

mkdir -p "$mount"
safe-umount.sh $1 2> /dev/null # attempt to unmount any existing mount
mount -r -t nfs --target "$mount" --source "$2:$3"

if [[ $? -ne 0 ]]; then
  echo "Failed to mount NFS share"
  exit 1
else
  echo $mount
fi
