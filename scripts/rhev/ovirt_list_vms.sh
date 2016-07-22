USER="admin@internal"
PASS="dog8code"

# For 3.6 URL is just IP/api
# For 4.0 URL is IP/ovirt/api/v3
URL="https://192.168.155.11/api"

curl -k --user ${USER}:${PASS} -i -X GET -H "Accept: application/xml; detail=disks; detail=nics; detail=hosts;" ${URL}/vms


