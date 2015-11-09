#!/bin/bash

# See following link for more info:
# http://manageiq.org/documentation/development/rest_api/models/providers/

export CFME_IP="192.168.252.16"
export RHEV_IP="192.168.252.13"
export RHEV_ADMIN_NAME="admin@internal"
export RHEV_ADMIN_PASS="dog8code"
export DATE=`date +"%s"`



DATA="$(cat <<-EOF
{
        "action": "create",
        "resources" : [
        {
                "name"     : "RHEV_${DATE}",
                "type"     : "ManageIQ::Providers::Redhat::InfraManager",
                "hostname" : "${RHEV_IP}",
                "port"     : "443",
                "zone_id"  : "1000000000001",
                "credentials" :  {
                        "userid" : "${RHEV_ADMIN_NAME}",
                        "password" : "${RHEV_ADMIN_PASS}"
                }

        }
        ]
}
EOF
)"

echo "Sending request with data of:"
echo "${DATA}"
echo

curl -k --user admin:smartvm -i -X POST -d "${DATA}" -H "Accept: application/json" https://${CFME_IP}/api/providers
