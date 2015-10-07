#!/bin/sh

# disable repos
katello-disconnected disable --all

# enable the appropriate repos to sync
# katello-disconnected enable -r rhel-6-server-sam-rpms-6_4-x86_64

# create the repos and push them to Pulp to allow sync
katello-disconnected configure

# sync the repos
katello-disconnected sync

echo "To monitor the sync please run:\n\nkatello-disconnected watch"
