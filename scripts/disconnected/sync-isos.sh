#!/bin/sh

if [ $# -eq 0 ]
  then
    echo "Please supply the location of your ISOs."
    exit
fi

ISO_DIR=$1
SAT_IMPORT_DIR=/var/www/html/pub/sat-import/
ISOS=`find $ISO_DIR -name '*.iso'`

mkdir -p $SAT_IMPORT_DIR

i=0
for iso in $ISOS ; do 
  mkdir -p /tmp/iso$i
  mount -o ro,loop $iso /tmp/iso$i
  cp -ruv /tmp/iso$i/* $SAT_IMPORT_DIR
  umount /tmp/iso$i
  i=i+1
done

restorecon -rv $SAT_IMPORT_DIR
