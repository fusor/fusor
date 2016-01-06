#!/bin/sh

# disable repos
katello-disconnected disable --all

# enable the appropriate repos to sync
# katello-disconnected enable -r rhel-6-server-sam-rpms-6_4-x86_64
katello-disconnected enable -r cf-me-5_4-for-rhel-6-files--x86_64
katello-disconnected enable -r cf-me-5_5-for-rhel-6-files--x86_64
katello-disconnected enable -r jb-eap-6-for-rhel-6-server-rpms-6_7-x86_64
katello-disconnected enable -r rhel-6-server-kickstart-6_7-x86_64
katello-disconnected enable -r rhel-6-server-rhevm-3_5-rpms-6_7-x86_64
katello-disconnected enable -r rhel-6-server-rhev-mgmt-agent-rpms-6_7-x86_64
katello-disconnected enable -r rhel-6-server-rpms-6_7-x86_64
katello-disconnected enable -r rhel-6-server-satellite-tools-6_1-rpms--x86_64
katello-disconnected enable -r rhel-6-server-supplementary-rpms-6_7-x86_64


# create the repos and push them to Pulp to allow sync
katello-disconnected configure

# sync the repos
katello-disconnected sync

echo "To monitor the sync please run:\n\nkatello-disconnected watch"
