#!/bin/sh

# disable repos
katello-disconnected disable --all

# enable the appropriate repos to sync
# katello-disconnected enable -r rhel-6-server-sam-rpms-6_4-x86_64

# cloudforms
katello-disconnected enable -r cf-me-5_4-for-rhel-6-files--x86_64
#katello-disconnected enable -r rhel-7-server-kickstart-7_1-x86_64

# rhev-m
katello-disconnected enable -r rhel-6-server-rpms-6_7-x86_64
katello-disconnected enable -r rhel-6-server-kickstart-6_7-x86_64
katello-disconnected enable -r rhel-6-server-satellite-tools-6_1-rpms--x86_64
katello-disconnected enable -r rhel-6-server-supplementary-rpms-6_7-x86_64
katello-disconnected enable -r rhel-6-server-rhevm-3_5-rpms-6_7-x86_64
katello-disconnected enable -r jb-eap-6-for-rhel-6-server-rpms-6_7-x86_64

# rhev-h (plus rhev-m)
katello-disconnected enable -r rhel-6-server-rhev-mgmt-agent-rpms-6_7-x86_64

# openstack
katello-disconnected enable -r rhel-7-server-rpms-7Server-x86_64
katello-disconnected enable -r rhel-7-server-kickstart-7_1-x86_64
katello-disconnected enable -r rhel-7-server-extras-rpms--x86_64
katello-disconnected enable -r rhel-7-server-optional-rpms-7Server-x86_64
katello-disconnected enable -r rhel-7-server-rh-common-rpms-7Server-x86_64
katello-disconnected enable -r rhel-7-server-openstack-7_0-rpms-7Server-x86_64
katello-disconnected enable -r rhel-7-server-openstack-7_0-director-rpms-7Server-x86_64
katello-disconnected enable -r rhel-7-server-openstack-7_0-files-7Server-x86_64
katello-disconnected enable -r rhel-server-rhscl-7-rpms-7Server-x86_64

# create the repos and push them to Pulp to allow sync
katello-disconnected configure

# sync the repos
katello-disconnected sync

echo "To monitor the sync please run:\n\nkatello-disconnected watch"
