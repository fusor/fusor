#!/bin/sh

POOL_ID=$1
MANIFEST=$2

# subscribe to given pool
subscription-manager subscribe --pool=$POOL_ID

# enable appropriate repos
subscription-manager repos --disable "*"
subscription-manager repos --enable rhel-6-server-rpms --enable rhel-server-rhscl-6-rpms --enable rhel-6-server-satellite-6.0-rpms

# install qpid and katello-utils
yum install -y python-qpid-qmf python-qpid  qpid-cpp-server-store katello-utils

# generate 32-character oauth secret
SECRET=`tr -dc "[:alnum:]" < /dev/urandom | head -c 32`

# setup oauth in /etc/pulp/server.conf

# disable auto in qpid
# change auth=yes to auth=no

# setup katello disconnected
katello-disconnected setup --oauth-key=katello --oauth-secret=$SECRET

# configure pulp
sudo service qpidd start
sudo chkconfig qpidd on
sudo service mongod start
sleep 10
sudo chkconfig mongod on
sudo -u apache pulp-manage-db
sudo service httpd restart
sudo chkconfig pulp_workers on
sudo service pulp_workers start
sudo chkconfig pulp_celerybeat on
sudo service pulp_celerybeat start
sudo chkconfig pulp_resource_manager on
sudo service pulp_resource_manager start

# import manifest

katello-disconnected import -m $MANIFEST
