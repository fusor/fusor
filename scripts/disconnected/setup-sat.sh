#!/bin/sh

# create the sat-import dir
mkdir -p /var/www/html/pub/sat-import/
rsync -avz /var/isos/content/ /var/www/html/pub/sat-import/content/
restorecon -rv /var/www/html/pub/sat-import/
