module.exports = function(app) {
  var express = require('express');
  var deploymentPlanRouter = express.Router();

  deploymentPlanRouter.get('/', function(req, res) {
    res.send({
      'deployment-plan': []
    });
  });

  deploymentPlanRouter.post('/', function(req, res) {
    res.status(201).end();
  });

  deploymentPlanRouter.get('/:id/deployment_plans/overcloud', function(req, res) {
    res.send({
    "deployment_plan": {
        "created_at": "2015-10-21T13:52:42",
        "description": null,
        "name": "overcloud",
        "parameters": [
            {
                "constraints": [],
                "default": "",
                "description": "If set, the contents of an SSL certificate .key file for encrypting SSL endpoints.",
                "hidden": true,
                "label": null,
                "name": "Controller-1::SSLKey",
                "parameter_type": "string",
                "value": ""
            },
            {
                "constraints": [],
                "default": false,
                "description": "Rabbit client subscriber parameter to specify an SSL connection to the RabbitMQ host.\n",
                "hidden": null,
                "label": null,
                "name": "Compute-1::RabbitClientUseSSL",
                "parameter_type": "string",
                "value": false
            },
            {
                "constraints": [],
                "default": "",
                "description": "Keystone certificate for verifying token validity.",
                "hidden": null,
                "label": null,
                "name": "Controller-1::KeystoneSSLCertificate",
                "parameter_type": "string",
                "value": ""
            },
            {
                "constraints": [],
                "default": 3,
                "description": "The number of neutron dhcp agents to schedule per network",
                "hidden": null,
                "label": null,
                "name": "Controller-1::NeutronDhcpAgentsPerNetwork",
                "parameter_type": "number",
                "value": 3
            },
            {
                "constraints": [],
                "default": {},
                "description": "Contains parameters to configure Cinder backends. Typically set via parameter_defaults in the resource registry.",
                "hidden": null,
                "label": null,
                "name": "Controller-1::CinderBackendConfig",
                "parameter_type": "json",
                "value": {}
            },
            {
                "constraints": [],
                "default": 5000,
                "description": "The size of the loopback file used by the cinder LVM driver.",
                "hidden": null,
                "label": null,
                "name": "Controller-1::CinderLVMLoopDeviceSize",
                "parameter_type": "number",
                "value": 5000
            },
            {
                "constraints": [],
                "default": "1:1000",
                "description": "Comma-separated list of <tun_min>:<tun_max> tuples enumerating ranges\nof GRE tunnel IDs that are available for tenant network allocation\n",
                "hidden": null,
                "label": null,
                "name": "Controller-1::NeutronTunnelIdRanges",
                "parameter_type": "comma_delimited_list",
                "value": "1:1000"
            },
            {
                "constraints": [],
                "default": "unset",
                "description": "The password for the keystone admin account, used for monitoring, querying neutron etc.",
                "hidden": true,
                "label": null,
                "name": "Compute-1::AdminPassword",
                "parameter_type": "string",
                "value": "179e6e4d6167b380bd8ec5009f81b00132f91bbe"
            },
            {
                "constraints": [],
                "default": true,
                "description": "Whether to enable or not the Iscsi backend for Cinder",
                "hidden": null,
                "label": null,
                "name": "Cinder-Storage-1::CinderEnableIscsiBackend",
                "parameter_type": "boolean",
                "value": true
            },
            {
                "constraints": [],
                "default": [],
                "description": null,
                "hidden": null,
                "label": null,
                "name": "Controller-1::removal_policies",
                "parameter_type": "json",
                "value": []
            },
            {
                "constraints": [],
                "default": "unset",
                "description": "The password for the nova service and db account, used by nova-api.",
                "hidden": true,
                "label": null,
                "name": "Controller-1::NovaPassword",
                "parameter_type": "string",
                "value": "206899979d82609ad134f36c21f62b3fd6f823b6"
            },
            {
                "constraints": [],
                "default": "unset",
                "description": "Shared secret to prevent spoofing",
                "hidden": null,
                "label": null,
                "name": "Compute-1::NeutronMetadataProxySharedSecret",
                "parameter_type": "string",
                "value": "unset"
            },
            {
                "constraints": [
                    {
                        "constraint_type": "range",
                        "definition": {
                            "min": "0"
                        },
                        "description": null
                    }
                ],
                "default": null,
                "description": null,
                "hidden": null,
                "label": null,
                "name": "Controller-1::count",
                "parameter_type": "number",
                "value": "1"
            },
            {
                "constraints": [],
                "default": "9292",
                "description": "Glance port.",
                "hidden": null,
                "label": null,
                "name": "Compute-1::GlancePort",
                "parameter_type": "string",
                "value": "9292"
            },
            {
                "constraints": [],
                "default": "",
                "description": "VLAN tag for creating a public VLAN. The tag will be used to create an access port on the exterior bridge for each control plane node, and that port will be given the IP address returned by neutron from the public network. Set CONTROLEXTRA=overcloud-vlan-port.yaml when compiling overcloud.yaml to include the deployment of VLAN ports to the control plane.\n",
                "hidden": null,
                "label": null,
                "name": "NeutronPublicInterfaceTag",
                "parameter_type": "string",
                "value": ""
            },
            {
                "constraints": [],
                "default": "%stackname%-controller-%index%",
                "description": "Format for Controller node hostnames",
                "hidden": null,
                "label": null,
                "name": "ControllerHostnameFormat",
                "parameter_type": "string",
                "value": "%stackname%-controller-%index%"
            },
            {
                "constraints": [],
                "default": "ro_snmp_user",
                "description": "The user name for SNMPd with readonly rights running on all Overcloud nodes",
                "hidden": null,
                "label": null,
                "name": "Controller-1::SnmpdReadonlyUserName",
                "parameter_type": "string",
                "value": "ro_snmp_user"
            },
            {
                "constraints": [],
                "default": "openvswitch",
                "description": "The mechanism drivers for the Neutron tenant network. To specify multiple\nvalues, use a comma separated string, like so: 'openvswitch,l2_population'\n",
                "hidden": null,
                "label": null,
                "name": "Compute-1::NeutronMechanismDrivers",
                "parameter_type": "string",
                "value": "openvswitch"
            },
            {
                "constraints": [],
                "default": "",
                "description": null,
                "hidden": null,
                "label": null,
                "name": "Ceph-Storage-1::NtpServer",
                "parameter_type": "string",
                "value": ""
            },
            {
                "constraints": [],
                "default": "false",
                "description": "Set to true to enable package installation via Puppet",
                "hidden": null,
                "label": null,
                "name": "Ceph-Storage-1::EnablePackageInstall",
                "parameter_type": "boolean",
                "value": "false"
            },
            {
                "constraints": [
                    {
                        "constraint_type": "range",
                        "definition": {
                            "min": "0"
                        },
                        "description": null
                    }
                ],
                "default": null,
                "description": null,
                "hidden": null,
                "label": null,
                "name": "Ceph-Storage-1::count",
                "parameter_type": "number",
                "value": "0"
            },
            {
                "constraints": [],
                "default": "default",
                "description": "Name of an existing EC2 KeyPair to enable SSH access to the instances",
                "hidden": null,
                "label": null,
                "name": "Cinder-Storage-1::KeyName",
                "parameter_type": "string",
                "value": "default"
            },
            {
                "constraints": [],
                "default": "REBUILD_PRESERVE_EPHEMERAL",
                "description": "What policy to use when reconstructing instances. REBUILD for rebuilds, REBUILD_PRESERVE_EPHEMERAL to preserve /mnt.",
                "hidden": null,
                "label": null,
                "name": "Controller-1::ImageUpdatePolicy",
                "parameter_type": "string",
                "value": "REBUILD_PRESERVE_EPHEMERAL"
            },
            {
                "constraints": [],
                "default": true,
                "description": "Whether to deploy a LoadBalancer on the Controller",
                "hidden": null,
                "label": null,
                "name": "Controller-1::EnableLoadBalancer",
                "parameter_type": "boolean",
                "value": true
            },
            {
                "constraints": [],
                "default": "1:1000",
                "description": "Comma-separated list of <tun_min>:<tun_max> tuples enumerating ranges\nof GRE tunnel IDs that are available for tenant network allocation\n",
                "hidden": null,
                "label": null,
                "name": "Compute-1::NeutronTunnelIdRanges",
                "parameter_type": "comma_delimited_list",
                "value": "1:1000"
            },
            {
                "constraints": [],
                "default": "",
                "description": "Setting to a previously unused value during stack-update will trigger package update on all nodes\n",
                "hidden": null,
                "label": null,
                "name": "Swift-Storage-1::UpdateIdentifier",
                "parameter_type": "string",
                "value": ""
            },
            {
                "constraints": [],
                "default": "",
                "description": null,
                "hidden": null,
                "label": null,
                "name": "Compute-1::NovaComputeLibvirtType",
                "parameter_type": "string",
                "value": "qemu"
            },
            {
                "constraints": [],
                "default": "unset",
                "description": "The password for the keystone admin account, used for monitoring, querying neutron etc.",
                "hidden": true,
                "label": null,
                "name": "Controller-1::AdminPassword",
                "parameter_type": "string",
                "value": "179e6e4d6167b380bd8ec5009f81b00132f91bbe"
            },
            {
                "constraints": [],
                "default": 1,
                "description": "The minimum time (in hours) before a partition in a ring can be moved following a rebalance.",
                "hidden": null,
                "label": null,
                "name": "Controller-1::SwiftMinPartHours",
                "parameter_type": "number",
                "value": 1
            },
            {
                "constraints": [],
                "default": {},
                "description": "Controller specific hiera configuration data to inject into the cluster.\n",
                "hidden": null,
                "label": null,
                "name": "Controller-1::ControllerExtraConfig",
                "parameter_type": "json",
                "value": {}
            },
            {
                "constraints": [],
                "default": 5672,
                "description": "Set rabbit subscriber port, change this if using SSL",
                "hidden": null,
                "label": null,
                "name": "Controller-1::RabbitClientPort",
                "parameter_type": "number",
                "value": 5672
            },
            {
                "constraints": [],
                "default": "",
                "description": "The Ceph client key. Can be created with ceph-authtool --gen-print-key. Currently only used for external Ceph deployments to create the openstack user keyring.",
                "hidden": null,
                "label": null,
                "name": "CephClientKey",
                "parameter_type": "string",
                "value": ""
            },
            {
                "constraints": [],
                "default": "",
                "description": null,
                "hidden": null,
                "label": null,
                "name": "Swift-Storage-1::NtpServer",
                "parameter_type": "string",
                "value": ""
            },
            {
                "constraints": [],
                "default": "default",
                "description": "Name of an existing EC2 KeyPair to enable SSH access to the instances",
                "hidden": null,
                "label": null,
                "name": "Swift-Storage-1::KeyName",
                "parameter_type": "string",
                "value": "default"
            },
            {
                "constraints": [],
                "default": {
                    "BlockStorageHostnameResolveNetwork": "internal_api",
                    "CeilometerApiNetwork": "internal_api",
                    "CephClusterNetwork": "storage_mgmt",
                    "CephPublicNetwork": "storage",
                    "CephStorageHostnameResolveNetwork": "storage",
                    "CinderApiNetwork": "internal_api",
                    "CinderIscsiNetwork": "storage",
                    "ComputeHostnameResolveNetwork": "internal_api",
                    "ControllerHostnameResolveNetwork": "internal_api",
                    "GlanceApiNetwork": "storage",
                    "GlanceRegistryNetwork": "internal_api",
                    "HeatApiNetwork": "internal_api",
                    "HorizonNetwork": "internal_api",
                    "KeystoneAdminApiNetwork": "ctlplane",
                    "KeystonePublicApiNetwork": "internal_api",
                    "MemcachedNetwork": "internal_api",
                    "MongoDbNetwork": "internal_api",
                    "MysqlNetwork": "internal_api",
                    "NeutronApiNetwork": "internal_api",
                    "NeutronTenantNetwork": "tenant",
                    "NovaApiNetwork": "internal_api",
                    "NovaMetadataNetwork": "internal_api",
                    "NovaVncProxyNetwork": "internal_api",
                    "ObjectStorageHostnameResolveNetwork": "internal_api",
                    "RabbitMqNetwork": "internal_api",
                    "RedisNetwork": "internal_api",
                    "SwiftMgmtNetwork": "storage_mgmt",
                    "SwiftProxyNetwork": "storage"
                },
                "description": "Mapping of service_name -> network name. Typically set via parameter_defaults in the resource registry.",
                "hidden": null,
                "label": null,
                "name": "Compute-1::ServiceNetMap",
                "parameter_type": "json",
                "value": {
                    "BlockStorageHostnameResolveNetwork": "internal_api",
                    "CeilometerApiNetwork": "internal_api",
                    "CephClusterNetwork": "storage_mgmt",
                    "CephPublicNetwork": "storage",
                    "CephStorageHostnameResolveNetwork": "storage",
                    "CinderApiNetwork": "internal_api",
                    "CinderIscsiNetwork": "storage",
                    "ComputeHostnameResolveNetwork": "internal_api",
                    "ControllerHostnameResolveNetwork": "internal_api",
                    "GlanceApiNetwork": "storage",
                    "GlanceRegistryNetwork": "internal_api",
                    "HeatApiNetwork": "internal_api",
                    "HorizonNetwork": "internal_api",
                    "KeystoneAdminApiNetwork": "ctlplane",
                    "KeystonePublicApiNetwork": "internal_api",
                    "MemcachedNetwork": "internal_api",
                    "MongoDbNetwork": "internal_api",
                    "MysqlNetwork": "internal_api",
                    "NeutronApiNetwork": "internal_api",
                    "NeutronTenantNetwork": "tenant",
                    "NovaApiNetwork": "internal_api",
                    "NovaMetadataNetwork": "internal_api",
                    "NovaVncProxyNetwork": "internal_api",
                    "ObjectStorageHostnameResolveNetwork": "internal_api",
                    "RabbitMqNetwork": "internal_api",
                    "RedisNetwork": "internal_api",
                    "SwiftMgmtNetwork": "storage_mgmt",
                    "SwiftProxyNetwork": "storage"
                }
            },
            {
                "constraints": [],
                "default": "True",
                "description": "Allow automatic l3-agent failover",
                "hidden": null,
                "label": null,
                "name": "Controller-1::NeutronAllowL3AgentFailover",
                "parameter_type": "string",
                "value": "True"
            },
            {
                "constraints": [],
                "default": "libvirt.LibvirtDriver",
                "description": null,
                "hidden": null,
                "label": null,
                "name": "Compute-1::NovaComputeDriver",
                "parameter_type": "string",
                "value": "libvirt.LibvirtDriver"
            },
            {
                "constraints": [
                    {
                        "constraint_type": "custom_constraint",
                        "definition": "nova.flavor",
                        "description": null
                    }
                ],
                "default": null,
                "description": "Flavor for block storage nodes to request when deploying.",
                "hidden": null,
                "label": null,
                "name": "Cinder-Storage-1::Flavor",
                "parameter_type": "string",
                "value": "baremetal"
            },
            {
                "constraints": [],
                "default": "1:1000",
                "description": "Comma-separated list of <vni_min>:<vni_max> tuples enumerating ranges\nof VXLAN VNI IDs that are available for tenant network allocation\n",
                "hidden": null,
                "label": null,
                "name": "Controller-1::NeutronVniRanges",
                "parameter_type": "comma_delimited_list",
                "value": "1:1000"
            },
            {
                "constraints": [],
                "default": "",
                "description": "Keystone key for signing tokens.",
                "hidden": true,
                "label": null,
                "name": "Controller-1::KeystoneSigningKey",
                "parameter_type": "string",
                "value": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDHkLoL76AZGS9d\nFKnXSKHiBuylH6+x6cBg5vW1LEMyGUE123hrw1VOR+Wkn7g9AgZFHi70rYZnYeyg\nBMGZOjDJrPAYwY0hzdjcTZPB6fysxob852a+Jb5T+4c/ZZKRuk9wAISNYe1Aoewi\nL93pugSm/WMipr9nG7i3+cMhIKVhugUv4dBeyRN/zkVpZ5Lerzy1ohtbHl9d/tZ2\n6Z443OtW3449sFCHorA9YdtIL2/V6VtQaih8obfAvuSVNpodXrmimridSeGLSXS3\nnALyRVXiZfLSSIjvDu7cwoFJziwhonfL2WJUzFwxR8CSs0n3R+pZoxmXUfQo/KPF\ny3/PwlppAgMBAAECggEAdd841FX7tPdYL11GF99RpoQ6gClgB/Ct7U5dcF4tbkjW\naG4yCUx9dVgn/n1MP9STSX3TdDeN/EAtmDJW+x8Qs/4ObkDcEExaO30iudVvpck4\n7+XpnIQEj+wv7TUcRjDKPLhBkpR1oshBBcxKAYQavVtKk6vzv33zM880/rsek8JV\npQnfdiVeWQpSdV0KOz32BEvW7HGt+IHQCtm2ohpw+/De7Micn6TlzFoa2wHM5CZT\n/4C00Ytqo2EElO/NGjtX1Ehb6Y4/qE00OCmttwixIfniq18Wx+UnsDzLUPLBBcLJ\nE0iG4iuUHc1HSa2sFvDhphd8fwSrR3Xe7ckLeLuuFQKBgQDp+pVi8ts0GH+5xnVg\nw+ia+EckBuQMtFwb96HIBUx9BbBnmg0D7PJhlwE+e1AJ3hwaGaAWDS/m5g2+kkXg\n6ZU1P7c9EC5ufmwWWsWTy348BIVphB/qwTfjMq2EvMElYt9B6Qdh0oLvzAWSiK50\n9egsVsGzrhCmlMZ+M4koZ0iVwwKBgQDaWP6Y2GrWTq42Wf8WiACahB3sK5WNfO/R\nXmS/XcwTuTwKm2nwJzUzmWi4HqTDnxFTdHz4ZYJ3oIClTQPZaosolLMp2WYe1mrH\n0XrOP4d40XT4j8kXm9Qm0Q1FhoXfxMnl1Gs6VsRrH4zWpjjhpW8bpQcyWXAcbv1y\ndHc6PNbQYwKBgFliDOd79xlzsnd5xSVuMdHhvuuYZk4kKHvWocsTmyC3p6gsRYSW\nZBG76hHAcdcTLpEZ8Pn7l60RfXar0l4VXZa1/H4rTFGRoiD4FDpdpp+u6nhgrQC1\nR3BXz8nBgdeSac94AgXwsWyB+C7+YAb2Wfd2PREzEdFRTHKxpVf1/NiZAoGAHpka\nFJE/Z4jfIP67oIyuiPi6uL3i11EKymxP8gFS9/CdWV8uGVllOzXkVuj0bfV8mBVa\n7fRLtDfpz0BbqbwkhCtScCrnBKtHi3jvnLeKZIP1wF9l7skHkej50yRm3lTVdj+u\nRx6hp+Fj+zCQCA8G4vjdaVDfRRzIp6Fqk96yu8ECgYEA3fOZeK8SAvTIQd5H2fJ+\nvgh9vhEnk8f8zMfjvaONkJcrhL/vb9TcIDCvkNH9bRJBelgjsK10ESN5iOXRS7BS\nNSwzwK3TaeED/xKID0bEV9SQBskKJCsFuUjaqa4cNGvjpYKW+mBYElEHyHl1/PJY\nDrpsKiHoBkR4CuCIHlm4/1Y=\n-----END PRIVATE KEY-----"
            },
            {
                "constraints": [],
                "default": "guest",
                "description": null,
                "hidden": null,
                "label": null,
                "name": "Cinder-Storage-1::RabbitUserName",
                "parameter_type": "string",
                "value": "guest"
            },
            {
                "constraints": [
                    {
                        "constraint_type": "range",
                        "definition": {
                            "min": "0"
                        },
                        "description": null
                    }
                ],
                "default": null,
                "description": null,
                "hidden": null,
                "label": null,
                "name": "Compute-1::count",
                "parameter_type": "number",
                "value": "1"
            },
            {
                "constraints": [],
                "default": "",
                "description": "If set, the contents of an SSL certificate authority file.",
                "hidden": null,
                "label": null,
                "name": "Controller-1::SSLCACertificate",
                "parameter_type": "string",
                "value": ""
            },
            {
                "constraints": [],
                "default": "false",
                "description": "Set to true to enable package installation via Puppet",
                "hidden": null,
                "label": null,
                "name": "Compute-1::EnablePackageInstall",
                "parameter_type": "boolean",
                "value": "false"
            },
            {
                "constraints": [],
                "default": "",
                "description": "Mount options for NFS mounts used by Cinder NFS backend. Effective when CinderEnableNfsBackend is true.\n",
                "hidden": null,
                "label": null,
                "name": "Controller-1::CinderNfsMountOptions",
                "parameter_type": "string",
                "value": ""
            },
            {
                "constraints": [],
                "default": "unset",
                "description": "The password for the Heat service and db account, used by the Heat services.",
                "hidden": true,
                "label": null,
                "name": "Controller-1::HeatPassword",
                "parameter_type": "string",
                "value": "816724863d42b9974185fae5a815f518fb96aa8c"
            },
            {
                "constraints": [
                    {
                        "constraint_type": "range",
                        "definition": {
                            "min": "0"
                        },
                        "description": null
                    }
                ],
                "default": null,
                "description": null,
                "hidden": null,
                "label": null,
                "name": "Swift-Storage-1::count",
                "parameter_type": "number",
                "value": "0"
            },
            {
                "constraints": [],
                "default": true,
                "description": "Whether to enable Swift Storage on the Controller",
                "hidden": null,
                "label": null,
                "name": "Controller-1::EnableSwiftStorage",
                "parameter_type": "boolean",
                "value": true
            },
            {
                "constraints": [],
                "default": 3,
                "description": "How many replicas to use in the swift rings.",
                "hidden": null,
                "label": null,
                "name": "Swift-Storage-1::Replicas",
                "parameter_type": "number",
                "value": 3
            },
            {
                "constraints": [],
                "default": "vxlan",
                "description": "The tenant network type for Neutron, either gre or vxlan.",
                "hidden": null,
                "label": null,
                "name": "Compute-1::NeutronNetworkType",
                "parameter_type": "string",
                "value": "gre"
            },
            {
                "constraints": [],
                "default": "unset",
                "description": "The password for the neutron service and db account, used by neutron agents.",
                "hidden": true,
                "label": null,
                "name": "Controller-1::NeutronPassword",
                "parameter_type": "string",
                "value": "5bde587ef0f70045bb98fa74ad36baf16dd7edd1"
            },
            {
                "constraints": [],
                "default": [],
                "description": null,
                "hidden": null,
                "label": null,
                "name": "Swift-Storage-1::removal_policies",
                "parameter_type": "json",
                "value": []
            },
            {
                "constraints": [],
                "default": "unset",
                "description": "The user password for SNMPd with readonly rights running on all Overcloud nodes",
                "hidden": true,
                "label": null,
                "name": "Cinder-Storage-1::SnmpdReadonlyUserPassword",
                "parameter_type": "string",
                "value": "c19d9ac749bedab0134a638fe6fed8887b985d70"
            },
            {
                "constraints": [],
                "default": "vxlan,vlan,flat,gre",
                "description": "Comma-seperated list of network type driver entrypoints to be loaded.\n",
                "hidden": null,
                "label": null,
                "name": "Compute-1::NeutronTypeDrivers",
                "parameter_type": "comma_delimited_list",
                "value": "vxlan,vlan,flat,gre"
            },
            {
                "constraints": [],
                "default": "unset",
                "description": "The password for the swift service account, used by the swift proxy services.",
                "hidden": true,
                "label": null,
                "name": "Controller-1::SwiftPassword",
                "parameter_type": "string",
                "value": "e54db56e7b513186c269ef3b80cab6f720a40ec7"
            },
            {
                "constraints": [],
                "default": "ml2",
                "description": "The core plugin for Neutron. The value should be the entrypoint to be loaded\nfrom neutron.core_plugins namespace.\n",
                "hidden": null,
                "label": null,
                "name": "Controller-1::NeutronCorePlugin",
                "parameter_type": "string",
                "value": "ml2"
            },
            {
                "constraints": [],
                "default": "",
                "description": "The filepath of the file to use for logging messages from Glance.",
                "hidden": null,
                "label": null,
                "name": "Controller-1::GlanceLogFile",
                "parameter_type": "string",
                "value": ""
            },
            {
                "constraints": [],
                "default": "1:1000",
                "description": "Comma-separated list of <vni_min>:<vni_max> tuples enumerating ranges\nof VXLAN VNI IDs that are available for tenant network allocation\n",
                "hidden": null,
                "label": null,
                "name": "Compute-1::NeutronVniRanges",
                "parameter_type": "comma_delimited_list",
                "value": "1:1000"
            },
            {
                "constraints": [],
                "default": "ro_snmp_user",
                "description": "The user name for SNMPd with readonly rights running on all Overcloud nodes",
                "hidden": null,
                "label": null,
                "name": "Compute-1::SnmpdReadonlyUserName",
                "parameter_type": "string",
                "value": "ro_snmp_user"
            },
            {
                "constraints": [],
                "default": "1:1000",
                "description": "Comma-separated list of <tun_min>:<tun_max> tuples enumerating ranges\nof GRE tunnel IDs that are available for tenant network allocation\n",
                "hidden": null,
                "label": null,
                "name": "NeutronTunnelIdRanges",
                "parameter_type": "comma_delimited_list",
                "value": "1:1000"
            },
            {
                "constraints": [],
                "default": {},
                "description": "Additional configuration to inject into the cluster. The JSON should have\nthe following structure:\n  {\"FILEKEY\":\n    {\"config\":\n      [{\"section\": \"SECTIONNAME\",\n        \"values\":\n          [{\"option\": \"OPTIONNAME\",\n            \"value\": \"VALUENAME\"\n           }\n          ]\n       }\n      ]\n    }\n  }\nFor instance:\n  {\"nova\":\n    {\"config\":\n      [{\"section\": \"default\",\n        \"values\":\n          [{\"option\": \"force_config_drive\",\n            \"value\": \"always\"\n           }\n          ]\n       },\n       {\"section\": \"cells\",\n        \"values\":\n          [{\"option\": \"driver\",\n            \"value\": \"nova.cells.rpc_driver.CellsRPCDriver\"\n           }\n          ]\n       }\n      ]\n    }\n  }\n",
                "hidden": null,
                "label": null,
                "name": "Compute-1::ExtraConfig",
                "parameter_type": "json",
                "value": {}
            },
            {
                "constraints": [],
                "default": false,
                "description": "Whether to make Glance file backend a mount managed by Pacemaker. Effective when GlanceBackend is 'file'.\n",
                "hidden": null,
                "label": null,
                "name": "Controller-1::GlanceFilePcmkManage",
                "parameter_type": "boolean",
                "value": false
            },
            {
                "constraints": [],
                "default": "unset",
                "description": "A random string to be used as a salt when hashing to determine mappings in the ring.",
                "hidden": true,
                "label": null,
                "name": "Controller-1::SwiftHashSuffix",
                "parameter_type": "string",
                "value": "bfd720c1f5fbb4094ec04335bb42deb409da05b2"
            },
            {
                "constraints": [],
                "default": "",
                "description": null,
                "hidden": null,
                "label": null,
                "name": "Controller-1::NtpServer",
                "parameter_type": "string",
                "value": ""
            },
            {
                "constraints": [],
                "default": 1,
                "description": "The minimum time (in hours) before a partition in a ring can be moved following a rebalance.",
                "hidden": null,
                "label": null,
                "name": "Swift-Storage-1::MinPartHours",
                "parameter_type": "number",
                "value": 1
            },
            {
                "constraints": [],
                "default": "unset",
                "description": "The password for the ceilometer service  and db account.",
                "hidden": true,
                "label": null,
                "name": "Controller-1::CeilometerPassword",
                "parameter_type": "string",
                "value": "4acad9f359b5b1619edf1492e3caeb85c10fe53f"
            },
            {
                "constraints": [],
                "default": "",
                "description": "The Ceph admin client key. Can be created with ceph-authtool --gen-print-key.",
                "hidden": null,
                "label": null,
                "name": "CephAdminKey",
                "parameter_type": "string",
                "value": ""
            },
            {
                "constraints": [],
                "default": 5000,
                "description": "The size of the loopback file used by the cinder LVM driver.",
                "hidden": null,
                "label": null,
                "name": "Cinder-Storage-1::CinderLVMLoopDeviceSize",
                "parameter_type": "number",
                "value": 5000
            },
            {
                "constraints": [],
                "default": "false",
                "description": "Set to true to enable package installation via Puppet",
                "hidden": null,
                "label": null,
                "name": "Controller-1::EnablePackageInstall",
                "parameter_type": "boolean",
                "value": "false"
            },
            {
                "constraints": [
                    {
                        "constraint_type": "range",
                        "definition": {
                            "min": "0"
                        },
                        "description": null
                    }
                ],
                "default": null,
                "description": null,
                "hidden": null,
                "label": null,
                "name": "Cinder-Storage-1::count",
                "parameter_type": "number",
                "value": "0"
            },
            {
                "constraints": [],
                "default": "datacentre:br-ex",
                "description": "The OVS logical->physical bridge mappings to use. See the Neutron documentation for details. Defaults to mapping br-ex - the external bridge on hosts - to a physical name 'datacentre' which can be used to create provider networks (and we use this for the default floating network) - if changing this either use different post-install network scripts or be sure to keep 'datacentre' as a mapping network name.\n",
                "hidden": null,
                "label": null,
                "name": "Controller-1::NeutronBridgeMappings",
                "parameter_type": "string",
                "value": "datacentre:br-ex"
            },
            {
                "constraints": [],
                "default": "br-ex",
                "description": "Specifies the interface where the public-facing virtual ip will be assigned. This should be int_public when a VLAN is being used.\n",
                "hidden": null,
                "label": null,
                "name": "Controller-1::PublicVirtualInterface",
                "parameter_type": "string",
                "value": "br-ex"
            },
            {
                "constraints": [
                    {
                        "constraint_type": "custom_constraint",
                        "definition": "nova.flavor",
                        "description": null
                    }
                ],
                "default": null,
                "description": "Flavor for the nova compute node",
                "hidden": null,
                "label": null,
                "name": "Compute-1::Flavor",
                "parameter_type": "string",
                "value": "baremetal"
            },
            {
                "constraints": [],
                "default": false,
                "description": "Rabbit client subscriber parameter to specify an SSL connection to the RabbitMQ host.\n",
                "hidden": null,
                "label": null,
                "name": "Controller-1::RabbitClientUseSSL",
                "parameter_type": "string",
                "value": false
            },
            {
                "constraints": [],
                "default": 3,
                "description": "How many replicas to use in the swift rings.",
                "hidden": null,
                "label": null,
                "name": "Controller-1::SwiftReplicas",
                "parameter_type": "number",
                "value": 3
            },
            {
                "constraints": [],
                "default": "%stackname%-compute-%index%",
                "description": "Format for Compute node hostnames",
                "hidden": null,
                "label": null,
                "name": "ComputeHostnameFormat",
                "parameter_type": "string",
                "value": "%stackname%-compute-%index%"
            },
            {
                "constraints": [],
                "default": "http",
                "description": "Protocol to use when connecting to glance, set to https for SSL.",
                "hidden": null,
                "label": null,
                "name": "Compute-1::GlanceProtocol",
                "parameter_type": "string",
                "value": "http"
            },
            {
                "constraints": [],
                "default": "nic1",
                "description": "A port to add to the NeutronPhysicalBridge.",
                "hidden": null,
                "label": null,
                "name": "Compute-1::NeutronPublicInterface",
                "parameter_type": "string",
                "value": "nic1"
            },
            {
                "constraints": [],
                "default": "vxlan",
                "description": "The tunnel types for the Neutron tenant network. To specify multiple\nvalues, use a comma separated string, like so: 'gre,vxlan'\n",
                "hidden": null,
                "label": null,
                "name": "Controller-1::NeutronTunnelTypes",
                "parameter_type": "string",
                "value": "gre"
            },
            {
                "constraints": [],
                "default": "vxlan",
                "description": "The tunnel types for the Neutron tenant network. To specify multiple\nvalues, use a comma separated string, like so: 'gre,vxlan'\n",
                "hidden": null,
                "label": null,
                "name": "Compute-1::NeutronTunnelTypes",
                "parameter_type": "string",
                "value": "gre"
            },
            {
                "constraints": [],
                "default": "unset",
                "description": "The user password for SNMPd with readonly rights running on all Overcloud nodes",
                "hidden": true,
                "label": null,
                "name": "Controller-1::SnmpdReadonlyUserPassword",
                "parameter_type": "string",
                "value": "c19d9ac749bedab0134a638fe6fed8887b985d70"
            },
            {
                "constraints": [],
                "default": "noop",
                "description": "Strategy to use for Glance notification queue",
                "hidden": null,
                "label": null,
                "name": "Controller-1::GlanceNotifierStrategy",
                "parameter_type": "string",
                "value": "noop"
            },
            {
                "constraints": [],
                "default": "",
                "description": null,
                "hidden": null,
                "label": null,
                "name": "Compute-1::NeutronPublicInterfaceRawDevice",
                "parameter_type": "string",
                "value": ""
            },
            {
                "constraints": [],
                "default": "",
                "description": "Set to True to enable debugging on all services.",
                "hidden": null,
                "label": null,
                "name": "Cinder-Storage-1::Debug",
                "parameter_type": "string",
                "value": ""
            },
            {
                "constraints": [],
                "default": "unset",
                "description": "The password for the cinder service and db account, used by cinder-api.",
                "hidden": true,
                "label": null,
                "name": "Controller-1::CinderPassword",
                "parameter_type": "string",
                "value": "64eeb57f624ba8367778fbd846b6242c320e9af5"
            },
            {
                "constraints": [],
                "default": "guest",
                "description": "The username for RabbitMQ",
                "hidden": null,
                "label": null,
                "name": "Controller-1::RabbitUserName",
                "parameter_type": "string",
                "value": "guest"
            },
            {
                "constraints": [],
                "default": false,
                "description": "Whether to enable or not the NFS backend for Cinder",
                "hidden": null,
                "label": null,
                "name": "Compute-1::CinderEnableNfsBackend",
                "parameter_type": "boolean",
                "value": false
            },
            {
                "constraints": [],
                "default": "ro_snmp_user",
                "description": "The user name for SNMPd with readonly rights running on all Overcloud nodes",
                "hidden": null,
                "label": null,
                "name": "Cinder-Storage-1::SnmpdReadonlyUserName",
                "parameter_type": "string",
                "value": "ro_snmp_user"
            },
            {
                "constraints": [],
                "default": {
                    "BlockStorageHostnameResolveNetwork": "internal_api",
                    "CeilometerApiNetwork": "internal_api",
                    "CephClusterNetwork": "storage_mgmt",
                    "CephPublicNetwork": "storage",
                    "CephStorageHostnameResolveNetwork": "storage",
                    "CinderApiNetwork": "internal_api",
                    "CinderIscsiNetwork": "storage",
                    "ComputeHostnameResolveNetwork": "internal_api",
                    "ControllerHostnameResolveNetwork": "internal_api",
                    "GlanceApiNetwork": "storage",
                    "GlanceRegistryNetwork": "internal_api",
                    "HeatApiNetwork": "internal_api",
                    "HorizonNetwork": "internal_api",
                    "KeystoneAdminApiNetwork": "ctlplane",
                    "KeystonePublicApiNetwork": "internal_api",
                    "MemcachedNetwork": "internal_api",
                    "MongoDbNetwork": "internal_api",
                    "MysqlNetwork": "internal_api",
                    "NeutronApiNetwork": "internal_api",
                    "NeutronTenantNetwork": "tenant",
                    "NovaApiNetwork": "internal_api",
                    "NovaMetadataNetwork": "internal_api",
                    "NovaVncProxyNetwork": "internal_api",
                    "ObjectStorageHostnameResolveNetwork": "internal_api",
                    "RabbitMqNetwork": "internal_api",
                    "RedisNetwork": "internal_api",
                    "SwiftMgmtNetwork": "storage_mgmt",
                    "SwiftProxyNetwork": "storage"
                },
                "description": "Mapping of service_name -> network name. Typically set via parameter_defaults in the resource registry.",
                "hidden": null,
                "label": null,
                "name": "Ceph-Storage-1::ServiceNetMap",
                "parameter_type": "json",
                "value": {
                    "BlockStorageHostnameResolveNetwork": "internal_api",
                    "CeilometerApiNetwork": "internal_api",
                    "CephClusterNetwork": "storage_mgmt",
                    "CephPublicNetwork": "storage",
                    "CephStorageHostnameResolveNetwork": "storage",
                    "CinderApiNetwork": "internal_api",
                    "CinderIscsiNetwork": "storage",
                    "ComputeHostnameResolveNetwork": "internal_api",
                    "ControllerHostnameResolveNetwork": "internal_api",
                    "GlanceApiNetwork": "storage",
                    "GlanceRegistryNetwork": "internal_api",
                    "HeatApiNetwork": "internal_api",
                    "HorizonNetwork": "internal_api",
                    "KeystoneAdminApiNetwork": "ctlplane",
                    "KeystonePublicApiNetwork": "internal_api",
                    "MemcachedNetwork": "internal_api",
                    "MongoDbNetwork": "internal_api",
                    "MysqlNetwork": "internal_api",
                    "NeutronApiNetwork": "internal_api",
                    "NeutronTenantNetwork": "tenant",
                    "NovaApiNetwork": "internal_api",
                    "NovaMetadataNetwork": "internal_api",
                    "NovaVncProxyNetwork": "internal_api",
                    "ObjectStorageHostnameResolveNetwork": "internal_api",
                    "RabbitMqNetwork": "internal_api",
                    "RedisNetwork": "internal_api",
                    "SwiftMgmtNetwork": "storage_mgmt",
                    "SwiftProxyNetwork": "storage"
                }
            },
            {
                "constraints": [],
                "default": "%stackname%-blockstorage-%index%",
                "description": "Format for BlockStorage node hostnames",
                "hidden": null,
                "label": null,
                "name": "BlockStorageHostnameFormat",
                "parameter_type": "string",
                "value": "%stackname%-blockstorage-%index%"
            },
            {
                "constraints": [],
                "default": "unset",
                "description": "Salt for the rabbit cookie, change this to force the randomly generated rabbit cookie to change.",
                "hidden": null,
                "label": null,
                "name": "RabbitCookieSalt",
                "parameter_type": "string",
                "value": "unset"
            },
            {
                "constraints": [],
                "default": "guest",
                "description": "The username for RabbitMQ",
                "hidden": null,
                "label": null,
                "name": "Compute-1::RabbitUserName",
                "parameter_type": "string",
                "value": "guest"
            },
            {
                "constraints": [
                    {
                        "constraint_type": "custom_constraint",
                        "definition": "glance.image",
                        "description": null
                    }
                ],
                "default": "overcloud-ceph-storage",
                "description": null,
                "hidden": null,
                "label": null,
                "name": "Ceph-Storage-1::Image",
                "parameter_type": "string",
                "value": "overcloud-full"
            },
            {
                "constraints": [],
                "default": "",
                "description": "The Ceph cluster FSID. Must be a UUID.",
                "hidden": null,
                "label": null,
                "name": "CephClusterFSID",
                "parameter_type": "string",
                "value": ""
            },
            {
                "constraints": [],
                "default": "",
                "description": "Keystone certificate for verifying token validity.",
                "hidden": null,
                "label": null,
                "name": "Controller-1::KeystoneSigningCertificate",
                "parameter_type": "string",
                "value": "-----BEGIN CERTIFICATE-----\nMIIDJDCCAgygAwIBAgIBAjANBgkqhkiG9w0BAQUFADBTMQswCQYDVQQGEwJYWDEO\nMAwGA1UECBMFVW5zZXQxDjAMBgNVBAcTBVVuc2V0MQ4wDAYDVQQKEwVVbnNldDEU\nMBIGA1UEAxMLS2V5c3RvbmUgQ0EwHhcNMTUxMDIxMTM1MzQzWhcNMjUxMDE4MTM1\nMzQzWjBYMQswCQYDVQQGEwJYWDEOMAwGA1UECBMFVW5zZXQxDjAMBgNVBAcTBVVu\nc2V0MQ4wDAYDVQQKEwVVbnNldDEZMBcGA1UEAxMQS2V5c3RvbmUgU2lnbmluZzCC\nASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAMeQugvvoBkZL10UqddIoeIG\n7KUfr7HpwGDm9bUsQzIZQTXbeGvDVU5H5aSfuD0CBkUeLvSthmdh7KAEwZk6MMms\n8BjBjSHN2NxNk8Hp/KzGhvznZr4lvlP7hz9lkpG6T3AAhI1h7UCh7CIv3em6BKb9\nYyKmv2cbuLf5wyEgpWG6BS/h0F7JE3/ORWlnkt6vPLWiG1seX13+1nbpnjjc61bf\njj2wUIeisD1h20gvb9XpW1BqKHyht8C+5JU2mh1euaKauJ1J4YtJdLecAvJFVeJl\n8tJIiO8O7tzCgUnOLCGid8vZYlTMXDFHwJKzSfdH6lmjGZdR9Cj8o8XLf8/CWmkC\nAwEAATANBgkqhkiG9w0BAQUFAAOCAQEA1vX4j6PfQf5uwoqc4PNZBeb2izqtuK/J\nOqxvzr6fv3cS6TyWGsxC7o1W4UCRCZd/edfU/BpePkTOSHiteDbHTP9NJcCAzRgP\nGvdptsAQFkddVoUl4bCsabHuHybJ9G+gFYnMkYHxhO+7bsIv1teXfrIGXd+s1g8T\nX6SoG1xRp29NB0hQJKdLGg+DbwgQ93FpUrIIax3FEEw/t8Z2UzUkJpQGBBZubzu5\nurgv2ts1sLDsszIfknYqg9YB2we1uY2gYiObuA6KpYuD46csgxdxNL0Xb5vbUS65\niSGnCUD6p23UnHkZk2X5cVC42w6dy77ym3xmvA6MvPTSoQ4HWw0dhw==\n-----END CERTIFICATE-----"
            },
            {
                "constraints": [
                    {
                        "constraint_type": "custom_constraint",
                        "definition": "nova.keypair",
                        "description": null
                    }
                ],
                "default": "default",
                "description": "Name of an existing EC2 KeyPair to enable SSH access to the instances",
                "hidden": null,
                "label": null,
                "name": "Compute-1::KeyName",
                "parameter_type": "string",
                "value": "default"
            },
            {
                "constraints": [],
                "default": 5672,
                "description": "Set rabbit subscriber port, change this if using SSL",
                "hidden": null,
                "label": null,
                "name": "Cinder-Storage-1::RabbitClientPort",
                "parameter_type": "number",
                "value": 5672
            },
            {
                "constraints": [],
                "default": "unset",
                "description": "The user password for SNMPd with readonly rights running on all Overcloud nodes",
                "hidden": true,
                "label": null,
                "name": "Compute-1::SnmpdReadonlyUserPassword",
                "parameter_type": "string",
                "value": "c19d9ac749bedab0134a638fe6fed8887b985d70"
            },
            {
                "constraints": [],
                "default": "http",
                "description": "Protocol to use when connecting to glance, set to https for SSL.",
                "hidden": null,
                "label": null,
                "name": "Controller-1::GlanceProtocol",
                "parameter_type": "string",
                "value": "http"
            },
            {
                "constraints": [],
                "default": "datacentre",
                "description": "The Neutron ML2 and OpenVSwitch vlan mapping range to support. See the Neutron documentation for permitted values. Defaults to permitting any VLAN on the 'datacentre' physical network (See NeutronBridgeMappings).\n",
                "hidden": null,
                "label": null,
                "name": "Compute-1::NeutronNetworkVLANRanges",
                "parameter_type": "comma_delimited_list",
                "value": "datacentre"
            },
            {
                "constraints": [],
                "default": "dvr_snat",
                "description": "Agent mode for the neutron-l3-agent on the controller hosts",
                "hidden": null,
                "label": null,
                "name": "Controller-1::NeutronAgentMode",
                "parameter_type": "string",
                "value": "dvr_snat"
            },
            {
                "constraints": [],
                "default": "datacentre",
                "description": "If set, flat networks to configure in neutron plugins.\n",
                "hidden": null,
                "label": null,
                "name": "Compute-1::NeutronFlatNetworks",
                "parameter_type": "string",
                "value": "datacentre"
            },
            {
                "constraints": [],
                "default": "false",
                "description": "Set to true to enable package installation via Puppet",
                "hidden": null,
                "label": null,
                "name": "Cinder-Storage-1::EnablePackageInstall",
                "parameter_type": "boolean",
                "value": "false"
            },
            {
                "constraints": [],
                "default": "REBUILD_PRESERVE_EPHEMERAL",
                "description": "What policy to use when reconstructing instances. REBUILD for rebuilds, REBUILD_PRESERVE_EPHEMERAL to preserve /mnt.",
                "hidden": null,
                "label": null,
                "name": "Compute-1::ImageUpdatePolicy",
                "parameter_type": "string",
                "value": "REBUILD_PRESERVE_EPHEMERAL"
            },
            {
                "constraints": [],
                "default": "images",
                "description": "The name of the Ceph RBD pool to use/create for Glance images",
                "hidden": null,
                "label": null,
                "name": "GlanceRbdPoolName",
                "parameter_type": "string",
                "value": "images"
            },
            {
                "constraints": [],
                "default": "unset",
                "description": "Shared secret to prevent spoofing",
                "hidden": null,
                "label": null,
                "name": "Controller-1::NeutronMetadataProxySharedSecret",
                "parameter_type": "string",
                "value": "unset"
            },
            {
                "constraints": [],
                "default": {},
                "description": "A network mapped list of IPs to assign to Controllers in the following form: {\n  \"internal_api\": [\"a.b.c.d\", \"e.f.g.h\"],\n  ...\n}\n",
                "hidden": null,
                "label": null,
                "name": "Controller-1::ControllerIPs",
                "parameter_type": "json",
                "value": {}
            },
            {
                "constraints": [
                    {
                        "constraint_type": "custom_constraint",
                        "definition": "nova.flavor",
                        "description": null
                    }
                ],
                "default": null,
                "description": "Flavor for the Ceph Storage node.",
                "hidden": null,
                "label": null,
                "name": "Ceph-Storage-1::Flavor",
                "parameter_type": "string",
                "value": "baremetal"
            },
            {
                "constraints": [],
                "default": {
                    "BlockStorageHostnameResolveNetwork": "internal_api",
                    "CeilometerApiNetwork": "internal_api",
                    "CephClusterNetwork": "storage_mgmt",
                    "CephPublicNetwork": "storage",
                    "CephStorageHostnameResolveNetwork": "storage",
                    "CinderApiNetwork": "internal_api",
                    "CinderIscsiNetwork": "storage",
                    "ComputeHostnameResolveNetwork": "internal_api",
                    "ControllerHostnameResolveNetwork": "internal_api",
                    "GlanceApiNetwork": "storage",
                    "GlanceRegistryNetwork": "internal_api",
                    "HeatApiNetwork": "internal_api",
                    "HorizonNetwork": "internal_api",
                    "KeystoneAdminApiNetwork": "ctlplane",
                    "KeystonePublicApiNetwork": "internal_api",
                    "MemcachedNetwork": "internal_api",
                    "MongoDbNetwork": "internal_api",
                    "MysqlNetwork": "internal_api",
                    "NeutronApiNetwork": "internal_api",
                    "NeutronTenantNetwork": "tenant",
                    "NovaApiNetwork": "internal_api",
                    "NovaMetadataNetwork": "internal_api",
                    "NovaVncProxyNetwork": "internal_api",
                    "ObjectStorageHostnameResolveNetwork": "internal_api",
                    "RabbitMqNetwork": "internal_api",
                    "RedisNetwork": "internal_api",
                    "SwiftMgmtNetwork": "storage_mgmt",
                    "SwiftProxyNetwork": "storage"
                },
                "description": "Mapping of service_name -> network name. Typically set via parameter_defaults in the resource registry.",
                "hidden": null,
                "label": null,
                "name": "Swift-Storage-1::ServiceNetMap",
                "parameter_type": "json",
                "value": {
                    "BlockStorageHostnameResolveNetwork": "internal_api",
                    "CeilometerApiNetwork": "internal_api",
                    "CephClusterNetwork": "storage_mgmt",
                    "CephPublicNetwork": "storage",
                    "CephStorageHostnameResolveNetwork": "storage",
                    "CinderApiNetwork": "internal_api",
                    "CinderIscsiNetwork": "storage",
                    "ComputeHostnameResolveNetwork": "internal_api",
                    "ControllerHostnameResolveNetwork": "internal_api",
                    "GlanceApiNetwork": "storage",
                    "GlanceRegistryNetwork": "internal_api",
                    "HeatApiNetwork": "internal_api",
                    "HorizonNetwork": "internal_api",
                    "KeystoneAdminApiNetwork": "ctlplane",
                    "KeystonePublicApiNetwork": "internal_api",
                    "MemcachedNetwork": "internal_api",
                    "MongoDbNetwork": "internal_api",
                    "MysqlNetwork": "internal_api",
                    "NeutronApiNetwork": "internal_api",
                    "NeutronTenantNetwork": "tenant",
                    "NovaApiNetwork": "internal_api",
                    "NovaMetadataNetwork": "internal_api",
                    "NovaVncProxyNetwork": "internal_api",
                    "ObjectStorageHostnameResolveNetwork": "internal_api",
                    "RabbitMqNetwork": "internal_api",
                    "RedisNetwork": "internal_api",
                    "SwiftMgmtNetwork": "storage_mgmt",
                    "SwiftProxyNetwork": "storage"
                }
            },
            {
                "constraints": [
                    {
                        "constraint_type": "allowed_values",
                        "definition": [
                            "basic",
                            "cadf"
                        ],
                        "description": null
                    }
                ],
                "default": "basic",
                "description": "The Keystone notification format",
                "hidden": null,
                "label": null,
                "name": "Controller-1::KeystoneNotificationFormat",
                "parameter_type": "string",
                "value": "basic"
            },
            {
                "constraints": [],
                "default": "",
                "description": null,
                "hidden": null,
                "label": null,
                "name": "Cinder-Storage-1::NtpServer",
                "parameter_type": "string",
                "value": ""
            },
            {
                "constraints": [],
                "default": [],
                "description": "Control the IP allocation for the PublicVirtualInterface port. E.g. [{'ip_address':'1.2.3.4'}]\n",
                "hidden": null,
                "label": null,
                "name": "PublicVirtualFixedIPs",
                "parameter_type": "json",
                "value": []
            },
            {
                "constraints": [],
                "default": {
                    "BlockStorageHostnameResolveNetwork": "internal_api",
                    "CeilometerApiNetwork": "internal_api",
                    "CephClusterNetwork": "storage_mgmt",
                    "CephPublicNetwork": "storage",
                    "CephStorageHostnameResolveNetwork": "storage",
                    "CinderApiNetwork": "internal_api",
                    "CinderIscsiNetwork": "storage",
                    "ComputeHostnameResolveNetwork": "internal_api",
                    "ControllerHostnameResolveNetwork": "internal_api",
                    "GlanceApiNetwork": "storage",
                    "GlanceRegistryNetwork": "internal_api",
                    "HeatApiNetwork": "internal_api",
                    "HorizonNetwork": "internal_api",
                    "KeystoneAdminApiNetwork": "ctlplane",
                    "KeystonePublicApiNetwork": "internal_api",
                    "MemcachedNetwork": "internal_api",
                    "MongoDbNetwork": "internal_api",
                    "MysqlNetwork": "internal_api",
                    "NeutronApiNetwork": "internal_api",
                    "NeutronTenantNetwork": "tenant",
                    "NovaApiNetwork": "internal_api",
                    "NovaMetadataNetwork": "internal_api",
                    "NovaVncProxyNetwork": "internal_api",
                    "ObjectStorageHostnameResolveNetwork": "internal_api",
                    "RabbitMqNetwork": "internal_api",
                    "RedisNetwork": "internal_api",
                    "SwiftMgmtNetwork": "storage_mgmt",
                    "SwiftProxyNetwork": "storage"
                },
                "description": "Mapping of service_name -> network name. Typically set via parameter_defaults in the resource registry.",
                "hidden": null,
                "label": null,
                "name": "ServiceNetMap",
                "parameter_type": "json",
                "value": {
                    "BlockStorageHostnameResolveNetwork": "internal_api",
                    "CeilometerApiNetwork": "internal_api",
                    "CephClusterNetwork": "storage_mgmt",
                    "CephPublicNetwork": "storage",
                    "CephStorageHostnameResolveNetwork": "storage",
                    "CinderApiNetwork": "internal_api",
                    "CinderIscsiNetwork": "storage",
                    "ComputeHostnameResolveNetwork": "internal_api",
                    "ControllerHostnameResolveNetwork": "internal_api",
                    "GlanceApiNetwork": "storage",
                    "GlanceRegistryNetwork": "internal_api",
                    "HeatApiNetwork": "internal_api",
                    "HorizonNetwork": "internal_api",
                    "KeystoneAdminApiNetwork": "ctlplane",
                    "KeystonePublicApiNetwork": "internal_api",
                    "MemcachedNetwork": "internal_api",
                    "MongoDbNetwork": "internal_api",
                    "MysqlNetwork": "internal_api",
                    "NeutronApiNetwork": "internal_api",
                    "NeutronTenantNetwork": "tenant",
                    "NovaApiNetwork": "internal_api",
                    "NovaMetadataNetwork": "internal_api",
                    "NovaVncProxyNetwork": "internal_api",
                    "ObjectStorageHostnameResolveNetwork": "internal_api",
                    "RabbitMqNetwork": "internal_api",
                    "RedisNetwork": "internal_api",
                    "SwiftMgmtNetwork": "storage_mgmt",
                    "SwiftProxyNetwork": "storage"
                }
            },
            {
                "constraints": [],
                "default": "True",
                "description": "Allow automatic l3-agent failover",
                "hidden": null,
                "label": null,
                "name": "Compute-1::NeutronAllowL3AgentFailover",
                "parameter_type": "string",
                "value": "True"
            },
            {
                "constraints": [],
                "default": "1:1000",
                "description": "Comma-separated list of <vni_min>:<vni_max> tuples enumerating ranges\nof VXLAN VNI IDs that are available for tenant network allocation\n",
                "hidden": null,
                "label": null,
                "name": "NeutronVniRanges",
                "parameter_type": "comma_delimited_list",
                "value": "1:1000"
            },
            {
                "constraints": [],
                "default": "",
                "description": "Set to True to enable debugging on all services.",
                "hidden": null,
                "label": null,
                "name": "Controller-1::Debug",
                "parameter_type": "string",
                "value": ""
            },
            {
                "constraints": [],
                "default": "openstack",
                "description": "The Ceph user to use with OpenStack clients.",
                "hidden": null,
                "label": null,
                "name": "CephClientUserName",
                "parameter_type": "string",
                "value": "openstack"
            },
            {
                "constraints": [],
                "default": "REBUILD_PRESERVE_EPHEMERAL",
                "description": "What policy to use when reconstructing instances. REBUILD for rebuilds, REBUILD_PRESERVE_EPHEMERAL to preserve /mnt.",
                "hidden": null,
                "label": null,
                "name": "Ceph-Storage-1::ImageUpdatePolicy",
                "parameter_type": "string",
                "value": "REBUILD_PRESERVE_EPHEMERAL"
            },
            {
                "constraints": [],
                "default": "",
                "description": "Setting to a previously unused value during stack-update will trigger package update on all nodes\n",
                "hidden": null,
                "label": null,
                "name": "Ceph-Storage-1::UpdateIdentifier",
                "parameter_type": "string",
                "value": ""
            },
            {
                "constraints": [],
                "default": "True",
                "description": null,
                "hidden": null,
                "label": null,
                "name": "Compute-1::NeutronEnableTunnelling",
                "parameter_type": "string",
                "value": "True"
            },
            {
                "constraints": [],
                "default": "volumes",
                "description": "The name of the Ceph RBD pool to use/create for Cinder volumes",
                "hidden": null,
                "label": null,
                "name": "CinderRbdPoolName",
                "parameter_type": "string",
                "value": "volumes"
            },
            {
                "constraints": [],
                "default": "",
                "description": "Setting to a previously unused value during stack-update will trigger package update on all nodes\n",
                "hidden": null,
                "label": null,
                "name": "Cinder-Storage-1::UpdateIdentifier",
                "parameter_type": "string",
                "value": ""
            },
            {
                "constraints": [],
                "default": "nfs",
                "description": "Filesystem type for Pacemaker mount used as Glance storage. Effective when GlanceFilePcmkManage is true.\n",
                "hidden": null,
                "label": null,
                "name": "Controller-1::GlanceFilePcmkFstype",
                "parameter_type": "string",
                "value": "nfs"
            },
            {
                "constraints": [],
                "default": [
                    "messaging"
                ],
                "description": "Comma-separated list of Oslo notification drivers used by Keystone",
                "hidden": null,
                "label": null,
                "name": "Controller-1::KeystoneNotificationDriver",
                "parameter_type": "comma_delimited_list",
                "value": [
                    "messaging"
                ]
            },
            {
                "constraints": [],
                "default": "mongodb",
                "description": "The ceilometer backend type.",
                "hidden": null,
                "label": null,
                "name": "Controller-1::CeilometerBackend",
                "parameter_type": "string",
                "value": "mongodb"
            },
            {
                "constraints": [],
                "default": "",
                "description": "List of externally managed Ceph Mon Host IPs. Only used for external Ceph deployments.",
                "hidden": null,
                "label": null,
                "name": "CephExternalMonHost",
                "parameter_type": "string",
                "value": ""
            },
            {
                "constraints": [],
                "default": {},
                "description": "Additional configuration to inject into the cluster. The JSON should have\nthe following structure:\n  {\"FILEKEY\":\n    {\"config\":\n      [{\"section\": \"SECTIONNAME\",\n        \"values\":\n          [{\"option\": \"OPTIONNAME\",\n            \"value\": \"VALUENAME\"\n           }\n          ]\n       }\n      ]\n    }\n  }\nFor instance:\n  {\"nova\":\n    {\"config\":\n      [{\"section\": \"default\",\n        \"values\":\n          [{\"option\": \"force_config_drive\",\n            \"value\": \"always\"\n           }\n          ]\n       },\n       {\"section\": \"cells\",\n        \"values\":\n          [{\"option\": \"driver\",\n            \"value\": \"nova.cells.rpc_driver.CellsRPCDriver\"\n           }\n          ]\n       }\n      ]\n    }\n  }\n",
                "hidden": null,
                "label": null,
                "name": "Cinder-Storage-1::ExtraConfig",
                "parameter_type": "json",
                "value": {}
            },
            {
                "constraints": [],
                "default": "",
                "description": "Keystone key for signing tokens.",
                "hidden": true,
                "label": null,
                "name": "Controller-1::KeystoneSSLCertificateKey",
                "parameter_type": "string",
                "value": ""
            },
            {
                "constraints": [
                    {
                        "constraint_type": "custom_constraint",
                        "definition": "nova.keypair",
                        "description": null
                    }
                ],
                "default": "default",
                "description": "Name of an existing EC2 KeyPair to enable SSH access to the instances",
                "hidden": null,
                "label": null,
                "name": "Ceph-Storage-1::KeyName",
                "parameter_type": "string",
                "value": "default"
            },
            {
                "constraints": [],
                "default": "dvr_snat",
                "description": "Agent mode for the neutron-l3-agent on the controller hosts",
                "hidden": null,
                "label": null,
                "name": "Compute-1::NeutronAgentMode",
                "parameter_type": "string",
                "value": "dvr_snat"
            },
            {
                "constraints": [],
                "default": "unset",
                "description": "The password for the ceilometer service account.",
                "hidden": true,
                "label": null,
                "name": "Compute-1::CeilometerPassword",
                "parameter_type": "string",
                "value": "4acad9f359b5b1619edf1492e3caeb85c10fe53f"
            },
            {
                "constraints": [],
                "default": "ml2",
                "description": "The core plugin for Neutron. The value should be the entrypoint to be loaded\nfrom neutron.core_plugins namespace.\n",
                "hidden": null,
                "label": null,
                "name": "Compute-1::NeutronCorePlugin",
                "parameter_type": "string",
                "value": "ml2"
            },
            {
                "constraints": [],
                "default": "",
                "description": "Mount options for Pacemaker mount used as Glance storage. Effective when GlanceFilePcmkManage is true.\n",
                "hidden": null,
                "label": null,
                "name": "Controller-1::GlanceFilePcmkOptions",
                "parameter_type": "string",
                "value": ""
            },
            {
                "constraints": [],
                "default": 10,
                "description": "Partition Power to use when building Swift rings",
                "hidden": null,
                "label": null,
                "name": "Swift-Storage-1::PartPower",
                "parameter_type": "number",
                "value": 10
            },
            {
                "constraints": [],
                "default": {
                    "BlockStorageHostnameResolveNetwork": "internal_api",
                    "CeilometerApiNetwork": "internal_api",
                    "CephClusterNetwork": "storage_mgmt",
                    "CephPublicNetwork": "storage",
                    "CephStorageHostnameResolveNetwork": "storage",
                    "CinderApiNetwork": "internal_api",
                    "CinderIscsiNetwork": "storage",
                    "ComputeHostnameResolveNetwork": "internal_api",
                    "ControllerHostnameResolveNetwork": "internal_api",
                    "GlanceApiNetwork": "storage",
                    "GlanceRegistryNetwork": "internal_api",
                    "HeatApiNetwork": "internal_api",
                    "HorizonNetwork": "internal_api",
                    "KeystoneAdminApiNetwork": "ctlplane",
                    "KeystonePublicApiNetwork": "internal_api",
                    "MemcachedNetwork": "internal_api",
                    "MongoDbNetwork": "internal_api",
                    "MysqlNetwork": "internal_api",
                    "NeutronApiNetwork": "internal_api",
                    "NeutronTenantNetwork": "tenant",
                    "NovaApiNetwork": "internal_api",
                    "NovaMetadataNetwork": "internal_api",
                    "NovaVncProxyNetwork": "internal_api",
                    "ObjectStorageHostnameResolveNetwork": "internal_api",
                    "RabbitMqNetwork": "internal_api",
                    "RedisNetwork": "internal_api",
                    "SwiftMgmtNetwork": "storage_mgmt",
                    "SwiftProxyNetwork": "storage"
                },
                "description": "Mapping of service_name -> network name. Typically set via parameter_defaults in the resource registry.",
                "hidden": null,
                "label": null,
                "name": "Controller-1::ServiceNetMap",
                "parameter_type": "json",
                "value": {
                    "BlockStorageHostnameResolveNetwork": "internal_api",
                    "CeilometerApiNetwork": "internal_api",
                    "CephClusterNetwork": "storage_mgmt",
                    "CephPublicNetwork": "storage",
                    "CephStorageHostnameResolveNetwork": "storage",
                    "CinderApiNetwork": "internal_api",
                    "CinderIscsiNetwork": "storage",
                    "ComputeHostnameResolveNetwork": "internal_api",
                    "ControllerHostnameResolveNetwork": "internal_api",
                    "GlanceApiNetwork": "storage",
                    "GlanceRegistryNetwork": "internal_api",
                    "HeatApiNetwork": "internal_api",
                    "HorizonNetwork": "internal_api",
                    "KeystoneAdminApiNetwork": "ctlplane",
                    "KeystonePublicApiNetwork": "internal_api",
                    "MemcachedNetwork": "internal_api",
                    "MongoDbNetwork": "internal_api",
                    "MysqlNetwork": "internal_api",
                    "NeutronApiNetwork": "internal_api",
                    "NeutronTenantNetwork": "tenant",
                    "NovaApiNetwork": "internal_api",
                    "NovaMetadataNetwork": "internal_api",
                    "NovaVncProxyNetwork": "internal_api",
                    "ObjectStorageHostnameResolveNetwork": "internal_api",
                    "RabbitMqNetwork": "internal_api",
                    "RedisNetwork": "internal_api",
                    "SwiftMgmtNetwork": "storage_mgmt",
                    "SwiftProxyNetwork": "storage"
                }
            },
            {
                "constraints": [],
                "default": "datacentre",
                "description": "If set, flat networks to configure in neutron plugins.",
                "hidden": null,
                "label": null,
                "name": "Controller-1::NeutronFlatNetworks",
                "parameter_type": "string",
                "value": "datacentre"
            },
            {
                "constraints": [],
                "default": true,
                "description": "Whether to enable or not the Iscsi backend for Cinder",
                "hidden": null,
                "label": null,
                "name": "Controller-1::CinderEnableIscsiBackend",
                "parameter_type": "boolean",
                "value": true
            },
            {
                "constraints": [],
                "default": "unset",
                "description": "Secret shared by the ceilometer services.",
                "hidden": true,
                "label": null,
                "name": "Compute-1::CeilometerMeteringSecret",
                "parameter_type": "string",
                "value": "31ca44623afc116aebc523dbbf0a8f0e70899e4c"
            },
            {
                "constraints": [],
                "default": [],
                "description": "Should be used for arbitrary ips.",
                "hidden": null,
                "label": null,
                "name": "ControlFixedIPs",
                "parameter_type": "json",
                "value": []
            },
            {
                "constraints": [],
                "default": "",
                "description": "A custom IP address to put onto the NeutronPublicInterface.",
                "hidden": null,
                "label": null,
                "name": "Controller-1::NeutronPublicInterfaceIP",
                "parameter_type": "string",
                "value": ""
            },
            {
                "constraints": [],
                "default": "unset",
                "description": "The keystone auth secret and db password.",
                "hidden": true,
                "label": null,
                "name": "Controller-1::AdminToken",
                "parameter_type": "string",
                "value": "45176d29df6e7af1243b7456d770d4cd380e43ea"
            },
            {
                "constraints": [
                    {
                        "constraint_type": "custom_constraint",
                        "definition": "nova.keypair",
                        "description": null
                    }
                ],
                "default": "default",
                "description": "Name of an existing EC2 KeyPair to enable SSH access to the instances",
                "hidden": null,
                "label": null,
                "name": "Controller-1::KeyName",
                "parameter_type": "string",
                "value": "default"
            },
            {
                "constraints": [],
                "default": "guest",
                "description": "The password for RabbitMQ",
                "hidden": true,
                "label": null,
                "name": "Controller-1::RabbitPassword",
                "parameter_type": "string",
                "value": "guest"
            },
            {
                "constraints": [],
                "default": "",
                "description": "A custom default route for the NeutronPublicInterface.",
                "hidden": null,
                "label": null,
                "name": "Controller-1::NeutronPublicInterfaceDefaultRoute",
                "parameter_type": "string",
                "value": ""
            },
            {
                "constraints": [],
                "default": "false",
                "description": "Value of mount_check in Swift account/container/object -server.conf",
                "hidden": null,
                "label": null,
                "name": "Swift-Storage-1::MountCheck",
                "parameter_type": "boolean",
                "value": "false"
            },
            {
                "constraints": [],
                "default": "router",
                "description": "Comma-seperated list of service plugin entrypoints to be loaded from the\nneutron.service_plugins namespace.\n",
                "hidden": null,
                "label": null,
                "name": "Controller-1::NeutronServicePlugins",
                "parameter_type": "comma_delimited_list",
                "value": "router"
            },
            {
                "constraints": [],
                "default": "",
                "description": null,
                "hidden": null,
                "label": null,
                "name": "Compute-1::NtpServer",
                "parameter_type": "string",
                "value": ""
            },
            {
                "constraints": [],
                "default": "",
                "description": "If set, the contents of an SSL certificate .crt file for encrypting SSL endpoints.",
                "hidden": true,
                "label": null,
                "name": "Controller-1::SSLCertificate",
                "parameter_type": "string",
                "value": ""
            },
            {
                "constraints": [],
                "default": [],
                "description": null,
                "hidden": null,
                "label": null,
                "name": "Compute-1::removal_policies",
                "parameter_type": "json",
                "value": []
            },
            {
                "constraints": [
                    {
                        "constraint_type": "allowed_values",
                        "definition": [
                            "swift",
                            "file",
                            "rbd"
                        ],
                        "description": null
                    }
                ],
                "default": "swift",
                "description": "The short name of the Glance backend to use. Should be one of swift, rbd, or file",
                "hidden": null,
                "label": null,
                "name": "Controller-1::GlanceBackend",
                "parameter_type": "string",
                "value": "swift"
            },
            {
                "constraints": [],
                "default": "vxlan",
                "description": "The tenant network type for Neutron, either gre or vxlan.",
                "hidden": null,
                "label": null,
                "name": "Controller-1::NeutronNetworkType",
                "parameter_type": "string",
                "value": "gre"
            },
            {
                "constraints": [
                    {
                        "constraint_type": "custom_constraint",
                        "definition": "glance.image",
                        "description": null
                    }
                ],
                "default": "overcloud-compute",
                "description": null,
                "hidden": null,
                "label": null,
                "name": "Compute-1::Image",
                "parameter_type": "string",
                "value": "overcloud-full"
            },
            {
                "constraints": [],
                "default": {
                    "BlockStorageHostnameResolveNetwork": "internal_api",
                    "CeilometerApiNetwork": "internal_api",
                    "CephClusterNetwork": "storage_mgmt",
                    "CephPublicNetwork": "storage",
                    "CephStorageHostnameResolveNetwork": "storage",
                    "CinderApiNetwork": "internal_api",
                    "CinderIscsiNetwork": "storage",
                    "ComputeHostnameResolveNetwork": "internal_api",
                    "ControllerHostnameResolveNetwork": "internal_api",
                    "GlanceApiNetwork": "storage",
                    "GlanceRegistryNetwork": "internal_api",
                    "HeatApiNetwork": "internal_api",
                    "HorizonNetwork": "internal_api",
                    "KeystoneAdminApiNetwork": "ctlplane",
                    "KeystonePublicApiNetwork": "internal_api",
                    "MemcachedNetwork": "internal_api",
                    "MongoDbNetwork": "internal_api",
                    "MysqlNetwork": "internal_api",
                    "NeutronApiNetwork": "internal_api",
                    "NeutronTenantNetwork": "tenant",
                    "NovaApiNetwork": "internal_api",
                    "NovaMetadataNetwork": "internal_api",
                    "NovaVncProxyNetwork": "internal_api",
                    "ObjectStorageHostnameResolveNetwork": "internal_api",
                    "RabbitMqNetwork": "internal_api",
                    "RedisNetwork": "internal_api",
                    "SwiftMgmtNetwork": "storage_mgmt",
                    "SwiftProxyNetwork": "storage"
                },
                "description": "Mapping of service_name -> network name. Typically set via parameter_defaults in the resource registry.",
                "hidden": null,
                "label": null,
                "name": "Cinder-Storage-1::ServiceNetMap",
                "parameter_type": "json",
                "value": {
                    "BlockStorageHostnameResolveNetwork": "internal_api",
                    "CeilometerApiNetwork": "internal_api",
                    "CephClusterNetwork": "storage_mgmt",
                    "CephPublicNetwork": "storage",
                    "CephStorageHostnameResolveNetwork": "storage",
                    "CinderApiNetwork": "internal_api",
                    "CinderIscsiNetwork": "storage",
                    "ComputeHostnameResolveNetwork": "internal_api",
                    "ControllerHostnameResolveNetwork": "internal_api",
                    "GlanceApiNetwork": "storage",
                    "GlanceRegistryNetwork": "internal_api",
                    "HeatApiNetwork": "internal_api",
                    "HorizonNetwork": "internal_api",
                    "KeystoneAdminApiNetwork": "ctlplane",
                    "KeystonePublicApiNetwork": "internal_api",
                    "MemcachedNetwork": "internal_api",
                    "MongoDbNetwork": "internal_api",
                    "MysqlNetwork": "internal_api",
                    "NeutronApiNetwork": "internal_api",
                    "NeutronTenantNetwork": "tenant",
                    "NovaApiNetwork": "internal_api",
                    "NovaMetadataNetwork": "internal_api",
                    "NovaVncProxyNetwork": "internal_api",
                    "ObjectStorageHostnameResolveNetwork": "internal_api",
                    "RabbitMqNetwork": "internal_api",
                    "RedisNetwork": "internal_api",
                    "SwiftMgmtNetwork": "storage_mgmt",
                    "SwiftProxyNetwork": "storage"
                }
            },
            {
                "constraints": [],
                "default": "",
                "description": "Setting to a previously unused value during stack-update will trigger package update on all nodes\n",
                "hidden": null,
                "label": null,
                "name": "Compute-1::UpdateIdentifier",
                "parameter_type": "string",
                "value": ""
            },
            {
                "constraints": [],
                "default": "False",
                "description": "Whether to configure Neutron Distributed Virtual Routers",
                "hidden": null,
                "label": null,
                "name": "Controller-1::NeutronDVR",
                "parameter_type": "string",
                "value": "False"
            },
            {
                "constraints": [],
                "default": "unset",
                "description": "The user password for SNMPd with readonly rights running on all Overcloud nodes",
                "hidden": true,
                "label": null,
                "name": "Swift-Storage-1::SnmpdReadonlyUserPassword",
                "parameter_type": "string",
                "value": "c19d9ac749bedab0134a638fe6fed8887b985d70"
            },
            {
                "constraints": [],
                "default": "9292",
                "description": "Glance port.",
                "hidden": null,
                "label": null,
                "name": "Controller-1::GlancePort",
                "parameter_type": "string",
                "value": "9292"
            },
            {
                "constraints": [],
                "default": "router",
                "description": "Comma-seperated list of service plugin entrypoints to be loaded from the\nneutron.service_plugins namespace.\n",
                "hidden": null,
                "label": null,
                "name": "Compute-1::NeutronServicePlugins",
                "parameter_type": "comma_delimited_list",
                "value": "router"
            },
            {
                "constraints": [
                    {
                        "constraint_type": "custom_constraint",
                        "definition": "nova.flavor",
                        "description": null
                    }
                ],
                "default": null,
                "description": "Flavor for control nodes to request when deploying.",
                "hidden": null,
                "label": null,
                "name": "Controller-1::Flavor",
                "parameter_type": "string",
                "value": "baremetal"
            },
            {
                "constraints": [],
                "default": "openvswitch",
                "description": "The mechanism drivers for the Neutron tenant network. To specify multiple\nvalues, use a comma separated string, like so: 'openvswitch,l2_population'\n",
                "hidden": null,
                "label": null,
                "name": "Controller-1::NeutronMechanismDrivers",
                "parameter_type": "string",
                "value": "openvswitch"
            },
            {
                "constraints": [],
                "default": "",
                "description": "The DNS name of this cloud. E.g. ci-overcloud.tripleo.org",
                "hidden": null,
                "label": null,
                "name": "Controller-1::CloudName",
                "parameter_type": "string",
                "value": "overcloud"
            },
            {
                "constraints": [],
                "default": "%stackname%-cephstorage-%index%",
                "description": "Format for CephStorage node hostnames",
                "hidden": null,
                "label": null,
                "name": "CephStorageHostnameFormat",
                "parameter_type": "string",
                "value": "%stackname%-cephstorage-%index%"
            },
            {
                "constraints": [],
                "default": false,
                "description": "If enabled services will be monitored by Pacemaker; it will manage VIPs as well, in place of Keepalived.",
                "hidden": null,
                "label": null,
                "name": "Controller-1::EnablePacemaker",
                "parameter_type": "boolean",
                "value": false
            },
            {
                "constraints": [],
                "default": "unset",
                "description": "Password for heat_stack_domain_admin user.",
                "hidden": true,
                "label": null,
                "name": "Controller-1::HeatStackDomainAdminPassword",
                "parameter_type": "string",
                "value": "unset"
            },
            {
                "constraints": [],
                "default": "br-ex",
                "description": "Name of bridge used for external network traffic.",
                "hidden": null,
                "label": null,
                "name": "Controller-1::NeutronExternalNetworkBridge",
                "parameter_type": "string",
                "value": "br-ex"
            },
            {
                "constraints": [],
                "default": 0,
                "description": "Specifies the size of the buffer pool in megabytes. Setting to zero should be interpreted as \"no value\" and will defer to the lower level default.\n",
                "hidden": null,
                "label": null,
                "name": "Controller-1::MysqlInnodbBufferPoolSize",
                "parameter_type": "number",
                "value": 0
            },
            {
                "constraints": [],
                "default": "tgtadm",
                "description": "The iSCSI helper to use with cinder.",
                "hidden": null,
                "label": null,
                "name": "Controller-1::CinderISCSIHelper",
                "parameter_type": "string",
                "value": "lioadm"
            },
            {
                "constraints": [],
                "default": "overcloud-swift-storage",
                "description": null,
                "hidden": null,
                "label": null,
                "name": "Swift-Storage-1::Image",
                "parameter_type": "string",
                "value": "overcloud-full"
            },
            {
                "constraints": [],
                "default": 5672,
                "description": "Set rabbit subscriber port, change this if using SSL",
                "hidden": null,
                "label": null,
                "name": "Compute-1::RabbitClientPort",
                "parameter_type": "number",
                "value": 5672
            },
            {
                "constraints": [],
                "default": "tgtadm",
                "description": "The iSCSI helper to use with cinder.",
                "hidden": null,
                "label": null,
                "name": "Cinder-Storage-1::CinderISCSIHelper",
                "parameter_type": "string",
                "value": "lioadm"
            },
            {
                "constraints": [],
                "default": "True",
                "description": null,
                "hidden": null,
                "label": null,
                "name": "Controller-1::NeutronEnableTunnelling",
                "parameter_type": "string",
                "value": "True"
            },
            {
                "constraints": [],
                "default": "br-ex",
                "description": "Interface where virtual ip will be assigned.",
                "hidden": null,
                "label": null,
                "name": "Controller-1::ControlVirtualInterface",
                "parameter_type": "string",
                "value": "br-ex"
            },
            {
                "constraints": [],
                "default": "false",
                "description": "Set to true to enable package installation via Puppet",
                "hidden": null,
                "label": null,
                "name": "Swift-Storage-1::EnablePackageInstall",
                "parameter_type": "boolean",
                "value": "false"
            },
            {
                "constraints": [],
                "default": false,
                "description": "Whether to enable or not the Rbd backend for Nova",
                "hidden": null,
                "label": null,
                "name": "Compute-1::NovaEnableRbdBackend",
                "parameter_type": "boolean",
                "value": false
            },
            {
                "constraints": [],
                "default": "False",
                "description": "Whether to enable l3-agent HA",
                "hidden": null,
                "label": null,
                "name": "Controller-1::NeutronL3HA",
                "parameter_type": "string",
                "value": "False"
            },
            {
                "constraints": [
                    {
                        "constraint_type": "custom_constraint",
                        "definition": "glance.image",
                        "description": null
                    }
                ],
                "default": "overcloud-control",
                "description": null,
                "hidden": null,
                "label": null,
                "name": "Controller-1::Image",
                "parameter_type": "string",
                "value": "overcloud-full"
            },
            {
                "constraints": [],
                "default": "unset",
                "description": "A random string to be used as a salt when hashing to determine mappings in the ring.",
                "hidden": true,
                "label": null,
                "name": "Swift-Storage-1::HashSuffix",
                "parameter_type": "string",
                "value": "unset"
            },
            {
                "constraints": [],
                "default": "",
                "description": "The Ceph monitors key. Can be created with ceph-authtool --gen-print-key.",
                "hidden": null,
                "label": null,
                "name": "CephMonKey",
                "parameter_type": "string",
                "value": ""
            },
            {
                "constraints": [],
                "default": "False",
                "description": null,
                "hidden": null,
                "label": null,
                "name": "Compute-1::NeutronDVR",
                "parameter_type": "string",
                "value": "False"
            },
            {
                "constraints": [],
                "default": "False",
                "description": "Whether to enable l3-agent HA",
                "hidden": null,
                "label": null,
                "name": "Compute-1::NeutronL3HA",
                "parameter_type": "string",
                "value": "False"
            },
            {
                "constraints": [],
                "default": "overcloud-cinder-volume",
                "description": null,
                "hidden": null,
                "label": null,
                "name": "Cinder-Storage-1::Image",
                "parameter_type": "string",
                "value": "overcloud-full"
            },
            {
                "constraints": [],
                "default": "datacentre",
                "description": "The Neutron ML2 and OpenVSwitch vlan mapping range to support. See the Neutron documentation for permitted values. Defaults to permitting any VLAN on the 'datacentre' physical network (See NeutronBridgeMappings).\n",
                "hidden": null,
                "label": null,
                "name": "Controller-1::NeutronNetworkVLANRanges",
                "parameter_type": "comma_delimited_list",
                "value": "datacentre"
            },
            {
                "constraints": [],
                "default": "",
                "description": "Keystone self-signed certificate authority certificate.",
                "hidden": null,
                "label": null,
                "name": "Controller-1::KeystoneCACertificate",
                "parameter_type": "string",
                "value": "-----BEGIN CERTIFICATE-----\nMIIDNzCCAh+gAwIBAgIBATANBgkqhkiG9w0BAQUFADBTMQswCQYDVQQGEwJYWDEO\nMAwGA1UECBMFVW5zZXQxDjAMBgNVBAcTBVVuc2V0MQ4wDAYDVQQKEwVVbnNldDEU\nMBIGA1UEAxMLS2V5c3RvbmUgQ0EwHhcNMTUxMDIxMTM1MzQzWhcNMjUxMDE4MTM1\nMzQzWjBTMQswCQYDVQQGEwJYWDEOMAwGA1UECBMFVW5zZXQxDjAMBgNVBAcTBVVu\nc2V0MQ4wDAYDVQQKEwVVbnNldDEUMBIGA1UEAxMLS2V5c3RvbmUgQ0EwggEiMA0G\nCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQDc3mKGOonnH0aMXMj2mYg1wMbOenL2\nQ6+1WDbwDpdLHcu27fw9JgkMzswU4EWKLwLj/QrD/c1IfyxeoPmDeRZSLiJBmZVN\noDSfQdlep8rw3kgTatJ2+a5HXL6xhzjx1GKGcAd0zMSBlzrK4JDwdjIxxc8FRpHd\nJq5uZpMalL743UJ94X2jyVBpx8mriKnt+icAvdYBQqzXB/NeTh6w3gW6RtZVTXfO\nnq4bHBKiBGC9KzGmCICFUTDKNJPx7c14YOI1zTeA0m6D2oVqunf7ine3cD22oV+c\nOvz+K42ztcPxp1twQjB8vpxwwUDxKPQLGLh+a3D6e1HVASAnjJS2G8h/AgMBAAGj\nFjAUMBIGA1UdEwEB/wQIMAYBAf8CAQAwDQYJKoZIhvcNAQEFBQADggEBAK5WA3KR\nfTbUlzVQT65D59ZjAEUAhmFDnYoOHFBM7n1wfT8CgtthqGv4c6fC3joLCP0AyS+V\npsMvIp0Oha9TYzcg0md6SPYpI6QdQvWPjuSQF1v+Gvxv8jcJ/86snCxxq5zhtzqc\nSWUbSX7IOQ8QcvYZAvjPvnoHC8usQR8US2pgJddyx54K/WQsLX6y68BZeYaZYL7M\nB+G+eQltyYfIyGTps/smFWAm1B0EUYtDdi0Pvs74sSQICoLo2bYkgsZXM4pmoGEd\nCzv2TbYe1iLhYRSWufyj3ytCFOzsmnY4iyx+pgYK23iMIdw2dUtl5vxcbgOYYXGD\nnPycT1PzrxX56B0=\n-----END CERTIFICATE-----"
            },
            {
                "constraints": [],
                "default": [],
                "description": null,
                "hidden": null,
                "label": null,
                "name": "Ceph-Storage-1::removal_policies",
                "parameter_type": "json",
                "value": []
            },
            {
                "constraints": [],
                "default": "",
                "description": "Neutron ID for ctlplane network.",
                "hidden": null,
                "label": null,
                "name": "NeutronControlPlaneID",
                "parameter_type": "string",
                "value": "7f079594-6944-48f0-be3c-ee7fa6592f7a"
            },
            {
                "constraints": [],
                "default": "",
                "description": "If set, the public interface is a vlan with this device as the raw device.",
                "hidden": null,
                "label": null,
                "name": "Controller-1::NeutronPublicInterfaceRawDevice",
                "parameter_type": "string",
                "value": ""
            },
            {
                "constraints": [],
                "default": "",
                "description": "An exported storage device that should be mounted by Pacemaker as Glance storage. Effective when GlanceFilePcmkManage is true.\n",
                "hidden": null,
                "label": null,
                "name": "Controller-1::GlanceFilePcmkDevice",
                "parameter_type": "string",
                "value": ""
            },
            {
                "constraints": [],
                "default": "unset",
                "description": "Secret shared by the ceilometer services.",
                "hidden": true,
                "label": null,
                "name": "Controller-1::CeilometerMeteringSecret",
                "parameter_type": "string",
                "value": "31ca44623afc116aebc523dbbf0a8f0e70899e4c"
            },
            {
                "constraints": [],
                "default": "guest",
                "description": null,
                "hidden": null,
                "label": null,
                "name": "Cinder-Storage-1::RabbitPassword",
                "parameter_type": "string",
                "value": "guest"
            },
            {
                "constraints": [],
                "default": false,
                "description": "Rabbit client subscriber parameter to specify an SSL connection to the RabbitMQ host.\n",
                "hidden": null,
                "label": null,
                "name": "Cinder-Storage-1::RabbitClientUseSSL",
                "parameter_type": "string",
                "value": false
            },
            {
                "constraints": [],
                "default": "unset",
                "description": "The password for the cinder service and db account, used by cinder-api.",
                "hidden": true,
                "label": null,
                "name": "Cinder-Storage-1::CinderPassword",
                "parameter_type": "string",
                "value": "unset"
            },
            {
                "constraints": [],
                "default": "",
                "description": "VLAN tag for creating a public VLAN. The tag will be used to create an access port on the exterior bridge for each control plane node, and that port will be given the IP address returned by neutron from the public network. Set CONTROLEXTRA=overcloud-vlan-port.yaml when compiling overcloud.yaml to include the deployment of VLAN ports to the control plane.\n",
                "hidden": null,
                "label": null,
                "name": "Controller-1::NeutronPublicInterfaceTag",
                "parameter_type": "string",
                "value": ""
            },
            {
                "constraints": [],
                "default": "ro_snmp_user",
                "description": "The user name for SNMPd with readonly rights running on all Overcloud nodes",
                "hidden": null,
                "label": null,
                "name": "Swift-Storage-1::SnmpdReadonlyUserName",
                "parameter_type": "string",
                "value": "ro_snmp_user"
            },
            {
                "constraints": [],
                "default": "nic1",
                "description": "What interface to bridge onto br-ex for network nodes.",
                "hidden": null,
                "label": null,
                "name": "Controller-1::NeutronPublicInterface",
                "parameter_type": "string",
                "value": "nic1"
            },
            {
                "constraints": [],
                "default": "",
                "description": "NFS servers used by Cinder NFS backend. Effective when CinderEnableNfsBackend is true.\n",
                "hidden": null,
                "label": null,
                "name": "Controller-1::CinderNfsServers",
                "parameter_type": "comma_delimited_list",
                "value": ""
            },
            {
                "constraints": [],
                "default": "9292",
                "description": "Glance port.",
                "hidden": null,
                "label": null,
                "name": "Cinder-Storage-1::GlancePort",
                "parameter_type": "string",
                "value": "9292"
            },
            {
                "constraints": [],
                "default": "unset",
                "description": "The password for the glance service and db account, used by the glance services.",
                "hidden": true,
                "label": null,
                "name": "Controller-1::GlancePassword",
                "parameter_type": "string",
                "value": "6b641065f1a8c98ca28b52d01527001a77cc5e6f"
            },
            {
                "constraints": [],
                "default": "",
                "description": "Set to True to enable debugging on all services.",
                "hidden": null,
                "label": null,
                "name": "Compute-1::Debug",
                "parameter_type": "string",
                "value": ""
            },
            {
                "constraints": [],
                "default": "dhcp-option-force=26,1400",
                "description": "Dnsmasq options for neutron-dhcp-agent. The default value here forces MTU to be set to 1400 to account for the gre tunnel overhead.",
                "hidden": null,
                "label": null,
                "name": "Controller-1::NeutronDnsmasqOptions",
                "parameter_type": "string",
                "value": "dhcp-option-force=26,1400"
            },
            {
                "constraints": [],
                "default": false,
                "description": "Whether to enable or not the NFS backend for Cinder",
                "hidden": null,
                "label": null,
                "name": "Controller-1::CinderEnableNfsBackend",
                "parameter_type": "boolean",
                "value": false
            },
            {
                "constraints": [],
                "default": "vxlan,vlan,flat,gre",
                "description": "Comma-seperated list of network type driver entrypoints to be loaded.\n",
                "hidden": null,
                "label": null,
                "name": "Controller-1::NeutronTypeDrivers",
                "parameter_type": "comma_delimited_list",
                "value": "vxlan,vlan,flat,gre"
            },
            {
                "constraints": [
                    {
                        "constraint_type": "allowed_values",
                        "definition": [
                            "",
                            "Present"
                        ],
                        "description": null
                    }
                ],
                "default": "",
                "description": "Indicates whether the Compute agent is present and expects nova-compute to be configured accordingly",
                "hidden": null,
                "label": null,
                "name": "Compute-1::CeilometerComputeAgent",
                "parameter_type": "string",
                "value": ""
            },
            {
                "constraints": [],
                "default": "datacentre:br-ex",
                "description": "The OVS logical->physical bridge mappings to use. See the Neutron documentation for details. Defaults to mapping br-ex - the external bridge on hosts - to a physical name 'datacentre' which can be used to create provider networks (and we use this for the default floating network) - if changing this either use different post-install network scripts or be sure to keep 'datacentre' as a mapping network name.\n",
                "hidden": null,
                "label": null,
                "name": "Compute-1::NeutronBridgeMappings",
                "parameter_type": "string",
                "value": "datacentre:br-ex"
            },
            {
                "constraints": [],
                "default": "http",
                "description": "Protocol to use when connecting to glance, set to https for SSL.",
                "hidden": null,
                "label": null,
                "name": "Cinder-Storage-1::GlanceProtocol",
                "parameter_type": "string",
                "value": "http"
            },
            {
                "constraints": [],
                "default": {},
                "description": "NovaCompute specific configuration to inject into the cluster. Same\nstructure as ExtraConfig.\n",
                "hidden": null,
                "label": null,
                "name": "Compute-1::NovaComputeExtraConfig",
                "parameter_type": "json",
                "value": {}
            },
            {
                "constraints": [],
                "default": "%stackname%-objectstorage-%index%",
                "description": "Format for SwiftStorage node hostnames",
                "hidden": null,
                "label": null,
                "name": "ObjectStorageHostnameFormat",
                "parameter_type": "string",
                "value": "%stackname%-objectstorage-%index%"
            },
            {
                "constraints": [],
                "default": "unset",
                "description": "The password for the neutron service account, used by neutron agents.",
                "hidden": true,
                "label": null,
                "name": "Compute-1::NeutronPassword",
                "parameter_type": "string",
                "value": "5bde587ef0f70045bb98fa74ad36baf16dd7edd1"
            },
            {
                "constraints": [],
                "default": "false",
                "description": "Value of mount_check in Swift account/container/object -server.conf",
                "hidden": null,
                "label": null,
                "name": "Controller-1::SwiftMountCheck",
                "parameter_type": "boolean",
                "value": "false"
            },
            {
                "constraints": [],
                "default": 4096,
                "description": "Configures MySQL max_connections config setting",
                "hidden": null,
                "label": null,
                "name": "Controller-1::MysqlMaxConnections",
                "parameter_type": "number",
                "value": 4096
            },
            {
                "constraints": [],
                "default": "",
                "description": "Setting to a previously unused value during stack-update will trigger package update on all nodes\n",
                "hidden": null,
                "label": null,
                "name": "Controller-1::UpdateIdentifier",
                "parameter_type": "string",
                "value": ""
            },
            {
                "constraints": [],
                "default": 4096,
                "description": "Configures RabbitMQ FD limit",
                "hidden": null,
                "label": null,
                "name": "Controller-1::RabbitFDLimit",
                "parameter_type": "string",
                "value": 4096
            },
            {
                "constraints": [
                    {
                        "constraint_type": "custom_constraint",
                        "definition": "nova.flavor",
                        "description": null
                    }
                ],
                "default": null,
                "description": "Flavor for Swift storage nodes to request when deploying.",
                "hidden": null,
                "label": null,
                "name": "Swift-Storage-1::Flavor",
                "parameter_type": "string",
                "value": "baremetal"
            },
            {
                "constraints": [],
                "default": [],
                "description": null,
                "hidden": null,
                "label": null,
                "name": "Cinder-Storage-1::removal_policies",
                "parameter_type": "json",
                "value": []
            },
            {
                "constraints": [],
                "default": 10,
                "description": "Partition Power to use when building Swift rings",
                "hidden": null,
                "label": null,
                "name": "Controller-1::SwiftPartPower",
                "parameter_type": "number",
                "value": 10
            },
            {
                "constraints": [],
                "default": {},
                "description": "Additional hieradata to inject into the cluster, note that\nControllerExtraConfig takes precedence over ExtraConfig.\n",
                "hidden": null,
                "label": null,
                "name": "Controller-1::ExtraConfig",
                "parameter_type": "json",
                "value": {}
            },
            {
                "constraints": [],
                "default": false,
                "description": "Whether to enable or not the Rbd backend for Cinder",
                "hidden": null,
                "label": null,
                "name": "Controller-1::CinderEnableRbdBackend",
                "parameter_type": "boolean",
                "value": false
            },
            {
                "constraints": [],
                "default": false,
                "description": "Whether to deploy Ceph Storage (OSD) on the Controller",
                "hidden": null,
                "label": null,
                "name": "Controller-1::EnableCephStorage",
                "parameter_type": "boolean",
                "value": false
            },
            {
                "constraints": [],
                "default": "br-ex",
                "description": "An OVS bridge to create for accessing external networks.",
                "hidden": null,
                "label": null,
                "name": "Compute-1::NeutronPhysicalBridge",
                "parameter_type": "string",
                "value": "br-ex"
            },
            {
                "constraints": [],
                "default": "unset",
                "description": "The password for the nova service account, used by nova-api.",
                "hidden": true,
                "label": null,
                "name": "Compute-1::NovaPassword",
                "parameter_type": "string",
                "value": "206899979d82609ad134f36c21f62b3fd6f823b6"
            },
            {
                "constraints": [],
                "default": true,
                "description": "Whether to use Galera instead of regular MariaDB.",
                "hidden": null,
                "label": null,
                "name": "Controller-1::EnableGalera",
                "parameter_type": "boolean",
                "value": true
            },
            {
                "constraints": [],
                "default": "guest",
                "description": "The password for RabbitMQ",
                "hidden": true,
                "label": null,
                "name": "Compute-1::RabbitPassword",
                "parameter_type": "string",
                "value": "guest"
            },
            {
                "constraints": [],
                "default": "vms",
                "description": "The name of the Ceph RBD pool to use/create for Nova ephemeral disks",
                "hidden": null,
                "label": null,
                "name": "NovaRbdPoolName",
                "parameter_type": "string",
                "value": "vms"
            }
        ],
        "roles": [
            {
                "description": "OpenStack ceph storage node configured by Puppet",
                "name": "Ceph-Storage",
                "uuid": "9dac69ed-c1ae-4efe-8fde-211280fa2ee3",
                "version": 1
            },
            {
                "description": "OpenStack cinder storage configured by Puppet",
                "name": "Cinder-Storage",
                "uuid": "cd6c6bd8-627b-4b37-acb7-4c2ef2e8dcfc",
                "version": 1
            },
            {
                "description": "OpenStack controller node configured by Puppet.\n",
                "name": "Controller",
                "uuid": "bcc00921-af5a-42cb-bbc4-167fa3803cc0",
                "version": 1
            },
            {
                "description": "OpenStack hypervisor node configured via Puppet.\n",
                "name": "Compute",
                "uuid": "82cc2955-e734-4757-9c6a-6e6a97b9d827",
                "version": 1
            },
            {
                "description": "OpenStack swift storage node configured by Puppet",
                "name": "Swift-Storage",
                "uuid": "96dd273c-f968-49ed-8ae7-9349fdf45195",
                "version": 1
            }
        ],
        "updated_at": null,
        "uuid": "a1bd94d6-c8b3-4eee-8d45-25b2cf3665d1"
    }

    });
  });

  deploymentPlanRouter.put('/:id/deployment_plans/overcloud/:update_action', function(req, res) {
    res.send({
    "deployment_plan": {
        "created_at": "2015-10-12T19:40:16",
        "description": null,
        "name": "overcloud",
        "parameters": [
            {
                "constraints": [],
                "default": "",
                "description": "If set, the contents of an SSL certificate .key file for encrypting SSL endpoints.",
                "hidden": true,
                "label": null,
                "name": "Controller-1::SSLKey",
                "parameter_type": "string",
                "value": ""
            },
            {
                "constraints": [],
                "default": false,
                "description": "Rabbit client subscriber parameter to specify an SSL connection to the RabbitMQ host.\n",
                "hidden": null,
                "label": null,
                "name": "Compute-1::RabbitClientUseSSL",
                "parameter_type": "string",
                "value": false
            },
            {
                "constraints": [],
                "default": "",
                "description": "Keystone certificate for verifying token validity.",
                "hidden": null,
                "label": null,
                "name": "Controller-1::KeystoneSSLCertificate",
                "parameter_type": "string",
                "value": ""
            },
            {
                "constraints": [],
                "default": 3,
                "description": "The number of neutron dhcp agents to schedule per network",
                "hidden": null,
                "label": null,
                "name": "Controller-1::NeutronDhcpAgentsPerNetwork",
                "parameter_type": "number",
                "value": 3
            },
            {
                "constraints": [],
                "default": {},
                "description": "Contains parameters to configure Cinder backends. Typically set via parameter_defaults in the resource registry.",
                "hidden": null,
                "label": null,
                "name": "Controller-1::CinderBackendConfig",
                "parameter_type": "json",
                "value": {}
            },
            {
                "constraints": [],
                "default": 5000,
                "description": "The size of the loopback file used by the cinder LVM driver.",
                "hidden": null,
                "label": null,
                "name": "Controller-1::CinderLVMLoopDeviceSize",
                "parameter_type": "number",
                "value": 5000
            },
            {
                "constraints": [],
                "default": "1:1000",
                "description": "Comma-separated list of <tun_min>:<tun_max> tuples enumerating ranges\nof GRE tunnel IDs that are available for tenant network allocation\n",
                "hidden": null,
                "label": null,
                "name": "Controller-1::NeutronTunnelIdRanges",
                "parameter_type": "comma_delimited_list",
                "value": "1:1000"
            },
            {
                "constraints": [],
                "default": "unset",
                "description": "The password for the keystone admin account, used for monitoring, querying neutron etc.",
                "hidden": true,
                "label": null,
                "name": "Compute-1::AdminPassword",
                "parameter_type": "string",
                "value": "eefc9d08730418d97ed35349880de68d3c2fa552"
            },
            {
                "constraints": [],
                "default": true,
                "description": "Whether to enable or not the Iscsi backend for Cinder",
                "hidden": null,
                "label": null,
                "name": "Cinder-Storage-1::CinderEnableIscsiBackend",
                "parameter_type": "boolean",
                "value": true
            },
            {
                "constraints": [],
                "default": [],
                "description": null,
                "hidden": null,
                "label": null,
                "name": "Controller-1::removal_policies",
                "parameter_type": "json",
                "value": []
            },
            {
                "constraints": [],
                "default": "unset",
                "description": "The password for the nova service and db account, used by nova-api.",
                "hidden": true,
                "label": null,
                "name": "Controller-1::NovaPassword",
                "parameter_type": "string",
                "value": "a5b263e90913ecfd93ded79c9062fbe04818a7dc"
            },
            {
                "constraints": [],
                "default": "unset",
                "description": "Shared secret to prevent spoofing",
                "hidden": null,
                "label": null,
                "name": "Compute-1::NeutronMetadataProxySharedSecret",
                "parameter_type": "string",
                "value": "unset"
            },
            {
                "constraints": [
                    {
                        "constraint_type": "range",
                        "definition": {
                            "min": "0"
                        },
                        "description": null
                    }
                ],
                "default": null,
                "description": null,
                "hidden": null,
                "label": null,
                "name": "Controller-1::count",
                "parameter_type": "number",
                "value": "1"
            },
            {
                "constraints": [],
                "default": "9292",
                "description": "Glance port.",
                "hidden": null,
                "label": null,
                "name": "Compute-1::GlancePort",
                "parameter_type": "string",
                "value": "9292"
            },
            {
                "constraints": [],
                "default": "",
                "description": "VLAN tag for creating a public VLAN. The tag will be used to create an access port on the exterior bridge for each control plane node, and that port will be given the IP address returned by neutron from the public network. Set CONTROLEXTRA=overcloud-vlan-port.yaml when compiling overcloud.yaml to include the deployment of VLAN ports to the control plane.\n",
                "hidden": null,
                "label": null,
                "name": "NeutronPublicInterfaceTag",
                "parameter_type": "string",
                "value": ""
            },
            {
                "constraints": [],
                "default": "%stackname%-controller-%index%",
                "description": "Format for Controller node hostnames",
                "hidden": null,
                "label": null,
                "name": "ControllerHostnameFormat",
                "parameter_type": "string",
                "value": "%stackname%-controller-%index%"
            },
            {
                "constraints": [],
                "default": "ro_snmp_user",
                "description": "The user name for SNMPd with readonly rights running on all Overcloud nodes",
                "hidden": null,
                "label": null,
                "name": "Controller-1::SnmpdReadonlyUserName",
                "parameter_type": "string",
                "value": "ro_snmp_user"
            },
            {
                "constraints": [],
                "default": "openvswitch",
                "description": "The mechanism drivers for the Neutron tenant network. To specify multiple\nvalues, use a comma separated string, like so: 'openvswitch,l2_population'\n",
                "hidden": null,
                "label": null,
                "name": "Compute-1::NeutronMechanismDrivers",
                "parameter_type": "string",
                "value": "openvswitch"
            },
            {
                "constraints": [],
                "default": "",
                "description": null,
                "hidden": null,
                "label": null,
                "name": "Ceph-Storage-1::NtpServer",
                "parameter_type": "string",
                "value": ""
            },
            {
                "constraints": [],
                "default": "false",
                "description": "Set to true to enable package installation via Puppet",
                "hidden": null,
                "label": null,
                "name": "Ceph-Storage-1::EnablePackageInstall",
                "parameter_type": "boolean",
                "value": "false"
            },
            {
                "constraints": [
                    {
                        "constraint_type": "range",
                        "definition": {
                            "min": "0"
                        },
                        "description": null
                    }
                ],
                "default": null,
                "description": null,
                "hidden": null,
                "label": null,
                "name": "Ceph-Storage-1::count",
                "parameter_type": "number",
                "value": "0"
            },
            {
                "constraints": [],
                "default": "default",
                "description": "Name of an existing EC2 KeyPair to enable SSH access to the instances",
                "hidden": null,
                "label": null,
                "name": "Cinder-Storage-1::KeyName",
                "parameter_type": "string",
                "value": "default"
            },
            {
                "constraints": [],
                "default": "REBUILD_PRESERVE_EPHEMERAL",
                "description": "What policy to use when reconstructing instances. REBUILD for rebuilds, REBUILD_PRESERVE_EPHEMERAL to preserve /mnt.",
                "hidden": null,
                "label": null,
                "name": "Controller-1::ImageUpdatePolicy",
                "parameter_type": "string",
                "value": "REBUILD_PRESERVE_EPHEMERAL"
            },
            {
                "constraints": [],
                "default": true,
                "description": "Whether to deploy a LoadBalancer on the Controller",
                "hidden": null,
                "label": null,
                "name": "Controller-1::EnableLoadBalancer",
                "parameter_type": "boolean",
                "value": true
            },
            {
                "constraints": [],
                "default": "1:1000",
                "description": "Comma-separated list of <tun_min>:<tun_max> tuples enumerating ranges\nof GRE tunnel IDs that are available for tenant network allocation\n",
                "hidden": null,
                "label": null,
                "name": "Compute-1::NeutronTunnelIdRanges",
                "parameter_type": "comma_delimited_list",
                "value": "1:1000"
            },
            {
                "constraints": [],
                "default": "",
                "description": "Setting to a previously unused value during stack-update will trigger package update on all nodes\n",
                "hidden": null,
                "label": null,
                "name": "Swift-Storage-1::UpdateIdentifier",
                "parameter_type": "string",
                "value": ""
            },
            {
                "constraints": [],
                "default": "",
                "description": null,
                "hidden": null,
                "label": null,
                "name": "Compute-1::NovaComputeLibvirtType",
                "parameter_type": "string",
                "value": "qemu"
            },
            {
                "constraints": [],
                "default": "unset",
                "description": "The password for the keystone admin account, used for monitoring, querying neutron etc.",
                "hidden": true,
                "label": null,
                "name": "Controller-1::AdminPassword",
                "parameter_type": "string",
                "value": "eefc9d08730418d97ed35349880de68d3c2fa552"
            },
            {
                "constraints": [],
                "default": 1,
                "description": "The minimum time (in hours) before a partition in a ring can be moved following a rebalance.",
                "hidden": null,
                "label": null,
                "name": "Controller-1::SwiftMinPartHours",
                "parameter_type": "number",
                "value": 1
            },
            {
                "constraints": [],
                "default": {},
                "description": "Controller specific hiera configuration data to inject into the cluster.\n",
                "hidden": null,
                "label": null,
                "name": "Controller-1::ControllerExtraConfig",
                "parameter_type": "json",
                "value": {}
            },
            {
                "constraints": [],
                "default": 5672,
                "description": "Set rabbit subscriber port, change this if using SSL",
                "hidden": null,
                "label": null,
                "name": "Controller-1::RabbitClientPort",
                "parameter_type": "number",
                "value": 5672
            },
            {
                "constraints": [],
                "default": "",
                "description": "The Ceph client key. Can be created with ceph-authtool --gen-print-key. Currently only used for external Ceph deployments to create the openstack user keyring.",
                "hidden": null,
                "label": null,
                "name": "CephClientKey",
                "parameter_type": "string",
                "value": ""
            },
            {
                "constraints": [],
                "default": "",
                "description": null,
                "hidden": null,
                "label": null,
                "name": "Swift-Storage-1::NtpServer",
                "parameter_type": "string",
                "value": ""
            },
            {
                "constraints": [],
                "default": "default",
                "description": "Name of an existing EC2 KeyPair to enable SSH access to the instances",
                "hidden": null,
                "label": null,
                "name": "Swift-Storage-1::KeyName",
                "parameter_type": "string",
                "value": "default"
            },
            {
                "constraints": [],
                "default": {
                    "BlockStorageHostnameResolveNetwork": "internal_api",
                    "CeilometerApiNetwork": "internal_api",
                    "CephClusterNetwork": "storage_mgmt",
                    "CephPublicNetwork": "storage",
                    "CephStorageHostnameResolveNetwork": "storage",
                    "CinderApiNetwork": "internal_api",
                    "CinderIscsiNetwork": "storage",
                    "ComputeHostnameResolveNetwork": "internal_api",
                    "ControllerHostnameResolveNetwork": "internal_api",
                    "GlanceApiNetwork": "storage",
                    "GlanceRegistryNetwork": "internal_api",
                    "HeatApiNetwork": "internal_api",
                    "HorizonNetwork": "internal_api",
                    "KeystoneAdminApiNetwork": "ctlplane",
                    "KeystonePublicApiNetwork": "internal_api",
                    "MemcachedNetwork": "internal_api",
                    "MongoDbNetwork": "internal_api",
                    "MysqlNetwork": "internal_api",
                    "NeutronApiNetwork": "internal_api",
                    "NeutronTenantNetwork": "tenant",
                    "NovaApiNetwork": "internal_api",
                    "NovaMetadataNetwork": "internal_api",
                    "NovaVncProxyNetwork": "internal_api",
                    "ObjectStorageHostnameResolveNetwork": "internal_api",
                    "RabbitMqNetwork": "internal_api",
                    "RedisNetwork": "internal_api",
                    "SwiftMgmtNetwork": "storage_mgmt",
                    "SwiftProxyNetwork": "storage"
                },
                "description": "Mapping of service_name -> network name. Typically set via parameter_defaults in the resource registry.",
                "hidden": null,
                "label": null,
                "name": "Compute-1::ServiceNetMap",
                "parameter_type": "json",
                "value": {
                    "BlockStorageHostnameResolveNetwork": "internal_api",
                    "CeilometerApiNetwork": "internal_api",
                    "CephClusterNetwork": "storage_mgmt",
                    "CephPublicNetwork": "storage",
                    "CephStorageHostnameResolveNetwork": "storage",
                    "CinderApiNetwork": "internal_api",
                    "CinderIscsiNetwork": "storage",
                    "ComputeHostnameResolveNetwork": "internal_api",
                    "ControllerHostnameResolveNetwork": "internal_api",
                    "GlanceApiNetwork": "storage",
                    "GlanceRegistryNetwork": "internal_api",
                    "HeatApiNetwork": "internal_api",
                    "HorizonNetwork": "internal_api",
                    "KeystoneAdminApiNetwork": "ctlplane",
                    "KeystonePublicApiNetwork": "internal_api",
                    "MemcachedNetwork": "internal_api",
                    "MongoDbNetwork": "internal_api",
                    "MysqlNetwork": "internal_api",
                    "NeutronApiNetwork": "internal_api",
                    "NeutronTenantNetwork": "tenant",
                    "NovaApiNetwork": "internal_api",
                    "NovaMetadataNetwork": "internal_api",
                    "NovaVncProxyNetwork": "internal_api",
                    "ObjectStorageHostnameResolveNetwork": "internal_api",
                    "RabbitMqNetwork": "internal_api",
                    "RedisNetwork": "internal_api",
                    "SwiftMgmtNetwork": "storage_mgmt",
                    "SwiftProxyNetwork": "storage"
                }
            },
            {
                "constraints": [],
                "default": "True",
                "description": "Allow automatic l3-agent failover",
                "hidden": null,
                "label": null,
                "name": "Controller-1::NeutronAllowL3AgentFailover",
                "parameter_type": "string",
                "value": "True"
            },
            {
                "constraints": [],
                "default": "libvirt.LibvirtDriver",
                "description": null,
                "hidden": null,
                "label": null,
                "name": "Compute-1::NovaComputeDriver",
                "parameter_type": "string",
                "value": "libvirt.LibvirtDriver"
            },
            {
                "constraints": [
                    {
                        "constraint_type": "custom_constraint",
                        "definition": "nova.flavor",
                        "description": null
                    }
                ],
                "default": null,
                "description": "Flavor for block storage nodes to request when deploying.",
                "hidden": null,
                "label": null,
                "name": "Cinder-Storage-1::Flavor",
                "parameter_type": "string",
                "value": "Flavor-4-x86_64-6144-40"
            },
            {
                "constraints": [],
                "default": "1:1000",
                "description": "Comma-separated list of <vni_min>:<vni_max> tuples enumerating ranges\nof VXLAN VNI IDs that are available for tenant network allocation\n",
                "hidden": null,
                "label": null,
                "name": "Controller-1::NeutronVniRanges",
                "parameter_type": "comma_delimited_list",
                "value": "1:1000"
            },
            {
                "constraints": [],
                "default": "",
                "description": "Keystone key for signing tokens.",
                "hidden": true,
                "label": null,
                "name": "Controller-1::KeystoneSigningKey",
                "parameter_type": "string",
                "value": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQD2uO//W6bu5vKp\n3jLcZsWwjVQ9mafzyFjMtXuxRWdhlKhxuDgVPKkFE1jo3963puNngErC6m+cMUfz\n++k2Ojv5ejCAbygbxklDK2fH4lT7+9YgA/odgS12sWvC2ntcLkAlRVl2nDtF9TCw\ny4xTv2vz/wZDC/q+AGazkmq19cV51HOUvU88JPjI1Q0jRy1B+GksSOD/eq099HYz\nslu9GVKncHf7FSru9gCCAVWf8jffRzdHZTIeGxEEHlXTlwQiLRlToLjMKqWi/sF2\n5qItZ18HEfGuLCCJ4Ie0P5AJ9usAFTZnDSafns7HkwO9b0oVC7olkTaC1z5XikUb\n5EFgyd3DAgMBAAECggEAEnv8jxcgxJlM6OkaymRwvy93dj4C1ULXVE7se3WFr0vh\n6tMwcHbg+t5eNORA3WWFeAWmlD/YKM2QZHklGcj3IVPEOnsZeCs85elklxcf4tkV\nS8TAgmFhNJlKR4jy4Q8eAyzU7Qv7bNxXz4cQdl3LCra6k19cY8vH5gA8OnG1X9Ej\nRym9wrcRLsoSQKl5NBX2NYin2x1elckyXvw/3/zSnx8151urg0rF4tPgyldvhXrf\nRCnR2XnsT9COq0XC+Ag9C/E5IofommK5rEbGnObViOfNiew/QcW9FPO1t/KAzT7m\nnhXo5bgXSJorrKrlNNm+vXX3qhLy4XQLRiGOM0JAYQKBgQD8aGCxgs4NV4vyOM1c\nmt2sECRP8c0eDUVxV5UcKrxSU829NBvP4REE18puIdXNj7gD+0wj7mclfb3PQ3+Y\nGFX03tdk0oq9hXaghDUA4RNgOvFanGIH1YiUMF6q1UEOgiLxtIww5I0XbJApQCGA\nt31su7i4dIJCWQ+YWYJk5vxMawKBgQD6O9iNpDuAC3IizYBJiGLiDN+RK2/ygYJ8\nCfa5qu+v7pmaoVou/81a4/8IHq+Op9yI9X3JS8PirM9Yy0xh1H3t6O/atrqK4Fsu\nqQ0I3K0hHjpSyEkLWyKEUeN3oPA3pKYMi3oGv0sEK+gKNGJwo5SUkl9eP9Th52LB\n6xx/8I0KCQKBgQCVwMvVpbjg25dRX/gfwFZStsUElX7QHKmdxIvYSVawNb50Sg1S\nOcNiLzGQRAzYyDMyUY9sJg8WhFLwPKjgMVgWT3xV+kCMjznBpI7Z9bAMQQxfaTcU\nVNGSslwIWTwfAoD/DNK8U22Ofz/M6Zq3Bqaos3u2HJIIEVUaW8jsWstH/wKBgBA5\nOxQL1tO5aj/5ZNzfm9GeFgyabVqirOwP1VA6VenpJUpSNb+gVBcVex5ypt0v4ut6\nRxp68AtNOvA91gjttvBqzso2WKfSXfcLfM3bSNpB1HQzihDTasx7Zq0F4S0qXp2n\nmVTAqENv+U5YER3ObT6ossgwiUPQNaXu8V0WIn7JAoGBAIvKQwX/s5nrid3n2puQ\nk22UZgXob5Tm9O9VKO/R5fjyspqn8TcqQxGf2sWlD6G5xqiBgp3rD2Lyzs/Fh8zM\nqVTSdfH32QWzwQEIDgGXF3ZMv1tn6tJb0ck98Ul2z+2nHnW6poFoDSxJuzXymEg0\naxFpaPPz3fK7Mz28AP+0kMEg\n-----END PRIVATE KEY-----"
            },
            {
                "constraints": [],
                "default": "guest",
                "description": null,
                "hidden": null,
                "label": null,
                "name": "Cinder-Storage-1::RabbitUserName",
                "parameter_type": "string",
                "value": "guest"
            },
            {
                "constraints": [
                    {
                        "constraint_type": "range",
                        "definition": {
                            "min": "0"
                        },
                        "description": null
                    }
                ],
                "default": null,
                "description": null,
                "hidden": null,
                "label": null,
                "name": "Compute-1::count",
                "parameter_type": "number",
                "value": "1"
            },
            {
                "constraints": [],
                "default": "",
                "description": "If set, the contents of an SSL certificate authority file.",
                "hidden": null,
                "label": null,
                "name": "Controller-1::SSLCACertificate",
                "parameter_type": "string",
                "value": ""
            },
            {
                "constraints": [],
                "default": "false",
                "description": "Set to true to enable package installation via Puppet",
                "hidden": null,
                "label": null,
                "name": "Compute-1::EnablePackageInstall",
                "parameter_type": "boolean",
                "value": "false"
            },
            {
                "constraints": [],
                "default": "",
                "description": "Mount options for NFS mounts used by Cinder NFS backend. Effective when CinderEnableNfsBackend is true.\n",
                "hidden": null,
                "label": null,
                "name": "Controller-1::CinderNfsMountOptions",
                "parameter_type": "string",
                "value": ""
            },
            {
                "constraints": [],
                "default": "unset",
                "description": "The password for the Heat service and db account, used by the Heat services.",
                "hidden": true,
                "label": null,
                "name": "Controller-1::HeatPassword",
                "parameter_type": "string",
                "value": "e03ae34153f1d5c7ed61c8a1cf5cdea091b97609"
            },
            {
                "constraints": [
                    {
                        "constraint_type": "range",
                        "definition": {
                            "min": "0"
                        },
                        "description": null
                    }
                ],
                "default": null,
                "description": null,
                "hidden": null,
                "label": null,
                "name": "Swift-Storage-1::count",
                "parameter_type": "number",
                "value": "0"
            },
            {
                "constraints": [],
                "default": true,
                "description": "Whether to enable Swift Storage on the Controller",
                "hidden": null,
                "label": null,
                "name": "Controller-1::EnableSwiftStorage",
                "parameter_type": "boolean",
                "value": true
            },
            {
                "constraints": [],
                "default": 3,
                "description": "How many replicas to use in the swift rings.",
                "hidden": null,
                "label": null,
                "name": "Swift-Storage-1::Replicas",
                "parameter_type": "number",
                "value": 3
            },
            {
                "constraints": [],
                "default": "vxlan",
                "description": "The tenant network type for Neutron, either gre or vxlan.",
                "hidden": null,
                "label": null,
                "name": "Compute-1::NeutronNetworkType",
                "parameter_type": "string",
                "value": "gre"
            },
            {
                "constraints": [],
                "default": "unset",
                "description": "The password for the neutron service and db account, used by neutron agents.",
                "hidden": true,
                "label": null,
                "name": "Controller-1::NeutronPassword",
                "parameter_type": "string",
                "value": "e35d984c3e035a889d9a8b361f8e87176e220761"
            },
            {
                "constraints": [],
                "default": [],
                "description": null,
                "hidden": null,
                "label": null,
                "name": "Swift-Storage-1::removal_policies",
                "parameter_type": "json",
                "value": []
            },
            {
                "constraints": [],
                "default": "unset",
                "description": "The user password for SNMPd with readonly rights running on all Overcloud nodes",
                "hidden": true,
                "label": null,
                "name": "Cinder-Storage-1::SnmpdReadonlyUserPassword",
                "parameter_type": "string",
                "value": "dd9dcedb826db03b001eddfc335349a2415924c7"
            },
            {
                "constraints": [],
                "default": "vxlan,vlan,flat,gre",
                "description": "Comma-seperated list of network type driver entrypoints to be loaded.\n",
                "hidden": null,
                "label": null,
                "name": "Compute-1::NeutronTypeDrivers",
                "parameter_type": "comma_delimited_list",
                "value": "vxlan,vlan,flat,gre"
            },
            {
                "constraints": [],
                "default": "unset",
                "description": "The password for the swift service account, used by the swift proxy services.",
                "hidden": true,
                "label": null,
                "name": "Controller-1::SwiftPassword",
                "parameter_type": "string",
                "value": "5e401d7fe2924226a60710c90ce4b98b458d34a0"
            },
            {
                "constraints": [],
                "default": "ml2",
                "description": "The core plugin for Neutron. The value should be the entrypoint to be loaded\nfrom neutron.core_plugins namespace.\n",
                "hidden": null,
                "label": null,
                "name": "Controller-1::NeutronCorePlugin",
                "parameter_type": "string",
                "value": "ml2"
            },
            {
                "constraints": [],
                "default": "",
                "description": "The filepath of the file to use for logging messages from Glance.",
                "hidden": null,
                "label": null,
                "name": "Controller-1::GlanceLogFile",
                "parameter_type": "string",
                "value": ""
            },
            {
                "constraints": [],
                "default": "1:1000",
                "description": "Comma-separated list of <vni_min>:<vni_max> tuples enumerating ranges\nof VXLAN VNI IDs that are available for tenant network allocation\n",
                "hidden": null,
                "label": null,
                "name": "Compute-1::NeutronVniRanges",
                "parameter_type": "comma_delimited_list",
                "value": "1:1000"
            },
            {
                "constraints": [],
                "default": "ro_snmp_user",
                "description": "The user name for SNMPd with readonly rights running on all Overcloud nodes",
                "hidden": null,
                "label": null,
                "name": "Compute-1::SnmpdReadonlyUserName",
                "parameter_type": "string",
                "value": "ro_snmp_user"
            },
            {
                "constraints": [],
                "default": "1:1000",
                "description": "Comma-separated list of <tun_min>:<tun_max> tuples enumerating ranges\nof GRE tunnel IDs that are available for tenant network allocation\n",
                "hidden": null,
                "label": null,
                "name": "NeutronTunnelIdRanges",
                "parameter_type": "comma_delimited_list",
                "value": "1:1000"
            },
            {
                "constraints": [],
                "default": {},
                "description": "Additional configuration to inject into the cluster. The JSON should have\nthe following structure:\n  {\"FILEKEY\":\n    {\"config\":\n      [{\"section\": \"SECTIONNAME\",\n        \"values\":\n          [{\"option\": \"OPTIONNAME\",\n            \"value\": \"VALUENAME\"\n           }\n          ]\n       }\n      ]\n    }\n  }\nFor instance:\n  {\"nova\":\n    {\"config\":\n      [{\"section\": \"default\",\n        \"values\":\n          [{\"option\": \"force_config_drive\",\n            \"value\": \"always\"\n           }\n          ]\n       },\n       {\"section\": \"cells\",\n        \"values\":\n          [{\"option\": \"driver\",\n            \"value\": \"nova.cells.rpc_driver.CellsRPCDriver\"\n           }\n          ]\n       }\n      ]\n    }\n  }\n",
                "hidden": null,
                "label": null,
                "name": "Compute-1::ExtraConfig",
                "parameter_type": "json",
                "value": {}
            },
            {
                "constraints": [],
                "default": false,
                "description": "Whether to make Glance file backend a mount managed by Pacemaker. Effective when GlanceBackend is 'file'.\n",
                "hidden": null,
                "label": null,
                "name": "Controller-1::GlanceFilePcmkManage",
                "parameter_type": "boolean",
                "value": false
            },
            {
                "constraints": [],
                "default": "unset",
                "description": "A random string to be used as a salt when hashing to determine mappings in the ring.",
                "hidden": true,
                "label": null,
                "name": "Controller-1::SwiftHashSuffix",
                "parameter_type": "string",
                "value": "63ef2ba2dbd3482131d3cdd010b27178560d729a"
            },
            {
                "constraints": [],
                "default": "",
                "description": null,
                "hidden": null,
                "label": null,
                "name": "Controller-1::NtpServer",
                "parameter_type": "string",
                "value": ""
            },
            {
                "constraints": [],
                "default": 1,
                "description": "The minimum time (in hours) before a partition in a ring can be moved following a rebalance.",
                "hidden": null,
                "label": null,
                "name": "Swift-Storage-1::MinPartHours",
                "parameter_type": "number",
                "value": 1
            },
            {
                "constraints": [],
                "default": "unset",
                "description": "The password for the ceilometer service  and db account.",
                "hidden": true,
                "label": null,
                "name": "Controller-1::CeilometerPassword",
                "parameter_type": "string",
                "value": "c27e160e8ca981f4046f3ca0cf8dd03be694ed68"
            },
            {
                "constraints": [],
                "default": "",
                "description": "The Ceph admin client key. Can be created with ceph-authtool --gen-print-key.",
                "hidden": null,
                "label": null,
                "name": "CephAdminKey",
                "parameter_type": "string",
                "value": ""
            },
            {
                "constraints": [],
                "default": 5000,
                "description": "The size of the loopback file used by the cinder LVM driver.",
                "hidden": null,
                "label": null,
                "name": "Cinder-Storage-1::CinderLVMLoopDeviceSize",
                "parameter_type": "number",
                "value": 5000
            },
            {
                "constraints": [],
                "default": "false",
                "description": "Set to true to enable package installation via Puppet",
                "hidden": null,
                "label": null,
                "name": "Controller-1::EnablePackageInstall",
                "parameter_type": "boolean",
                "value": "false"
            },
            {
                "constraints": [
                    {
                        "constraint_type": "range",
                        "definition": {
                            "min": "0"
                        },
                        "description": null
                    }
                ],
                "default": null,
                "description": null,
                "hidden": null,
                "label": null,
                "name": "Cinder-Storage-1::count",
                "parameter_type": "number",
                "value": "0"
            },
            {
                "constraints": [],
                "default": "datacentre:br-ex",
                "description": "The OVS logical->physical bridge mappings to use. See the Neutron documentation for details. Defaults to mapping br-ex - the external bridge on hosts - to a physical name 'datacentre' which can be used to create provider networks (and we use this for the default floating network) - if changing this either use different post-install network scripts or be sure to keep 'datacentre' as a mapping network name.\n",
                "hidden": null,
                "label": null,
                "name": "Controller-1::NeutronBridgeMappings",
                "parameter_type": "string",
                "value": "datacentre:br-ex"
            },
            {
                "constraints": [],
                "default": "br-ex",
                "description": "Specifies the interface where the public-facing virtual ip will be assigned. This should be int_public when a VLAN is being used.\n",
                "hidden": null,
                "label": null,
                "name": "Controller-1::PublicVirtualInterface",
                "parameter_type": "string",
                "value": "br-ex"
            },
            {
                "constraints": [
                    {
                        "constraint_type": "custom_constraint",
                        "definition": "nova.flavor",
                        "description": null
                    }
                ],
                "default": null,
                "description": "Flavor for the nova compute node",
                "hidden": null,
                "label": null,
                "name": "Compute-1::Flavor",
                "parameter_type": "string",
                "value": "Flavor-4-x86_64-6144-40"
            },
            {
                "constraints": [],
                "default": false,
                "description": "Rabbit client subscriber parameter to specify an SSL connection to the RabbitMQ host.\n",
                "hidden": null,
                "label": null,
                "name": "Controller-1::RabbitClientUseSSL",
                "parameter_type": "string",
                "value": false
            },
            {
                "constraints": [],
                "default": 3,
                "description": "How many replicas to use in the swift rings.",
                "hidden": null,
                "label": null,
                "name": "Controller-1::SwiftReplicas",
                "parameter_type": "number",
                "value": 3
            },
            {
                "constraints": [],
                "default": "%stackname%-compute-%index%",
                "description": "Format for Compute node hostnames",
                "hidden": null,
                "label": null,
                "name": "ComputeHostnameFormat",
                "parameter_type": "string",
                "value": "%stackname%-compute-%index%"
            },
            {
                "constraints": [],
                "default": "http",
                "description": "Protocol to use when connecting to glance, set to https for SSL.",
                "hidden": null,
                "label": null,
                "name": "Compute-1::GlanceProtocol",
                "parameter_type": "string",
                "value": "http"
            },
            {
                "constraints": [],
                "default": "nic1",
                "description": "A port to add to the NeutronPhysicalBridge.",
                "hidden": null,
                "label": null,
                "name": "Compute-1::NeutronPublicInterface",
                "parameter_type": "string",
                "value": "nic1"
            },
            {
                "constraints": [],
                "default": "vxlan",
                "description": "The tunnel types for the Neutron tenant network. To specify multiple\nvalues, use a comma separated string, like so: 'gre,vxlan'\n",
                "hidden": null,
                "label": null,
                "name": "Controller-1::NeutronTunnelTypes",
                "parameter_type": "string",
                "value": "gre"
            },
            {
                "constraints": [],
                "default": "vxlan",
                "description": "The tunnel types for the Neutron tenant network. To specify multiple\nvalues, use a comma separated string, like so: 'gre,vxlan'\n",
                "hidden": null,
                "label": null,
                "name": "Compute-1::NeutronTunnelTypes",
                "parameter_type": "string",
                "value": "gre"
            },
            {
                "constraints": [],
                "default": "unset",
                "description": "The user password for SNMPd with readonly rights running on all Overcloud nodes",
                "hidden": true,
                "label": null,
                "name": "Controller-1::SnmpdReadonlyUserPassword",
                "parameter_type": "string",
                "value": "dd9dcedb826db03b001eddfc335349a2415924c7"
            },
            {
                "constraints": [],
                "default": "noop",
                "description": "Strategy to use for Glance notification queue",
                "hidden": null,
                "label": null,
                "name": "Controller-1::GlanceNotifierStrategy",
                "parameter_type": "string",
                "value": "noop"
            },
            {
                "constraints": [],
                "default": "",
                "description": null,
                "hidden": null,
                "label": null,
                "name": "Compute-1::NeutronPublicInterfaceRawDevice",
                "parameter_type": "string",
                "value": ""
            },
            {
                "constraints": [],
                "default": "",
                "description": "Set to True to enable debugging on all services.",
                "hidden": null,
                "label": null,
                "name": "Cinder-Storage-1::Debug",
                "parameter_type": "string",
                "value": ""
            },
            {
                "constraints": [],
                "default": "unset",
                "description": "The password for the cinder service and db account, used by cinder-api.",
                "hidden": true,
                "label": null,
                "name": "Controller-1::CinderPassword",
                "parameter_type": "string",
                "value": "ab4bf07dfcbfacf49bc5d443d4bd5b820b46c762"
            },
            {
                "constraints": [],
                "default": "guest",
                "description": "The username for RabbitMQ",
                "hidden": null,
                "label": null,
                "name": "Controller-1::RabbitUserName",
                "parameter_type": "string",
                "value": "guest"
            },
            {
                "constraints": [],
                "default": false,
                "description": "Whether to enable or not the NFS backend for Cinder",
                "hidden": null,
                "label": null,
                "name": "Compute-1::CinderEnableNfsBackend",
                "parameter_type": "boolean",
                "value": false
            },
            {
                "constraints": [],
                "default": "ro_snmp_user",
                "description": "The user name for SNMPd with readonly rights running on all Overcloud nodes",
                "hidden": null,
                "label": null,
                "name": "Cinder-Storage-1::SnmpdReadonlyUserName",
                "parameter_type": "string",
                "value": "ro_snmp_user"
            },
            {
                "constraints": [],
                "default": {
                    "BlockStorageHostnameResolveNetwork": "internal_api",
                    "CeilometerApiNetwork": "internal_api",
                    "CephClusterNetwork": "storage_mgmt",
                    "CephPublicNetwork": "storage",
                    "CephStorageHostnameResolveNetwork": "storage",
                    "CinderApiNetwork": "internal_api",
                    "CinderIscsiNetwork": "storage",
                    "ComputeHostnameResolveNetwork": "internal_api",
                    "ControllerHostnameResolveNetwork": "internal_api",
                    "GlanceApiNetwork": "storage",
                    "GlanceRegistryNetwork": "internal_api",
                    "HeatApiNetwork": "internal_api",
                    "HorizonNetwork": "internal_api",
                    "KeystoneAdminApiNetwork": "ctlplane",
                    "KeystonePublicApiNetwork": "internal_api",
                    "MemcachedNetwork": "internal_api",
                    "MongoDbNetwork": "internal_api",
                    "MysqlNetwork": "internal_api",
                    "NeutronApiNetwork": "internal_api",
                    "NeutronTenantNetwork": "tenant",
                    "NovaApiNetwork": "internal_api",
                    "NovaMetadataNetwork": "internal_api",
                    "NovaVncProxyNetwork": "internal_api",
                    "ObjectStorageHostnameResolveNetwork": "internal_api",
                    "RabbitMqNetwork": "internal_api",
                    "RedisNetwork": "internal_api",
                    "SwiftMgmtNetwork": "storage_mgmt",
                    "SwiftProxyNetwork": "storage"
                },
                "description": "Mapping of service_name -> network name. Typically set via parameter_defaults in the resource registry.",
                "hidden": null,
                "label": null,
                "name": "Ceph-Storage-1::ServiceNetMap",
                "parameter_type": "json",
                "value": {
                    "BlockStorageHostnameResolveNetwork": "internal_api",
                    "CeilometerApiNetwork": "internal_api",
                    "CephClusterNetwork": "storage_mgmt",
                    "CephPublicNetwork": "storage",
                    "CephStorageHostnameResolveNetwork": "storage",
                    "CinderApiNetwork": "internal_api",
                    "CinderIscsiNetwork": "storage",
                    "ComputeHostnameResolveNetwork": "internal_api",
                    "ControllerHostnameResolveNetwork": "internal_api",
                    "GlanceApiNetwork": "storage",
                    "GlanceRegistryNetwork": "internal_api",
                    "HeatApiNetwork": "internal_api",
                    "HorizonNetwork": "internal_api",
                    "KeystoneAdminApiNetwork": "ctlplane",
                    "KeystonePublicApiNetwork": "internal_api",
                    "MemcachedNetwork": "internal_api",
                    "MongoDbNetwork": "internal_api",
                    "MysqlNetwork": "internal_api",
                    "NeutronApiNetwork": "internal_api",
                    "NeutronTenantNetwork": "tenant",
                    "NovaApiNetwork": "internal_api",
                    "NovaMetadataNetwork": "internal_api",
                    "NovaVncProxyNetwork": "internal_api",
                    "ObjectStorageHostnameResolveNetwork": "internal_api",
                    "RabbitMqNetwork": "internal_api",
                    "RedisNetwork": "internal_api",
                    "SwiftMgmtNetwork": "storage_mgmt",
                    "SwiftProxyNetwork": "storage"
                }
            },
            {
                "constraints": [],
                "default": "%stackname%-blockstorage-%index%",
                "description": "Format for BlockStorage node hostnames",
                "hidden": null,
                "label": null,
                "name": "BlockStorageHostnameFormat",
                "parameter_type": "string",
                "value": "%stackname%-blockstorage-%index%"
            },
            {
                "constraints": [],
                "default": "unset",
                "description": "Salt for the rabbit cookie, change this to force the randomly generated rabbit cookie to change.",
                "hidden": null,
                "label": null,
                "name": "RabbitCookieSalt",
                "parameter_type": "string",
                "value": "unset"
            },
            {
                "constraints": [],
                "default": "guest",
                "description": "The username for RabbitMQ",
                "hidden": null,
                "label": null,
                "name": "Compute-1::RabbitUserName",
                "parameter_type": "string",
                "value": "guest"
            },
            {
                "constraints": [
                    {
                        "constraint_type": "custom_constraint",
                        "definition": "glance.image",
                        "description": null
                    }
                ],
                "default": "overcloud-ceph-storage",
                "description": null,
                "hidden": null,
                "label": null,
                "name": "Ceph-Storage-1::Image",
                "parameter_type": "string",
                "value": "overcloud-full"
            },
            {
                "constraints": [],
                "default": "",
                "description": "The Ceph cluster FSID. Must be a UUID.",
                "hidden": null,
                "label": null,
                "name": "CephClusterFSID",
                "parameter_type": "string",
                "value": ""
            },
            {
                "constraints": [],
                "default": "",
                "description": "Keystone certificate for verifying token validity.",
                "hidden": null,
                "label": null,
                "name": "Controller-1::KeystoneSigningCertificate",
                "parameter_type": "string",
                "value": "-----BEGIN CERTIFICATE-----\nMIIDJDCCAgygAwIBAgIBAjANBgkqhkiG9w0BAQUFADBTMQswCQYDVQQGEwJYWDEO\nMAwGA1UECBMFVW5zZXQxDjAMBgNVBAcTBVVuc2V0MQ4wDAYDVQQKEwVVbnNldDEU\nMBIGA1UEAxMLS2V5c3RvbmUgQ0EwHhcNMTUxMDEyMTk0MTEzWhcNMjUxMDA5MTk0\nMTEzWjBYMQswCQYDVQQGEwJYWDEOMAwGA1UECBMFVW5zZXQxDjAMBgNVBAcTBVVu\nc2V0MQ4wDAYDVQQKEwVVbnNldDEZMBcGA1UEAxMQS2V5c3RvbmUgU2lnbmluZzCC\nASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAPa47/9bpu7m8qneMtxmxbCN\nVD2Zp/PIWMy1e7FFZ2GUqHG4OBU8qQUTWOjf3rem42eASsLqb5wxR/P76TY6O/l6\nMIBvKBvGSUMrZ8fiVPv71iAD+h2BLXaxa8Lae1wuQCVFWXacO0X1MLDLjFO/a/P/\nBkML+r4AZrOSarX1xXnUc5S9Tzwk+MjVDSNHLUH4aSxI4P96rT30djOyW70ZUqdw\nd/sVKu72AIIBVZ/yN99HN0dlMh4bEQQeVdOXBCItGVOguMwqpaL+wXbmoi1nXwcR\n8a4sIIngh7Q/kAn26wAVNmcNJp+ezseTA71vShULuiWRNoLXPleKRRvkQWDJ3cMC\nAwEAATANBgkqhkiG9w0BAQUFAAOCAQEAV/EaCEkV2NRr9MeXCY2h99KbVAd4fMQv\nVXmxwET/CXbQgDYImwUMkW9wafek8LaLRhOnqcMX64hZuamk/V5thVLTFHH+vN3g\nMIc1OW0xXSdW3jNvCzBYjXGhu0lTsuTL2ztqLb7Z9RyjILfLMF6uqvuYcjTTe94c\nDOVLkDkykAQD4Ue5dyyAc89x4esparM1WZxZ1cY7dOHMoQvr0SHqVkG/tVMGhczV\nzKqchYeVmS+irp0ObF6HU5R7k7VqlzIg12yPwPNKEucWIstj/RsL9WX0x8vqwgAf\nBONxAe4TRSEfZkYejkc3X82ruzvIv3LVauBTdvV2dWx7QrykSG+fvg==\n-----END CERTIFICATE-----"
            },
            {
                "constraints": [
                    {
                        "constraint_type": "custom_constraint",
                        "definition": "nova.keypair",
                        "description": null
                    }
                ],
                "default": "default",
                "description": "Name of an existing EC2 KeyPair to enable SSH access to the instances",
                "hidden": null,
                "label": null,
                "name": "Compute-1::KeyName",
                "parameter_type": "string",
                "value": "default"
            },
            {
                "constraints": [],
                "default": 5672,
                "description": "Set rabbit subscriber port, change this if using SSL",
                "hidden": null,
                "label": null,
                "name": "Cinder-Storage-1::RabbitClientPort",
                "parameter_type": "number",
                "value": 5672
            },
            {
                "constraints": [],
                "default": "unset",
                "description": "The user password for SNMPd with readonly rights running on all Overcloud nodes",
                "hidden": true,
                "label": null,
                "name": "Compute-1::SnmpdReadonlyUserPassword",
                "parameter_type": "string",
                "value": "dd9dcedb826db03b001eddfc335349a2415924c7"
            },
            {
                "constraints": [],
                "default": "http",
                "description": "Protocol to use when connecting to glance, set to https for SSL.",
                "hidden": null,
                "label": null,
                "name": "Controller-1::GlanceProtocol",
                "parameter_type": "string",
                "value": "http"
            },
            {
                "constraints": [],
                "default": "datacentre",
                "description": "The Neutron ML2 and OpenVSwitch vlan mapping range to support. See the Neutron documentation for permitted values. Defaults to permitting any VLAN on the 'datacentre' physical network (See NeutronBridgeMappings).\n",
                "hidden": null,
                "label": null,
                "name": "Compute-1::NeutronNetworkVLANRanges",
                "parameter_type": "comma_delimited_list",
                "value": "datacentre"
            },
            {
                "constraints": [],
                "default": "dvr_snat",
                "description": "Agent mode for the neutron-l3-agent on the controller hosts",
                "hidden": null,
                "label": null,
                "name": "Controller-1::NeutronAgentMode",
                "parameter_type": "string",
                "value": "dvr_snat"
            },
            {
                "constraints": [],
                "default": "datacentre",
                "description": "If set, flat networks to configure in neutron plugins.\n",
                "hidden": null,
                "label": null,
                "name": "Compute-1::NeutronFlatNetworks",
                "parameter_type": "string",
                "value": "datacentre"
            },
            {
                "constraints": [],
                "default": "false",
                "description": "Set to true to enable package installation via Puppet",
                "hidden": null,
                "label": null,
                "name": "Cinder-Storage-1::EnablePackageInstall",
                "parameter_type": "boolean",
                "value": "false"
            },
            {
                "constraints": [],
                "default": "REBUILD_PRESERVE_EPHEMERAL",
                "description": "What policy to use when reconstructing instances. REBUILD for rebuilds, REBUILD_PRESERVE_EPHEMERAL to preserve /mnt.",
                "hidden": null,
                "label": null,
                "name": "Compute-1::ImageUpdatePolicy",
                "parameter_type": "string",
                "value": "REBUILD_PRESERVE_EPHEMERAL"
            },
            {
                "constraints": [],
                "default": "images",
                "description": "The name of the Ceph RBD pool to use/create for Glance images",
                "hidden": null,
                "label": null,
                "name": "GlanceRbdPoolName",
                "parameter_type": "string",
                "value": "images"
            },
            {
                "constraints": [],
                "default": "unset",
                "description": "Shared secret to prevent spoofing",
                "hidden": null,
                "label": null,
                "name": "Controller-1::NeutronMetadataProxySharedSecret",
                "parameter_type": "string",
                "value": "unset"
            },
            {
                "constraints": [],
                "default": {},
                "description": "A network mapped list of IPs to assign to Controllers in the following form: {\n  \"internal_api\": [\"a.b.c.d\", \"e.f.g.h\"],\n  ...\n}\n",
                "hidden": null,
                "label": null,
                "name": "Controller-1::ControllerIPs",
                "parameter_type": "json",
                "value": {}
            },
            {
                "constraints": [
                    {
                        "constraint_type": "custom_constraint",
                        "definition": "nova.flavor",
                        "description": null
                    }
                ],
                "default": null,
                "description": "Flavor for the Ceph Storage node.",
                "hidden": null,
                "label": null,
                "name": "Ceph-Storage-1::Flavor",
                "parameter_type": "string",
                "value": "Flavor-4-x86_64-6144-40"
            },
            {
                "constraints": [],
                "default": {
                    "BlockStorageHostnameResolveNetwork": "internal_api",
                    "CeilometerApiNetwork": "internal_api",
                    "CephClusterNetwork": "storage_mgmt",
                    "CephPublicNetwork": "storage",
                    "CephStorageHostnameResolveNetwork": "storage",
                    "CinderApiNetwork": "internal_api",
                    "CinderIscsiNetwork": "storage",
                    "ComputeHostnameResolveNetwork": "internal_api",
                    "ControllerHostnameResolveNetwork": "internal_api",
                    "GlanceApiNetwork": "storage",
                    "GlanceRegistryNetwork": "internal_api",
                    "HeatApiNetwork": "internal_api",
                    "HorizonNetwork": "internal_api",
                    "KeystoneAdminApiNetwork": "ctlplane",
                    "KeystonePublicApiNetwork": "internal_api",
                    "MemcachedNetwork": "internal_api",
                    "MongoDbNetwork": "internal_api",
                    "MysqlNetwork": "internal_api",
                    "NeutronApiNetwork": "internal_api",
                    "NeutronTenantNetwork": "tenant",
                    "NovaApiNetwork": "internal_api",
                    "NovaMetadataNetwork": "internal_api",
                    "NovaVncProxyNetwork": "internal_api",
                    "ObjectStorageHostnameResolveNetwork": "internal_api",
                    "RabbitMqNetwork": "internal_api",
                    "RedisNetwork": "internal_api",
                    "SwiftMgmtNetwork": "storage_mgmt",
                    "SwiftProxyNetwork": "storage"
                },
                "description": "Mapping of service_name -> network name. Typically set via parameter_defaults in the resource registry.",
                "hidden": null,
                "label": null,
                "name": "Swift-Storage-1::ServiceNetMap",
                "parameter_type": "json",
                "value": {
                    "BlockStorageHostnameResolveNetwork": "internal_api",
                    "CeilometerApiNetwork": "internal_api",
                    "CephClusterNetwork": "storage_mgmt",
                    "CephPublicNetwork": "storage",
                    "CephStorageHostnameResolveNetwork": "storage",
                    "CinderApiNetwork": "internal_api",
                    "CinderIscsiNetwork": "storage",
                    "ComputeHostnameResolveNetwork": "internal_api",
                    "ControllerHostnameResolveNetwork": "internal_api",
                    "GlanceApiNetwork": "storage",
                    "GlanceRegistryNetwork": "internal_api",
                    "HeatApiNetwork": "internal_api",
                    "HorizonNetwork": "internal_api",
                    "KeystoneAdminApiNetwork": "ctlplane",
                    "KeystonePublicApiNetwork": "internal_api",
                    "MemcachedNetwork": "internal_api",
                    "MongoDbNetwork": "internal_api",
                    "MysqlNetwork": "internal_api",
                    "NeutronApiNetwork": "internal_api",
                    "NeutronTenantNetwork": "tenant",
                    "NovaApiNetwork": "internal_api",
                    "NovaMetadataNetwork": "internal_api",
                    "NovaVncProxyNetwork": "internal_api",
                    "ObjectStorageHostnameResolveNetwork": "internal_api",
                    "RabbitMqNetwork": "internal_api",
                    "RedisNetwork": "internal_api",
                    "SwiftMgmtNetwork": "storage_mgmt",
                    "SwiftProxyNetwork": "storage"
                }
            },
            {
                "constraints": [
                    {
                        "constraint_type": "allowed_values",
                        "definition": [
                            "basic",
                            "cadf"
                        ],
                        "description": null
                    }
                ],
                "default": "basic",
                "description": "The Keystone notification format",
                "hidden": null,
                "label": null,
                "name": "Controller-1::KeystoneNotificationFormat",
                "parameter_type": "string",
                "value": "basic"
            },
            {
                "constraints": [],
                "default": "",
                "description": null,
                "hidden": null,
                "label": null,
                "name": "Cinder-Storage-1::NtpServer",
                "parameter_type": "string",
                "value": ""
            },
            {
                "constraints": [],
                "default": [],
                "description": "Control the IP allocation for the PublicVirtualInterface port. E.g. [{'ip_address':'1.2.3.4'}]\n",
                "hidden": null,
                "label": null,
                "name": "PublicVirtualFixedIPs",
                "parameter_type": "json",
                "value": []
            },
            {
                "constraints": [],
                "default": {
                    "BlockStorageHostnameResolveNetwork": "internal_api",
                    "CeilometerApiNetwork": "internal_api",
                    "CephClusterNetwork": "storage_mgmt",
                    "CephPublicNetwork": "storage",
                    "CephStorageHostnameResolveNetwork": "storage",
                    "CinderApiNetwork": "internal_api",
                    "CinderIscsiNetwork": "storage",
                    "ComputeHostnameResolveNetwork": "internal_api",
                    "ControllerHostnameResolveNetwork": "internal_api",
                    "GlanceApiNetwork": "storage",
                    "GlanceRegistryNetwork": "internal_api",
                    "HeatApiNetwork": "internal_api",
                    "HorizonNetwork": "internal_api",
                    "KeystoneAdminApiNetwork": "ctlplane",
                    "KeystonePublicApiNetwork": "internal_api",
                    "MemcachedNetwork": "internal_api",
                    "MongoDbNetwork": "internal_api",
                    "MysqlNetwork": "internal_api",
                    "NeutronApiNetwork": "internal_api",
                    "NeutronTenantNetwork": "tenant",
                    "NovaApiNetwork": "internal_api",
                    "NovaMetadataNetwork": "internal_api",
                    "NovaVncProxyNetwork": "internal_api",
                    "ObjectStorageHostnameResolveNetwork": "internal_api",
                    "RabbitMqNetwork": "internal_api",
                    "RedisNetwork": "internal_api",
                    "SwiftMgmtNetwork": "storage_mgmt",
                    "SwiftProxyNetwork": "storage"
                },
                "description": "Mapping of service_name -> network name. Typically set via parameter_defaults in the resource registry.",
                "hidden": null,
                "label": null,
                "name": "ServiceNetMap",
                "parameter_type": "json",
                "value": {
                    "BlockStorageHostnameResolveNetwork": "internal_api",
                    "CeilometerApiNetwork": "internal_api",
                    "CephClusterNetwork": "storage_mgmt",
                    "CephPublicNetwork": "storage",
                    "CephStorageHostnameResolveNetwork": "storage",
                    "CinderApiNetwork": "internal_api",
                    "CinderIscsiNetwork": "storage",
                    "ComputeHostnameResolveNetwork": "internal_api",
                    "ControllerHostnameResolveNetwork": "internal_api",
                    "GlanceApiNetwork": "storage",
                    "GlanceRegistryNetwork": "internal_api",
                    "HeatApiNetwork": "internal_api",
                    "HorizonNetwork": "internal_api",
                    "KeystoneAdminApiNetwork": "ctlplane",
                    "KeystonePublicApiNetwork": "internal_api",
                    "MemcachedNetwork": "internal_api",
                    "MongoDbNetwork": "internal_api",
                    "MysqlNetwork": "internal_api",
                    "NeutronApiNetwork": "internal_api",
                    "NeutronTenantNetwork": "tenant",
                    "NovaApiNetwork": "internal_api",
                    "NovaMetadataNetwork": "internal_api",
                    "NovaVncProxyNetwork": "internal_api",
                    "ObjectStorageHostnameResolveNetwork": "internal_api",
                    "RabbitMqNetwork": "internal_api",
                    "RedisNetwork": "internal_api",
                    "SwiftMgmtNetwork": "storage_mgmt",
                    "SwiftProxyNetwork": "storage"
                }
            },
            {
                "constraints": [],
                "default": "True",
                "description": "Allow automatic l3-agent failover",
                "hidden": null,
                "label": null,
                "name": "Compute-1::NeutronAllowL3AgentFailover",
                "parameter_type": "string",
                "value": "True"
            },
            {
                "constraints": [],
                "default": "1:1000",
                "description": "Comma-separated list of <vni_min>:<vni_max> tuples enumerating ranges\nof VXLAN VNI IDs that are available for tenant network allocation\n",
                "hidden": null,
                "label": null,
                "name": "NeutronVniRanges",
                "parameter_type": "comma_delimited_list",
                "value": "1:1000"
            },
            {
                "constraints": [],
                "default": "",
                "description": "Set to True to enable debugging on all services.",
                "hidden": null,
                "label": null,
                "name": "Controller-1::Debug",
                "parameter_type": "string",
                "value": ""
            },
            {
                "constraints": [],
                "default": "openstack",
                "description": "The Ceph user to use with OpenStack clients.",
                "hidden": null,
                "label": null,
                "name": "CephClientUserName",
                "parameter_type": "string",
                "value": "openstack"
            },
            {
                "constraints": [],
                "default": "REBUILD_PRESERVE_EPHEMERAL",
                "description": "What policy to use when reconstructing instances. REBUILD for rebuilds, REBUILD_PRESERVE_EPHEMERAL to preserve /mnt.",
                "hidden": null,
                "label": null,
                "name": "Ceph-Storage-1::ImageUpdatePolicy",
                "parameter_type": "string",
                "value": "REBUILD_PRESERVE_EPHEMERAL"
            },
            {
                "constraints": [],
                "default": "",
                "description": "Setting to a previously unused value during stack-update will trigger package update on all nodes\n",
                "hidden": null,
                "label": null,
                "name": "Ceph-Storage-1::UpdateIdentifier",
                "parameter_type": "string",
                "value": ""
            },
            {
                "constraints": [],
                "default": "True",
                "description": null,
                "hidden": null,
                "label": null,
                "name": "Compute-1::NeutronEnableTunnelling",
                "parameter_type": "string",
                "value": "True"
            },
            {
                "constraints": [],
                "default": "volumes",
                "description": "The name of the Ceph RBD pool to use/create for Cinder volumes",
                "hidden": null,
                "label": null,
                "name": "CinderRbdPoolName",
                "parameter_type": "string",
                "value": "volumes"
            },
            {
                "constraints": [],
                "default": "",
                "description": "Setting to a previously unused value during stack-update will trigger package update on all nodes\n",
                "hidden": null,
                "label": null,
                "name": "Cinder-Storage-1::UpdateIdentifier",
                "parameter_type": "string",
                "value": ""
            },
            {
                "constraints": [],
                "default": "nfs",
                "description": "Filesystem type for Pacemaker mount used as Glance storage. Effective when GlanceFilePcmkManage is true.\n",
                "hidden": null,
                "label": null,
                "name": "Controller-1::GlanceFilePcmkFstype",
                "parameter_type": "string",
                "value": "nfs"
            },
            {
                "constraints": [],
                "default": [
                    "messaging"
                ],
                "description": "Comma-separated list of Oslo notification drivers used by Keystone",
                "hidden": null,
                "label": null,
                "name": "Controller-1::KeystoneNotificationDriver",
                "parameter_type": "comma_delimited_list",
                "value": [
                    "messaging"
                ]
            },
            {
                "constraints": [],
                "default": "mongodb",
                "description": "The ceilometer backend type.",
                "hidden": null,
                "label": null,
                "name": "Controller-1::CeilometerBackend",
                "parameter_type": "string",
                "value": "mongodb"
            },
            {
                "constraints": [],
                "default": "",
                "description": "List of externally managed Ceph Mon Host IPs. Only used for external Ceph deployments.",
                "hidden": null,
                "label": null,
                "name": "CephExternalMonHost",
                "parameter_type": "string",
                "value": ""
            },
            {
                "constraints": [],
                "default": {},
                "description": "Additional configuration to inject into the cluster. The JSON should have\nthe following structure:\n  {\"FILEKEY\":\n    {\"config\":\n      [{\"section\": \"SECTIONNAME\",\n        \"values\":\n          [{\"option\": \"OPTIONNAME\",\n            \"value\": \"VALUENAME\"\n           }\n          ]\n       }\n      ]\n    }\n  }\nFor instance:\n  {\"nova\":\n    {\"config\":\n      [{\"section\": \"default\",\n        \"values\":\n          [{\"option\": \"force_config_drive\",\n            \"value\": \"always\"\n           }\n          ]\n       },\n       {\"section\": \"cells\",\n        \"values\":\n          [{\"option\": \"driver\",\n            \"value\": \"nova.cells.rpc_driver.CellsRPCDriver\"\n           }\n          ]\n       }\n      ]\n    }\n  }\n",
                "hidden": null,
                "label": null,
                "name": "Cinder-Storage-1::ExtraConfig",
                "parameter_type": "json",
                "value": {}
            },
            {
                "constraints": [],
                "default": "",
                "description": "Keystone key for signing tokens.",
                "hidden": true,
                "label": null,
                "name": "Controller-1::KeystoneSSLCertificateKey",
                "parameter_type": "string",
                "value": ""
            },
            {
                "constraints": [
                    {
                        "constraint_type": "custom_constraint",
                        "definition": "nova.keypair",
                        "description": null
                    }
                ],
                "default": "default",
                "description": "Name of an existing EC2 KeyPair to enable SSH access to the instances",
                "hidden": null,
                "label": null,
                "name": "Ceph-Storage-1::KeyName",
                "parameter_type": "string",
                "value": "default"
            },
            {
                "constraints": [],
                "default": "dvr_snat",
                "description": "Agent mode for the neutron-l3-agent on the controller hosts",
                "hidden": null,
                "label": null,
                "name": "Compute-1::NeutronAgentMode",
                "parameter_type": "string",
                "value": "dvr_snat"
            },
            {
                "constraints": [],
                "default": "unset",
                "description": "The password for the ceilometer service account.",
                "hidden": true,
                "label": null,
                "name": "Compute-1::CeilometerPassword",
                "parameter_type": "string",
                "value": "c27e160e8ca981f4046f3ca0cf8dd03be694ed68"
            },
            {
                "constraints": [],
                "default": "ml2",
                "description": "The core plugin for Neutron. The value should be the entrypoint to be loaded\nfrom neutron.core_plugins namespace.\n",
                "hidden": null,
                "label": null,
                "name": "Compute-1::NeutronCorePlugin",
                "parameter_type": "string",
                "value": "ml2"
            },
            {
                "constraints": [],
                "default": "",
                "description": "Mount options for Pacemaker mount used as Glance storage. Effective when GlanceFilePcmkManage is true.\n",
                "hidden": null,
                "label": null,
                "name": "Controller-1::GlanceFilePcmkOptions",
                "parameter_type": "string",
                "value": ""
            },
            {
                "constraints": [],
                "default": 10,
                "description": "Partition Power to use when building Swift rings",
                "hidden": null,
                "label": null,
                "name": "Swift-Storage-1::PartPower",
                "parameter_type": "number",
                "value": 10
            },
            {
                "constraints": [],
                "default": {
                    "BlockStorageHostnameResolveNetwork": "internal_api",
                    "CeilometerApiNetwork": "internal_api",
                    "CephClusterNetwork": "storage_mgmt",
                    "CephPublicNetwork": "storage",
                    "CephStorageHostnameResolveNetwork": "storage",
                    "CinderApiNetwork": "internal_api",
                    "CinderIscsiNetwork": "storage",
                    "ComputeHostnameResolveNetwork": "internal_api",
                    "ControllerHostnameResolveNetwork": "internal_api",
                    "GlanceApiNetwork": "storage",
                    "GlanceRegistryNetwork": "internal_api",
                    "HeatApiNetwork": "internal_api",
                    "HorizonNetwork": "internal_api",
                    "KeystoneAdminApiNetwork": "ctlplane",
                    "KeystonePublicApiNetwork": "internal_api",
                    "MemcachedNetwork": "internal_api",
                    "MongoDbNetwork": "internal_api",
                    "MysqlNetwork": "internal_api",
                    "NeutronApiNetwork": "internal_api",
                    "NeutronTenantNetwork": "tenant",
                    "NovaApiNetwork": "internal_api",
                    "NovaMetadataNetwork": "internal_api",
                    "NovaVncProxyNetwork": "internal_api",
                    "ObjectStorageHostnameResolveNetwork": "internal_api",
                    "RabbitMqNetwork": "internal_api",
                    "RedisNetwork": "internal_api",
                    "SwiftMgmtNetwork": "storage_mgmt",
                    "SwiftProxyNetwork": "storage"
                },
                "description": "Mapping of service_name -> network name. Typically set via parameter_defaults in the resource registry.",
                "hidden": null,
                "label": null,
                "name": "Controller-1::ServiceNetMap",
                "parameter_type": "json",
                "value": {
                    "BlockStorageHostnameResolveNetwork": "internal_api",
                    "CeilometerApiNetwork": "internal_api",
                    "CephClusterNetwork": "storage_mgmt",
                    "CephPublicNetwork": "storage",
                    "CephStorageHostnameResolveNetwork": "storage",
                    "CinderApiNetwork": "internal_api",
                    "CinderIscsiNetwork": "storage",
                    "ComputeHostnameResolveNetwork": "internal_api",
                    "ControllerHostnameResolveNetwork": "internal_api",
                    "GlanceApiNetwork": "storage",
                    "GlanceRegistryNetwork": "internal_api",
                    "HeatApiNetwork": "internal_api",
                    "HorizonNetwork": "internal_api",
                    "KeystoneAdminApiNetwork": "ctlplane",
                    "KeystonePublicApiNetwork": "internal_api",
                    "MemcachedNetwork": "internal_api",
                    "MongoDbNetwork": "internal_api",
                    "MysqlNetwork": "internal_api",
                    "NeutronApiNetwork": "internal_api",
                    "NeutronTenantNetwork": "tenant",
                    "NovaApiNetwork": "internal_api",
                    "NovaMetadataNetwork": "internal_api",
                    "NovaVncProxyNetwork": "internal_api",
                    "ObjectStorageHostnameResolveNetwork": "internal_api",
                    "RabbitMqNetwork": "internal_api",
                    "RedisNetwork": "internal_api",
                    "SwiftMgmtNetwork": "storage_mgmt",
                    "SwiftProxyNetwork": "storage"
                }
            },
            {
                "constraints": [],
                "default": "datacentre",
                "description": "If set, flat networks to configure in neutron plugins.",
                "hidden": null,
                "label": null,
                "name": "Controller-1::NeutronFlatNetworks",
                "parameter_type": "string",
                "value": "datacentre"
            },
            {
                "constraints": [],
                "default": true,
                "description": "Whether to enable or not the Iscsi backend for Cinder",
                "hidden": null,
                "label": null,
                "name": "Controller-1::CinderEnableIscsiBackend",
                "parameter_type": "boolean",
                "value": true
            },
            {
                "constraints": [],
                "default": "unset",
                "description": "Secret shared by the ceilometer services.",
                "hidden": true,
                "label": null,
                "name": "Compute-1::CeilometerMeteringSecret",
                "parameter_type": "string",
                "value": "128f8fa20a4d6cffbf0900b91488441f333a87ab"
            },
            {
                "constraints": [],
                "default": [],
                "description": "Should be used for arbitrary ips.",
                "hidden": null,
                "label": null,
                "name": "ControlFixedIPs",
                "parameter_type": "json",
                "value": []
            },
            {
                "constraints": [],
                "default": "",
                "description": "A custom IP address to put onto the NeutronPublicInterface.",
                "hidden": null,
                "label": null,
                "name": "Controller-1::NeutronPublicInterfaceIP",
                "parameter_type": "string",
                "value": ""
            },
            {
                "constraints": [],
                "default": "unset",
                "description": "The keystone auth secret and db password.",
                "hidden": true,
                "label": null,
                "name": "Controller-1::AdminToken",
                "parameter_type": "string",
                "value": "81c77fea0fdedc51207864b1310372f220e86090"
            },
            {
                "constraints": [
                    {
                        "constraint_type": "custom_constraint",
                        "definition": "nova.keypair",
                        "description": null
                    }
                ],
                "default": "default",
                "description": "Name of an existing EC2 KeyPair to enable SSH access to the instances",
                "hidden": null,
                "label": null,
                "name": "Controller-1::KeyName",
                "parameter_type": "string",
                "value": "default"
            },
            {
                "constraints": [],
                "default": "guest",
                "description": "The password for RabbitMQ",
                "hidden": true,
                "label": null,
                "name": "Controller-1::RabbitPassword",
                "parameter_type": "string",
                "value": "guest"
            },
            {
                "constraints": [],
                "default": "",
                "description": "A custom default route for the NeutronPublicInterface.",
                "hidden": null,
                "label": null,
                "name": "Controller-1::NeutronPublicInterfaceDefaultRoute",
                "parameter_type": "string",
                "value": ""
            },
            {
                "constraints": [],
                "default": "false",
                "description": "Value of mount_check in Swift account/container/object -server.conf",
                "hidden": null,
                "label": null,
                "name": "Swift-Storage-1::MountCheck",
                "parameter_type": "boolean",
                "value": "false"
            },
            {
                "constraints": [],
                "default": "router",
                "description": "Comma-seperated list of service plugin entrypoints to be loaded from the\nneutron.service_plugins namespace.\n",
                "hidden": null,
                "label": null,
                "name": "Controller-1::NeutronServicePlugins",
                "parameter_type": "comma_delimited_list",
                "value": "router"
            },
            {
                "constraints": [],
                "default": "",
                "description": null,
                "hidden": null,
                "label": null,
                "name": "Compute-1::NtpServer",
                "parameter_type": "string",
                "value": ""
            },
            {
                "constraints": [],
                "default": "",
                "description": "If set, the contents of an SSL certificate .crt file for encrypting SSL endpoints.",
                "hidden": true,
                "label": null,
                "name": "Controller-1::SSLCertificate",
                "parameter_type": "string",
                "value": ""
            },
            {
                "constraints": [],
                "default": [],
                "description": null,
                "hidden": null,
                "label": null,
                "name": "Compute-1::removal_policies",
                "parameter_type": "json",
                "value": []
            },
            {
                "constraints": [
                    {
                        "constraint_type": "allowed_values",
                        "definition": [
                            "swift",
                            "file",
                            "rbd"
                        ],
                        "description": null
                    }
                ],
                "default": "swift",
                "description": "The short name of the Glance backend to use. Should be one of swift, rbd, or file",
                "hidden": null,
                "label": null,
                "name": "Controller-1::GlanceBackend",
                "parameter_type": "string",
                "value": "swift"
            },
            {
                "constraints": [],
                "default": "vxlan",
                "description": "The tenant network type for Neutron, either gre or vxlan.",
                "hidden": null,
                "label": null,
                "name": "Controller-1::NeutronNetworkType",
                "parameter_type": "string",
                "value": "gre"
            },
            {
                "constraints": [
                    {
                        "constraint_type": "custom_constraint",
                        "definition": "glance.image",
                        "description": null
                    }
                ],
                "default": "overcloud-compute",
                "description": null,
                "hidden": null,
                "label": null,
                "name": "Compute-1::Image",
                "parameter_type": "string",
                "value": "overcloud-full"
            },
            {
                "constraints": [],
                "default": {
                    "BlockStorageHostnameResolveNetwork": "internal_api",
                    "CeilometerApiNetwork": "internal_api",
                    "CephClusterNetwork": "storage_mgmt",
                    "CephPublicNetwork": "storage",
                    "CephStorageHostnameResolveNetwork": "storage",
                    "CinderApiNetwork": "internal_api",
                    "CinderIscsiNetwork": "storage",
                    "ComputeHostnameResolveNetwork": "internal_api",
                    "ControllerHostnameResolveNetwork": "internal_api",
                    "GlanceApiNetwork": "storage",
                    "GlanceRegistryNetwork": "internal_api",
                    "HeatApiNetwork": "internal_api",
                    "HorizonNetwork": "internal_api",
                    "KeystoneAdminApiNetwork": "ctlplane",
                    "KeystonePublicApiNetwork": "internal_api",
                    "MemcachedNetwork": "internal_api",
                    "MongoDbNetwork": "internal_api",
                    "MysqlNetwork": "internal_api",
                    "NeutronApiNetwork": "internal_api",
                    "NeutronTenantNetwork": "tenant",
                    "NovaApiNetwork": "internal_api",
                    "NovaMetadataNetwork": "internal_api",
                    "NovaVncProxyNetwork": "internal_api",
                    "ObjectStorageHostnameResolveNetwork": "internal_api",
                    "RabbitMqNetwork": "internal_api",
                    "RedisNetwork": "internal_api",
                    "SwiftMgmtNetwork": "storage_mgmt",
                    "SwiftProxyNetwork": "storage"
                },
                "description": "Mapping of service_name -> network name. Typically set via parameter_defaults in the resource registry.",
                "hidden": null,
                "label": null,
                "name": "Cinder-Storage-1::ServiceNetMap",
                "parameter_type": "json",
                "value": {
                    "BlockStorageHostnameResolveNetwork": "internal_api",
                    "CeilometerApiNetwork": "internal_api",
                    "CephClusterNetwork": "storage_mgmt",
                    "CephPublicNetwork": "storage",
                    "CephStorageHostnameResolveNetwork": "storage",
                    "CinderApiNetwork": "internal_api",
                    "CinderIscsiNetwork": "storage",
                    "ComputeHostnameResolveNetwork": "internal_api",
                    "ControllerHostnameResolveNetwork": "internal_api",
                    "GlanceApiNetwork": "storage",
                    "GlanceRegistryNetwork": "internal_api",
                    "HeatApiNetwork": "internal_api",
                    "HorizonNetwork": "internal_api",
                    "KeystoneAdminApiNetwork": "ctlplane",
                    "KeystonePublicApiNetwork": "internal_api",
                    "MemcachedNetwork": "internal_api",
                    "MongoDbNetwork": "internal_api",
                    "MysqlNetwork": "internal_api",
                    "NeutronApiNetwork": "internal_api",
                    "NeutronTenantNetwork": "tenant",
                    "NovaApiNetwork": "internal_api",
                    "NovaMetadataNetwork": "internal_api",
                    "NovaVncProxyNetwork": "internal_api",
                    "ObjectStorageHostnameResolveNetwork": "internal_api",
                    "RabbitMqNetwork": "internal_api",
                    "RedisNetwork": "internal_api",
                    "SwiftMgmtNetwork": "storage_mgmt",
                    "SwiftProxyNetwork": "storage"
                }
            },
            {
                "constraints": [],
                "default": "",
                "description": "Setting to a previously unused value during stack-update will trigger package update on all nodes\n",
                "hidden": null,
                "label": null,
                "name": "Compute-1::UpdateIdentifier",
                "parameter_type": "string",
                "value": ""
            },
            {
                "constraints": [],
                "default": "False",
                "description": "Whether to configure Neutron Distributed Virtual Routers",
                "hidden": null,
                "label": null,
                "name": "Controller-1::NeutronDVR",
                "parameter_type": "string",
                "value": "False"
            },
            {
                "constraints": [],
                "default": "unset",
                "description": "The user password for SNMPd with readonly rights running on all Overcloud nodes",
                "hidden": true,
                "label": null,
                "name": "Swift-Storage-1::SnmpdReadonlyUserPassword",
                "parameter_type": "string",
                "value": "dd9dcedb826db03b001eddfc335349a2415924c7"
            },
            {
                "constraints": [],
                "default": "9292",
                "description": "Glance port.",
                "hidden": null,
                "label": null,
                "name": "Controller-1::GlancePort",
                "parameter_type": "string",
                "value": "9292"
            },
            {
                "constraints": [],
                "default": "router",
                "description": "Comma-seperated list of service plugin entrypoints to be loaded from the\nneutron.service_plugins namespace.\n",
                "hidden": null,
                "label": null,
                "name": "Compute-1::NeutronServicePlugins",
                "parameter_type": "comma_delimited_list",
                "value": "router"
            },
            {
                "constraints": [
                    {
                        "constraint_type": "custom_constraint",
                        "definition": "nova.flavor",
                        "description": null
                    }
                ],
                "default": null,
                "description": "Flavor for control nodes to request when deploying.",
                "hidden": null,
                "label": null,
                "name": "Controller-1::Flavor",
                "parameter_type": "string",
                "value": "Flavor-4-x86_64-6144-40"
            },
            {
                "constraints": [],
                "default": "openvswitch",
                "description": "The mechanism drivers for the Neutron tenant network. To specify multiple\nvalues, use a comma separated string, like so: 'openvswitch,l2_population'\n",
                "hidden": null,
                "label": null,
                "name": "Controller-1::NeutronMechanismDrivers",
                "parameter_type": "string",
                "value": "openvswitch"
            },
            {
                "constraints": [],
                "default": "",
                "description": "The DNS name of this cloud. E.g. ci-overcloud.tripleo.org",
                "hidden": null,
                "label": null,
                "name": "Controller-1::CloudName",
                "parameter_type": "string",
                "value": "overcloud"
            },
            {
                "constraints": [],
                "default": "%stackname%-cephstorage-%index%",
                "description": "Format for CephStorage node hostnames",
                "hidden": null,
                "label": null,
                "name": "CephStorageHostnameFormat",
                "parameter_type": "string",
                "value": "%stackname%-cephstorage-%index%"
            },
            {
                "constraints": [],
                "default": false,
                "description": "If enabled services will be monitored by Pacemaker; it will manage VIPs as well, in place of Keepalived.",
                "hidden": null,
                "label": null,
                "name": "Controller-1::EnablePacemaker",
                "parameter_type": "boolean",
                "value": false
            },
            {
                "constraints": [],
                "default": "unset",
                "description": "Password for heat_stack_domain_admin user.",
                "hidden": true,
                "label": null,
                "name": "Controller-1::HeatStackDomainAdminPassword",
                "parameter_type": "string",
                "value": "unset"
            },
            {
                "constraints": [],
                "default": "br-ex",
                "description": "Name of bridge used for external network traffic.",
                "hidden": null,
                "label": null,
                "name": "Controller-1::NeutronExternalNetworkBridge",
                "parameter_type": "string",
                "value": "br-ex"
            },
            {
                "constraints": [],
                "default": 0,
                "description": "Specifies the size of the buffer pool in megabytes. Setting to zero should be interpreted as \"no value\" and will defer to the lower level default.\n",
                "hidden": null,
                "label": null,
                "name": "Controller-1::MysqlInnodbBufferPoolSize",
                "parameter_type": "number",
                "value": 0
            },
            {
                "constraints": [],
                "default": "tgtadm",
                "description": "The iSCSI helper to use with cinder.",
                "hidden": null,
                "label": null,
                "name": "Controller-1::CinderISCSIHelper",
                "parameter_type": "string",
                "value": "lioadm"
            },
            {
                "constraints": [],
                "default": "overcloud-swift-storage",
                "description": null,
                "hidden": null,
                "label": null,
                "name": "Swift-Storage-1::Image",
                "parameter_type": "string",
                "value": "overcloud-full"
            },
            {
                "constraints": [],
                "default": 5672,
                "description": "Set rabbit subscriber port, change this if using SSL",
                "hidden": null,
                "label": null,
                "name": "Compute-1::RabbitClientPort",
                "parameter_type": "number",
                "value": 5672
            },
            {
                "constraints": [],
                "default": "tgtadm",
                "description": "The iSCSI helper to use with cinder.",
                "hidden": null,
                "label": null,
                "name": "Cinder-Storage-1::CinderISCSIHelper",
                "parameter_type": "string",
                "value": "lioadm"
            },
            {
                "constraints": [],
                "default": "True",
                "description": null,
                "hidden": null,
                "label": null,
                "name": "Controller-1::NeutronEnableTunnelling",
                "parameter_type": "string",
                "value": "True"
            },
            {
                "constraints": [],
                "default": "br-ex",
                "description": "Interface where virtual ip will be assigned.",
                "hidden": null,
                "label": null,
                "name": "Controller-1::ControlVirtualInterface",
                "parameter_type": "string",
                "value": "br-ex"
            },
            {
                "constraints": [],
                "default": "false",
                "description": "Set to true to enable package installation via Puppet",
                "hidden": null,
                "label": null,
                "name": "Swift-Storage-1::EnablePackageInstall",
                "parameter_type": "boolean",
                "value": "false"
            },
            {
                "constraints": [],
                "default": false,
                "description": "Whether to enable or not the Rbd backend for Nova",
                "hidden": null,
                "label": null,
                "name": "Compute-1::NovaEnableRbdBackend",
                "parameter_type": "boolean",
                "value": false
            },
            {
                "constraints": [],
                "default": "False",
                "description": "Whether to enable l3-agent HA",
                "hidden": null,
                "label": null,
                "name": "Controller-1::NeutronL3HA",
                "parameter_type": "string",
                "value": "False"
            },
            {
                "constraints": [
                    {
                        "constraint_type": "custom_constraint",
                        "definition": "glance.image",
                        "description": null
                    }
                ],
                "default": "overcloud-control",
                "description": null,
                "hidden": null,
                "label": null,
                "name": "Controller-1::Image",
                "parameter_type": "string",
                "value": "overcloud-full"
            },
            {
                "constraints": [],
                "default": "unset",
                "description": "A random string to be used as a salt when hashing to determine mappings in the ring.",
                "hidden": true,
                "label": null,
                "name": "Swift-Storage-1::HashSuffix",
                "parameter_type": "string",
                "value": "unset"
            },
            {
                "constraints": [],
                "default": "",
                "description": "The Ceph monitors key. Can be created with ceph-authtool --gen-print-key.",
                "hidden": null,
                "label": null,
                "name": "CephMonKey",
                "parameter_type": "string",
                "value": ""
            },
            {
                "constraints": [],
                "default": "False",
                "description": null,
                "hidden": null,
                "label": null,
                "name": "Compute-1::NeutronDVR",
                "parameter_type": "string",
                "value": "False"
            },
            {
                "constraints": [],
                "default": "False",
                "description": "Whether to enable l3-agent HA",
                "hidden": null,
                "label": null,
                "name": "Compute-1::NeutronL3HA",
                "parameter_type": "string",
                "value": "False"
            },
            {
                "constraints": [],
                "default": "overcloud-cinder-volume",
                "description": null,
                "hidden": null,
                "label": null,
                "name": "Cinder-Storage-1::Image",
                "parameter_type": "string",
                "value": "overcloud-full"
            },
            {
                "constraints": [],
                "default": "datacentre",
                "description": "The Neutron ML2 and OpenVSwitch vlan mapping range to support. See the Neutron documentation for permitted values. Defaults to permitting any VLAN on the 'datacentre' physical network (See NeutronBridgeMappings).\n",
                "hidden": null,
                "label": null,
                "name": "Controller-1::NeutronNetworkVLANRanges",
                "parameter_type": "comma_delimited_list",
                "value": "datacentre"
            },
            {
                "constraints": [],
                "default": "",
                "description": "Keystone self-signed certificate authority certificate.",
                "hidden": null,
                "label": null,
                "name": "Controller-1::KeystoneCACertificate",
                "parameter_type": "string",
                "value": "-----BEGIN CERTIFICATE-----\nMIIDNzCCAh+gAwIBAgIBATANBgkqhkiG9w0BAQUFADBTMQswCQYDVQQGEwJYWDEO\nMAwGA1UECBMFVW5zZXQxDjAMBgNVBAcTBVVuc2V0MQ4wDAYDVQQKEwVVbnNldDEU\nMBIGA1UEAxMLS2V5c3RvbmUgQ0EwHhcNMTUxMDEyMTk0MTEzWhcNMjUxMDA5MTk0\nMTEzWjBTMQswCQYDVQQGEwJYWDEOMAwGA1UECBMFVW5zZXQxDjAMBgNVBAcTBVVu\nc2V0MQ4wDAYDVQQKEwVVbnNldDEUMBIGA1UEAxMLS2V5c3RvbmUgQ0EwggEiMA0G\nCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQDffc6+zTdbZ2+wKyocHpUG+ja9q7+Z\nuOOlTChM3MNhtgsjkw0f/REgNO4nruo2x+10iJu+57V/tRa03e0r3ZrklZOCg/BO\nz7ci9TN/FaNdzICSukr15gsnf1MaOJ+TbCi4tl2fT1cM358GXq13DoJp3vXWylJl\nPTbe/9FiGMN553Teb0QwmU/sHOKmXCy/WgzWzWbEb0pP8Jdxq+rtUc/FQAjvAxGd\nfpmY7IwiYbNa6B7XWAZ4rTTIudNDIrqpmdkpDLkQdQ6bAb0mz6su24kYK9M+ySCZ\nlnhd1lbtUB22hVmP0/zdlOu2qpnTpgJwJuOf8oc69iLdO/0/02Uhd6BFAgMBAAGj\nFjAUMBIGA1UdEwEB/wQIMAYBAf8CAQAwDQYJKoZIhvcNAQEFBQADggEBABaSXzDO\n0tgmEQJHYecXWoonKamH3F45eTP5bkKyDkg9UyFIjrdp8Hqb0odFz0wo/CIOscSV\nAfTKTX4nIwMiPwnz4Xz6PYEEXXOdfYtDKH6uAyiNiVxy6tGADncVjCoqA5RsB+2O\nL3RBgXcWAcqx+q65NGSuPxaQBfxniX28trLaPxhLyOe2WGmLj8cXm3krP2TuDBXs\nOtvpBwzt2Smcf7gAfeOW95ExvRsm3RCkWbKcxanB45zhigKsctZk9kxpSYTbFYC8\n2P/KbFTmAqxGA5jFC8YQR+tMw9k52mFRToS3uEtolVJjr7dRaf3+uoVN/fhFxB6S\nVcB6gpue73oImSg=\n-----END CERTIFICATE-----"
            },
            {
                "constraints": [],
                "default": [],
                "description": null,
                "hidden": null,
                "label": null,
                "name": "Ceph-Storage-1::removal_policies",
                "parameter_type": "json",
                "value": []
            },
            {
                "constraints": [],
                "default": "",
                "description": "Neutron ID for ctlplane network.",
                "hidden": null,
                "label": null,
                "name": "NeutronControlPlaneID",
                "parameter_type": "string",
                "value": "9a5cfe42-a58e-4957-b443-7c560fb711c3"
            },
            {
                "constraints": [],
                "default": "",
                "description": "If set, the public interface is a vlan with this device as the raw device.",
                "hidden": null,
                "label": null,
                "name": "Controller-1::NeutronPublicInterfaceRawDevice",
                "parameter_type": "string",
                "value": ""
            },
            {
                "constraints": [],
                "default": "",
                "description": "An exported storage device that should be mounted by Pacemaker as Glance storage. Effective when GlanceFilePcmkManage is true.\n",
                "hidden": null,
                "label": null,
                "name": "Controller-1::GlanceFilePcmkDevice",
                "parameter_type": "string",
                "value": ""
            },
            {
                "constraints": [],
                "default": "unset",
                "description": "Secret shared by the ceilometer services.",
                "hidden": true,
                "label": null,
                "name": "Controller-1::CeilometerMeteringSecret",
                "parameter_type": "string",
                "value": "128f8fa20a4d6cffbf0900b91488441f333a87ab"
            },
            {
                "constraints": [],
                "default": "guest",
                "description": null,
                "hidden": null,
                "label": null,
                "name": "Cinder-Storage-1::RabbitPassword",
                "parameter_type": "string",
                "value": "guest"
            },
            {
                "constraints": [],
                "default": false,
                "description": "Rabbit client subscriber parameter to specify an SSL connection to the RabbitMQ host.\n",
                "hidden": null,
                "label": null,
                "name": "Cinder-Storage-1::RabbitClientUseSSL",
                "parameter_type": "string",
                "value": false
            },
            {
                "constraints": [],
                "default": "unset",
                "description": "The password for the cinder service and db account, used by cinder-api.",
                "hidden": true,
                "label": null,
                "name": "Cinder-Storage-1::CinderPassword",
                "parameter_type": "string",
                "value": "unset"
            },
            {
                "constraints": [],
                "default": "",
                "description": "VLAN tag for creating a public VLAN. The tag will be used to create an access port on the exterior bridge for each control plane node, and that port will be given the IP address returned by neutron from the public network. Set CONTROLEXTRA=overcloud-vlan-port.yaml when compiling overcloud.yaml to include the deployment of VLAN ports to the control plane.\n",
                "hidden": null,
                "label": null,
                "name": "Controller-1::NeutronPublicInterfaceTag",
                "parameter_type": "string",
                "value": ""
            },
            {
                "constraints": [],
                "default": "ro_snmp_user",
                "description": "The user name for SNMPd with readonly rights running on all Overcloud nodes",
                "hidden": null,
                "label": null,
                "name": "Swift-Storage-1::SnmpdReadonlyUserName",
                "parameter_type": "string",
                "value": "ro_snmp_user"
            },
            {
                "constraints": [],
                "default": "nic1",
                "description": "What interface to bridge onto br-ex for network nodes.",
                "hidden": null,
                "label": null,
                "name": "Controller-1::NeutronPublicInterface",
                "parameter_type": "string",
                "value": "nic1"
            },
            {
                "constraints": [],
                "default": "",
                "description": "NFS servers used by Cinder NFS backend. Effective when CinderEnableNfsBackend is true.\n",
                "hidden": null,
                "label": null,
                "name": "Controller-1::CinderNfsServers",
                "parameter_type": "comma_delimited_list",
                "value": ""
            },
            {
                "constraints": [],
                "default": "9292",
                "description": "Glance port.",
                "hidden": null,
                "label": null,
                "name": "Cinder-Storage-1::GlancePort",
                "parameter_type": "string",
                "value": "9292"
            },
            {
                "constraints": [],
                "default": "unset",
                "description": "The password for the glance service and db account, used by the glance services.",
                "hidden": true,
                "label": null,
                "name": "Controller-1::GlancePassword",
                "parameter_type": "string",
                "value": "e1bacd9f4b05d97e723b61dae897e175dce0767e"
            },
            {
                "constraints": [],
                "default": "",
                "description": "Set to True to enable debugging on all services.",
                "hidden": null,
                "label": null,
                "name": "Compute-1::Debug",
                "parameter_type": "string",
                "value": ""
            },
            {
                "constraints": [],
                "default": "dhcp-option-force=26,1400",
                "description": "Dnsmasq options for neutron-dhcp-agent. The default value here forces MTU to be set to 1400 to account for the gre tunnel overhead.",
                "hidden": null,
                "label": null,
                "name": "Controller-1::NeutronDnsmasqOptions",
                "parameter_type": "string",
                "value": "dhcp-option-force=26,1400"
            },
            {
                "constraints": [],
                "default": false,
                "description": "Whether to enable or not the NFS backend for Cinder",
                "hidden": null,
                "label": null,
                "name": "Controller-1::CinderEnableNfsBackend",
                "parameter_type": "boolean",
                "value": false
            },
            {
                "constraints": [],
                "default": "vxlan,vlan,flat,gre",
                "description": "Comma-seperated list of network type driver entrypoints to be loaded.\n",
                "hidden": null,
                "label": null,
                "name": "Controller-1::NeutronTypeDrivers",
                "parameter_type": "comma_delimited_list",
                "value": "vxlan,vlan,flat,gre"
            },
            {
                "constraints": [
                    {
                        "constraint_type": "allowed_values",
                        "definition": [
                            "",
                            "Present"
                        ],
                        "description": null
                    }
                ],
                "default": "",
                "description": "Indicates whether the Compute agent is present and expects nova-compute to be configured accordingly",
                "hidden": null,
                "label": null,
                "name": "Compute-1::CeilometerComputeAgent",
                "parameter_type": "string",
                "value": ""
            },
            {
                "constraints": [],
                "default": "datacentre:br-ex",
                "description": "The OVS logical->physical bridge mappings to use. See the Neutron documentation for details. Defaults to mapping br-ex - the external bridge on hosts - to a physical name 'datacentre' which can be used to create provider networks (and we use this for the default floating network) - if changing this either use different post-install network scripts or be sure to keep 'datacentre' as a mapping network name.\n",
                "hidden": null,
                "label": null,
                "name": "Compute-1::NeutronBridgeMappings",
                "parameter_type": "string",
                "value": "datacentre:br-ex"
            },
            {
                "constraints": [],
                "default": "http",
                "description": "Protocol to use when connecting to glance, set to https for SSL.",
                "hidden": null,
                "label": null,
                "name": "Cinder-Storage-1::GlanceProtocol",
                "parameter_type": "string",
                "value": "http"
            },
            {
                "constraints": [],
                "default": {},
                "description": "NovaCompute specific configuration to inject into the cluster. Same\nstructure as ExtraConfig.\n",
                "hidden": null,
                "label": null,
                "name": "Compute-1::NovaComputeExtraConfig",
                "parameter_type": "json",
                "value": {}
            },
            {
                "constraints": [],
                "default": "%stackname%-objectstorage-%index%",
                "description": "Format for SwiftStorage node hostnames",
                "hidden": null,
                "label": null,
                "name": "ObjectStorageHostnameFormat",
                "parameter_type": "string",
                "value": "%stackname%-objectstorage-%index%"
            },
            {
                "constraints": [],
                "default": "unset",
                "description": "The password for the neutron service account, used by neutron agents.",
                "hidden": true,
                "label": null,
                "name": "Compute-1::NeutronPassword",
                "parameter_type": "string",
                "value": "e35d984c3e035a889d9a8b361f8e87176e220761"
            },
            {
                "constraints": [],
                "default": "false",
                "description": "Value of mount_check in Swift account/container/object -server.conf",
                "hidden": null,
                "label": null,
                "name": "Controller-1::SwiftMountCheck",
                "parameter_type": "boolean",
                "value": "false"
            },
            {
                "constraints": [],
                "default": 1024,
                "description": "Configures MySQL max_connections config setting",
                "hidden": null,
                "label": null,
                "name": "Controller-1::MysqlMaxConnections",
                "parameter_type": "number",
                "value": 1024
            },
            {
                "constraints": [],
                "default": "",
                "description": "Setting to a previously unused value during stack-update will trigger package update on all nodes\n",
                "hidden": null,
                "label": null,
                "name": "Controller-1::UpdateIdentifier",
                "parameter_type": "string",
                "value": ""
            },
            {
                "constraints": [
                    {
                        "constraint_type": "custom_constraint",
                        "definition": "nova.flavor",
                        "description": null
                    }
                ],
                "default": null,
                "description": "Flavor for Swift storage nodes to request when deploying.",
                "hidden": null,
                "label": null,
                "name": "Swift-Storage-1::Flavor",
                "parameter_type": "string",
                "value": "Flavor-4-x86_64-6144-40"
            },
            {
                "constraints": [],
                "default": [],
                "description": null,
                "hidden": null,
                "label": null,
                "name": "Cinder-Storage-1::removal_policies",
                "parameter_type": "json",
                "value": []
            },
            {
                "constraints": [],
                "default": 10,
                "description": "Partition Power to use when building Swift rings",
                "hidden": null,
                "label": null,
                "name": "Controller-1::SwiftPartPower",
                "parameter_type": "number",
                "value": 10
            },
            {
                "constraints": [],
                "default": {},
                "description": "Additional hieradata to inject into the cluster, note that\nControllerExtraConfig takes precedence over ExtraConfig.\n",
                "hidden": null,
                "label": null,
                "name": "Controller-1::ExtraConfig",
                "parameter_type": "json",
                "value": {}
            },
            {
                "constraints": [],
                "default": false,
                "description": "Whether to enable or not the Rbd backend for Cinder",
                "hidden": null,
                "label": null,
                "name": "Controller-1::CinderEnableRbdBackend",
                "parameter_type": "boolean",
                "value": false
            },
            {
                "constraints": [],
                "default": false,
                "description": "Whether to deploy Ceph Storage (OSD) on the Controller",
                "hidden": null,
                "label": null,
                "name": "Controller-1::EnableCephStorage",
                "parameter_type": "boolean",
                "value": false
            },
            {
                "constraints": [],
                "default": "br-ex",
                "description": "An OVS bridge to create for accessing external networks.",
                "hidden": null,
                "label": null,
                "name": "Compute-1::NeutronPhysicalBridge",
                "parameter_type": "string",
                "value": "br-ex"
            },
            {
                "constraints": [],
                "default": "unset",
                "description": "The password for the nova service account, used by nova-api.",
                "hidden": true,
                "label": null,
                "name": "Compute-1::NovaPassword",
                "parameter_type": "string",
                "value": "a5b263e90913ecfd93ded79c9062fbe04818a7dc"
            },
            {
                "constraints": [],
                "default": true,
                "description": "Whether to use Galera instead of regular MariaDB.",
                "hidden": null,
                "label": null,
                "name": "Controller-1::EnableGalera",
                "parameter_type": "boolean",
                "value": true
            },
            {
                "constraints": [],
                "default": "guest",
                "description": "The password for RabbitMQ",
                "hidden": true,
                "label": null,
                "name": "Compute-1::RabbitPassword",
                "parameter_type": "string",
                "value": "guest"
            },
            {
                "constraints": [],
                "default": "vms",
                "description": "The name of the Ceph RBD pool to use/create for Nova ephemeral disks",
                "hidden": null,
                "label": null,
                "name": "NovaRbdPoolName",
                "parameter_type": "string",
                "value": "vms"
            }
        ],
        "roles": [
            {
                "description": "OpenStack ceph storage node configured by Puppet",
                "name": "Ceph-Storage",
                "uuid": "8d0c85d8-7df0-4e28-9966-bc396eca8179",
                "version": 1
            },
            {
                "description": "OpenStack cinder storage configured by Puppet",
                "name": "Cinder-Storage",
                "uuid": "e720503c-23a8-44e7-a3ad-73d7f9299bd8",
                "version": 1
            },
            {
                "description": "OpenStack controller node configured by Puppet.\n",
                "name": "Controller",
                "uuid": "5fa76e40-e184-4612-96bb-1d34ddb28554",
                "version": 1
            },
            {
                "description": "OpenStack hypervisor node configured via Puppet.\n",
                "name": "Compute",
                "uuid": "be166fa3-8415-4394-9cb5-0acfcaa44449",
                "version": 1
            },
            {
                "description": "OpenStack swift storage node configured by Puppet",
                "name": "Swift-Storage",
                "uuid": "f79092de-d042-416d-a9f3-64cc9537c870",
                "version": 1
            }
        ],
        "updated_at": null,
        "uuid": "5393d0c1-001b-4b4b-99ed-dee163a8200f"
    }

    });
  });

  app.use('/fusor/api/openstack/deployments', deploymentPlanRouter);

};
