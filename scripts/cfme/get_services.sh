export CFME_IP="192.168.252.16"

curl -k --user admin:smartvm -i -X GET -H "Accept: application/json" https://${CFME_IP}/api/services
