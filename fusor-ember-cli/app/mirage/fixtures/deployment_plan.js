export default  [{
  "name": "overcloud",
  "parameters": {
    "AdminPassword": {
      "Default": "changeme",
      "Description": "The password for the keystone admin account, used for monitoring, querying neutron etc.",
      "Label": "AdminPassword",
      "NoEcho": "true",
      "Type": "String"
    },
    "AdminToken": {
      "Default": "CuVyGZqfwZdbTwUaX9euaPGaA",
      "Description": "The keystone auth secret.",
      "Label": "AdminToken",
      "NoEcho": "true",
      "Type": "String"
    },
    "BlockStorageCount": {
      "Default": 0,
      "Description": "",
      "Label": "BlockStorageCount",
      "NoEcho": "false",
      "Type": "Number"
    },
    "BlockStorageExtraConfig": {
      "Default": {},
      "Description": "BlockStorage specific configuration to inject into the cluster. Same\nstructure as ExtraConfig.\n",
      "Label": "BlockStorageExtraConfig",
      "NoEcho": "false",
      "Type": "Json"
    },
    "BlockStorageHostnameFormat": {
      "Default": "%stackname%-blockstorage-%index%",
      "Description": "Format for BlockStorage node hostnames",
      "Label": "BlockStorageHostnameFormat",
      "NoEcho": "false",
      "Type": "String"
    },
    "BlockStorageImage": {
      "Default": "overcloud-full",
      "Description": "",
      "Label": "BlockStorageImage",
      "NoEcho": "false",
      "Type": "String"
    },
    "BlockStorageRemovalPolicies": {
      "Default": [],
      "Description": "List of resources to be removed from BlockStorageResourceGroup when doing an update which requires removal of specific resources.\n",
      "Label": "BlockStorageRemovalPolicies",
      "NoEcho": "false",
      "Type": "Json"
    },
    "BlockStorageSchedulerHints": {
      "Default": {},
      "Description": "Optional scheduler hints to pass to nova",
      "Label": "BlockStorageSchedulerHints",
      "NoEcho": "false",
      "Type": "Json"
    },
    "CeilometerBackend": {
      "Default": "mongodb",
      "Description": "The ceilometer backend type.",
      "Label": "CeilometerBackend",
      "NoEcho": "false",
      "Type": "String"
    },
    "CeilometerComputeAgent": {
      "AllowedValues": ["", "Present"],
      "Default": "",
      "Description": "Indicates whether the Compute agent is present and expects nova-compute to be configured accordingly",
      "Label": "CeilometerComputeAgent",
      "NoEcho": "false",
      "Type": "String"
    },
    "CeilometerMeteringSecret": {
      "Default": "Hvkf9Rzz6tHF6UVsErPjCE3uM",
      "Description": "Secret shared by the ceilometer services.",
      "Label": "CeilometerMeteringSecret",
      "NoEcho": "true",
      "Type": "String"
    },
    "CeilometerPassword": {
      "Default": "2zgV6yAE2d3JTskTnBUsvzDf4",
      "Description": "The password for the ceilometer service account.",
      "Label": "CeilometerPassword",
      "NoEcho": "true",
      "Type": "String"
    },
    "CephAdminKey": {
      "Default": "",
      "Description": "The Ceph admin client key. Can be created with ceph-authtool --gen-print-key.",
      "Label": "CephAdminKey",
      "NoEcho": "true",
      "Type": "String"
    },
    "CephClientKey": {
      "Default": "",
      "Description": "The Ceph client key. Can be created with ceph-authtool --gen-print-key. Currently only used for external Ceph deployments to create the openstack user keyring.",
      "Label": "CephClientKey",
      "NoEcho": "true",
      "Type": "String"
    },
    "CephClusterFSID": {
      "Default": "",
      "Description": "The Ceph cluster FSID. Must be a UUID.",
      "Label": "CephClusterFSID",
      "NoEcho": "false",
      "Type": "String"
    },
    "CephExternalMonHost": {
      "Default": "",
      "Description": "List of externally managed Ceph Mon Host IPs. Only used for external Ceph deployments.",
      "Label": "CephExternalMonHost",
      "NoEcho": "false",
      "Type": "String"
    },
    "CephMonKey": {
      "Default": "",
      "Description": "The Ceph monitors key. Can be created with ceph-authtool --gen-print-key.",
      "Label": "CephMonKey",
      "NoEcho": "true",
      "Type": "String"
    },
    "CephStorageCount": {
      "Default": 0,
      "Description": "",
      "Label": "CephStorageCount",
      "NoEcho": "false",
      "Type": "Number"
    },
    "CephStorageExtraConfig": {
      "Default": {},
      "Description": "CephStorage specific configuration to inject into the cluster. Same\nstructure as ExtraConfig.\n",
      "Label": "CephStorageExtraConfig",
      "NoEcho": "false",
      "Type": "Json"
    },
    "CephStorageHostnameFormat": {
      "Default": "%stackname%-cephstorage-%index%",
      "Description": "Format for CephStorage node hostnames",
      "Label": "CephStorageHostnameFormat",
      "NoEcho": "false",
      "Type": "String"
    },
    "CephStorageImage": {
      "Default": "overcloud-full",
      "Description": "",
      "Label": "CephStorageImage",
      "NoEcho": "false",
      "Type": "String"
    },
    "CephStorageRemovalPolicies": {
      "Default": [],
      "Description": "List of resources to be removed from CephStorageResourceGroup when doing an update which requires removal of specific resources.\n",
      "Label": "CephStorageRemovalPolicies",
      "NoEcho": "false",
      "Type": "Json"
    },
    "CephStorageSchedulerHints": {
      "Default": {},
      "Description": "Optional scheduler hints to pass to nova",
      "Label": "CephStorageSchedulerHints",
      "NoEcho": "false",
      "Type": "Json"
    },
    "CinderEnableIscsiBackend": {
      "Default": true,
      "Description": "Whether to enable or not the Iscsi backend for Cinder",
      "Label": "CinderEnableIscsiBackend",
      "NoEcho": "false",
      "Type": "Boolean"
    },
    "CinderEnableNfsBackend": {
      "Default": false,
      "Description": "Whether to enable or not the NFS backend for Cinder",
      "Label": "CinderEnableNfsBackend",
      "NoEcho": "false",
      "Type": "Boolean"
    },
    "CinderEnableRbdBackend": {
      "Default": false,
      "Description": "Whether to enable or not the Rbd backend for Cinder",
      "Label": "CinderEnableRbdBackend",
      "NoEcho": "false",
      "Type": "Boolean"
    },
    "CinderISCSIHelper": {
      "Default": "lioadm",
      "Description": "The iSCSI helper to use with cinder.",
      "Label": "CinderISCSIHelper",
      "NoEcho": "false",
      "Type": "String"
    },
    "CinderLVMLoopDeviceSize": {
      "Default": 10280,
      "Description": "The size of the loopback file used by the cinder LVM driver.",
      "Label": "CinderLVMLoopDeviceSize",
      "NoEcho": "false",
      "Type": "Number"
    },
    "CinderNfsMountOptions": {
      "Default": "",
      "Description": "Mount options for NFS mounts used by Cinder NFS backend. Effective when CinderEnableNfsBackend is true.\n",
      "Label": "CinderNfsMountOptions",
      "NoEcho": "false",
      "Type": "String"
    },
    "CinderNfsServers": {
      "Default": "",
      "Description": "NFS servers used by Cinder NFS backend. Effective when CinderEnableNfsBackend is true.\n",
      "Label": "CinderNfsServers",
      "NoEcho": "false",
      "Type": "CommaDelimitedList"
    },
    "CinderPassword": {
      "Default": "Ma3kfBHqB8FDb2hgJa3sPUAzh",
      "Description": "The password for the cinder service account, used by cinder-api.",
      "Label": "CinderPassword",
      "NoEcho": "true",
      "Type": "String"
    },
    "CloudDomain": {
      "Default": "localdomain",
      "Description": "The DNS domain used for the hosts. This should match the dhcp_domain configured in the Undercloud neutron. Defaults to localdomain.\n",
      "Label": "CloudDomain",
      "NoEcho": "false",
      "Type": "String"
    },
    "CloudName": {
      "Default": "overcloud",
      "Description": "The DNS name of this cloud. E.g. ci-overcloud.tripleo.org",
      "Label": "CloudName",
      "NoEcho": "false",
      "Type": "String"
    },
    "ComputeCount": {"Default": 1, "Description": "", "Label": "ComputeCount", "NoEcho": "false", "Type": "Number"},
    "ComputeHostnameFormat": {
      "Default": "%stackname%-compute-%index%",
      "Description": "Format for Compute node hostnames",
      "Label": "ComputeHostnameFormat",
      "NoEcho": "false",
      "Type": "String"
    },
    "ComputeRemovalPolicies": {
      "Default": [],
      "Description": "List of resources to be removed from ComputeResourceGroup when doing an update which requires removal of specific resources.\n",
      "Label": "ComputeRemovalPolicies",
      "NoEcho": "false",
      "Type": "Json"
    },
    "ControlFixedIPs": {
      "Default": [],
      "Description": "Should be used for arbitrary ips.",
      "Label": "ControlFixedIPs",
      "NoEcho": "false",
      "Type": "Json"
    },
    "ControlVirtualInterface": {
      "Default": "br-ex",
      "Description": "Interface where virtual ip will be assigned.",
      "Label": "ControlVirtualInterface",
      "NoEcho": "false",
      "Type": "String"
    },
    "ControllerCount": {
      "Default": 1,
      "Description": "",
      "Label": "ControllerCount",
      "MinValue": 1,
      "NoEcho": "false",
      "Type": "Number"
    },
    "ControllerEnableCephStorage": {
      "Default": false,
      "Description": "Whether to deploy Ceph Storage (OSD) on the Controller",
      "Label": "ControllerEnableCephStorage",
      "NoEcho": "false",
      "Type": "Boolean"
    },
    "ControllerEnableSwiftStorage": {
      "Default": true,
      "Description": "Whether to enable Swift Storage on the Controller",
      "Label": "ControllerEnableSwiftStorage",
      "NoEcho": "false",
      "Type": "Boolean"
    },
    "ControllerHostnameFormat": {
      "Default": "%stackname%-controller-%index%",
      "Description": "Format for Controller node hostnames",
      "Label": "ControllerHostnameFormat",
      "NoEcho": "false",
      "Type": "String"
    },
    "ControllerRemovalPolicies": {
      "Default": [],
      "Description": "List of resources to be removed from ControllerResourceGroup when doing an update which requires removal of specific resources.\n",
      "Label": "ControllerRemovalPolicies",
      "NoEcho": "false",
      "Type": "Json"
    },
    "ControllerSchedulerHints": {
      "Default": {},
      "Description": "Optional scheduler hints to pass to nova",
      "Label": "ControllerSchedulerHints",
      "NoEcho": "false",
      "Type": "Json"
    },
    "CorosyncIPv6": {
      "Default": false,
      "Description": "Enable IPv6 in Corosync",
      "Label": "CorosyncIPv6",
      "NoEcho": "false",
      "Type": "Boolean"
    },
    "Debug": {
      "Default": "",
      "Description": "Set to True to enable debugging on all services.",
      "Label": "Debug",
      "NoEcho": "false",
      "Type": "String"
    },
    "DeployIdentifier": {
      "Default": "",
      "Description": "Setting this to a unique value will re-run any deployment tasks which perform configuration on a Heat stack-update.\n",
      "Label": "DeployIdentifier",
      "NoEcho": "false",
      "Type": "String"
    },
    "EnableFencing": {
      "Default": false,
      "Description": "Whether to enable fencing in Pacemaker or not.",
      "Label": "EnableFencing",
      "NoEcho": "false",
      "Type": "Boolean"
    },
    "EnableGalera": {
      "Default": true,
      "Description": "Whether to use Galera instead of regular MariaDB.",
      "Label": "EnableGalera",
      "NoEcho": "false",
      "Type": "Boolean"
    },
    "ExtraConfig": {
      "Default": {},
      "Description": "Additional configuration to inject into the cluster. The format required\nmay be implementation specific, e.g puppet hieradata.  Any role specific\nExtraConfig, e.g controllerExtraConfig takes precedence over ExtraConfig.\n",
      "Label": "ExtraConfig",
      "NoEcho": "false",
      "Type": "Json"
    },
    "FencingConfig": {
      "Default": {},
      "Description": "Pacemaker fencing configuration. The JSON should have\nthe following structure:\n  {\n    \"devices\": [\n      {\n        \"agent\": \"AGENT_NAME\",\n        \"host_mac\": \"HOST_MAC_ADDRESS\",\n        \"params\": {\"PARAM_NAME\": \"PARAM_VALUE\"}\n      }\n    ]\n  }\nFor instance:\n  {\n    \"devices\": [\n      {\n        \"agent\": \"fence_xvm\",\n        \"host_mac\": \"52:54:00:aa:bb:cc\",\n        \"params\": {\n          \"multicast_address\": \"225.0.0.12\",\n          \"port\": \"baremetal_0\",\n          \"manage_fw\": true,\n          \"manage_key_file\": true,\n          \"key_file\": \"/etc/fence_xvm.key\",\n          \"key_file_password\": \"abcdef\"\n        }\n      }\n    ]\n  }\n",
      "Label": "FencingConfig",
      "NoEcho": "false",
      "Type": "Json"
    },
    "GlanceBackend": {
      "AllowedValues": ["swift", "file", "rbd"],
      "Default": "swift",
      "Description": "The short name of the Glance backend to use. Should be one of swift, rbd or file",
      "Label": "GlanceBackend",
      "NoEcho": "false",
      "Type": "String"
    },
    "GlanceLogFile": {
      "Default": "",
      "Description": "The filepath of the file to use for logging messages from Glance.",
      "Label": "GlanceLogFile",
      "NoEcho": "false",
      "Type": "String"
    },
    "GlanceNotifierStrategy": {
      "Default": "noop",
      "Description": "Strategy to use for Glance notification queue",
      "Label": "GlanceNotifierStrategy",
      "NoEcho": "false",
      "Type": "String"
    },
    "GlancePassword": {
      "Default": "EBNnAsWxuzAHfqG8trjjMDsCu",
      "Description": "The password for the glance service account, used by the glance services.",
      "Label": "GlancePassword",
      "NoEcho": "true",
      "Type": "String"
    },
    "HAProxySyslogAddress": {
      "Default": "/dev/log",
      "Description": "Syslog address where HAproxy will send its log",
      "Label": "HAProxySyslogAddress",
      "NoEcho": "false",
      "Type": "String"
    },
    "HeatPassword": {
      "Default": "BEhHu9UhKd4ZnQwmtCUFsZrh4",
      "Description": "The password for the Heat service account, used by the Heat services.",
      "Label": "HeatPassword",
      "NoEcho": "true",
      "Type": "String"
    },
    "HeatStackDomainAdminPassword": {
      "Default": "fpRbkRneNJVutk4QqK8xYR3Qm",
      "Description": "Password for heat_stack_domain_admin user.",
      "Label": "HeatStackDomainAdminPassword",
      "NoEcho": "true",
      "Type": "String"
    },
    "HorizonAllowedHosts": {
      "Default": "*",
      "Description": "A list of IP/Hostname allowed to connect to horizon",
      "Label": "HorizonAllowedHosts",
      "NoEcho": "false",
      "Type": "CommaDelimitedList"
    },
    "HypervisorNeutronPhysicalBridge": {
      "Default": "br-ex",
      "Description": "An OVS bridge to create on each hypervisor. This defaults to br-ex the same as the control plane nodes, as we have a uniform configuration of the openvswitch agent. Typically should not need to be changed.\n",
      "Label": "HypervisorNeutronPhysicalBridge",
      "NoEcho": "false",
      "Type": "String"
    },
    "HypervisorNeutronPublicInterface": {
      "Default": "nic1",
      "Description": "What interface to add to the HypervisorNeutronPhysicalBridge.",
      "Label": "HypervisorNeutronPublicInterface",
      "NoEcho": "false",
      "Type": "String"
    },
    "ImageUpdatePolicy": {
      "Default": "REBUILD_PRESERVE_EPHEMERAL",
      "Description": "What policy to use when reconstructing instances. REBUILD for rebuilds, REBUILD_PRESERVE_EPHEMERAL to preserve /mnt.",
      "Label": "ImageUpdatePolicy",
      "NoEcho": "false",
      "Type": "String"
    },
    "InstanceNameTemplate": {
      "Default": "instance-%08x",
      "Description": "Template string to be used to generate instance names",
      "Label": "InstanceNameTemplate",
      "NoEcho": "false",
      "Type": "String"
    },
    "InternalApiVirtualFixedIPs": {
      "Default": [],
      "Description": "Control the IP allocation for the InternalApiVirtualInterface port. E.g. [{'ip_address':'1.2.3.4'}]\n",
      "Label": "InternalApiVirtualFixedIPs",
      "NoEcho": "false",
      "Type": "Json"
    },
    "KeyName": {
      "CustomConstraint": "nova.keypair",
      "Default": "default",
      "Description": "Name of an existing EC2 KeyPair to enable SSH access to the instances",
      "Label": "KeyName",
      "NoEcho": "false",
      "Type": "String"
    },
    "KeystoneCACertificate": {
      "Default": "",
      "Description": "Keystone self-signed certificate authority certificate.",
      "Label": "KeystoneCACertificate",
      "NoEcho": "false",
      "Type": "String"
    },
    "KeystoneNotificationDriver": {
      "Default": ["messaging"],
      "Description": "Comma-separated list of Oslo notification drivers used by Keystone",
      "Label": "KeystoneNotificationDriver",
      "NoEcho": "false",
      "Type": "CommaDelimitedList"
    },
    "KeystoneNotificationFormat": {
      "AllowedValues": ["basic", "cadf"],
      "Default": "basic",
      "Description": "The Keystone notification format",
      "Label": "KeystoneNotificationFormat",
      "NoEcho": "false",
      "Type": "String"
    },
    "KeystoneSSLCertificate": {
      "Default": "",
      "Description": "Keystone certificate for verifying token validity.",
      "Label": "KeystoneSSLCertificate",
      "NoEcho": "false",
      "Type": "String"
    },
    "KeystoneSSLCertificateKey": {
      "Default": "",
      "Description": "Keystone key for signing tokens.",
      "Label": "KeystoneSSLCertificateKey",
      "NoEcho": "true",
      "Type": "String"
    },
    "KeystoneSigningCertificate": {
      "Default": "",
      "Description": "Keystone certificate for verifying token validity.",
      "Label": "KeystoneSigningCertificate",
      "NoEcho": "false",
      "Type": "String"
    },
    "KeystoneSigningKey": {
      "Default": "",
      "Description": "Keystone key for signing tokens.",
      "Label": "KeystoneSigningKey",
      "NoEcho": "true",
      "Type": "String"
    },
    "ManageFirewall": {
      "Default": false,
      "Description": "Whether to manage IPtables rules.",
      "Label": "ManageFirewall",
      "NoEcho": "false",
      "Type": "Boolean"
    },
    "MemcachedIPv6": {
      "Default": false,
      "Description": "Enable IPv6 features in Memcached.",
      "Label": "MemcachedIPv6",
      "NoEcho": "false",
      "Type": "Boolean"
    },
    "MongoDbIPv6": {
      "Default": false,
      "Description": "Enable IPv6 if MongoDB VIP is IPv6",
      "Label": "MongoDbIPv6",
      "NoEcho": "false",
      "Type": "Boolean"
    },
    "MongoDbNoJournal": {
      "Default": false,
      "Description": "Should MongoDb journaling be disabled",
      "Label": "MongoDbNoJournal",
      "NoEcho": "false",
      "Type": "Boolean"
    },
    "MysqlInnodbBufferPoolSize": {
      "Default": 0,
      "Description": "Specifies the size of the buffer pool in megabytes. Setting to zero should be interpreted as \"no value\" and will defer to the lower level default.\n",
      "Label": "MysqlInnodbBufferPoolSize",
      "NoEcho": "false",
      "Type": "Number"
    },
    "MysqlMaxConnections": {
      "Default": 4096,
      "Description": "Configures MySQL max_connections config setting",
      "Label": "MysqlMaxConnections",
      "NoEcho": "false",
      "Type": "Number"
    },
    "NeutronAgentExtensions": {
      "Default": "qos",
      "Description": "Comma-separated list of extensions enabled for the Neutron agents.\n",
      "Label": "NeutronAgentExtensions",
      "NoEcho": "false",
      "Type": "CommaDelimitedList"
    },
    "NeutronAgentMode": {
      "Default": "dvr_snat",
      "Description": "Agent mode for the neutron-l3-agent on the controller hosts",
      "Label": "NeutronAgentMode",
      "NoEcho": "false",
      "Type": "String"
    },
    "NeutronAllowL3AgentFailover": {
      "Default": "False",
      "Description": "Allow automatic l3-agent failover",
      "Label": "NeutronAllowL3AgentFailover",
      "NoEcho": "false",
      "Type": "String"
    },
    "NeutronBridgeMappings": {
      "Default": "datacentre:br-ex",
      "Description": "The OVS logical-\u003Ephysical bridge mappings to use. See the Neutron documentation for details. Defaults to mapping br-ex - the external bridge on hosts - to a physical name 'datacentre' which can be used to create provider networks (and we use this for the default floating network) - if changing this either use different post-install network scripts or be sure to keep 'datacentre' as a mapping network name.\n",
      "Label": "NeutronBridgeMappings",
      "NoEcho": "false",
      "Type": "CommaDelimitedList"
    },
    "NeutronComputeAgentMode": {
      "Default": "dvr",
      "Description": "Agent mode for the neutron-l3-agent on the compute hosts",
      "Label": "NeutronComputeAgentMode",
      "NoEcho": "false",
      "Type": "String"
    },
    "NeutronControlPlaneID": {
      "Default": "ctlplane",
      "Description": "Neutron ID or name for ctlplane network.",
      "Label": "NeutronControlPlaneID",
      "NoEcho": "false",
      "Type": "String"
    },
    "NeutronCorePlugin": {
      "Default": "ml2",
      "Description": "The core plugin for Neutron. The value should be the entrypoint to be loaded\nfrom neutron.core_plugins namespace.\n",
      "Label": "NeutronCorePlugin",
      "NoEcho": "false",
      "Type": "String"
    },
    "NeutronDVR": {
      "Default": "False",
      "Description": "Whether to configure Neutron Distributed Virtual Routers",
      "Label": "NeutronDVR",
      "NoEcho": "false",
      "Type": "String"
    },
    "NeutronDhcpAgentsPerNetwork": {
      "Default": 1,
      "Description": "The number of neutron dhcp agents to schedule per network",
      "Label": "NeutronDhcpAgentsPerNetwork",
      "NoEcho": "false",
      "Type": "Number"
    },
    "NeutronDnsmasqOptions": {
      "Default": "dhcp-option-force=26,%MTU%",
      "Description": "Dnsmasq options for neutron-dhcp-agent. The default value here forces MTU to be set to the value of NeutronTenantMtu, which should be set to account for tunnel overhead.\n",
      "Label": "NeutronDnsmasqOptions",
      "NoEcho": "false",
      "Type": "String"
    },
    "NeutronEnableIsolatedMetadata": {
      "Default": "False",
      "Description": "If True, DHCP provide metadata route to VM.",
      "Label": "NeutronEnableIsolatedMetadata",
      "NoEcho": "false",
      "Type": "String"
    },
    "NeutronEnableL2Pop": {
      "Default": "False",
      "Description": "Enable/disable the L2 population feature in the Neutron agents.\n",
      "Label": "NeutronEnableL2Pop",
      "NoEcho": "false",
      "Type": "String"
    },
    "NeutronEnableTunnelling": {
      "Default": "True",
      "Description": "",
      "Label": "NeutronEnableTunnelling",
      "NoEcho": "false",
      "Type": "String"
    },
    "NeutronExternalNetworkBridge": {
      "Default": "br-ex",
      "Description": "Name of bridge used for external network traffic.",
      "Label": "NeutronExternalNetworkBridge",
      "NoEcho": "false",
      "Type": "String"
    },
    "NeutronFlatNetworks": {
      "Default": "datacentre",
      "Description": "If set, flat networks to configure in neutron plugins. Defaults to 'datacentre' to permit external network creation.\n",
      "Label": "NeutronFlatNetworks",
      "NoEcho": "false",
      "Type": "CommaDelimitedList"
    },
    "NeutronL3HA": {
      "Default": "False",
      "Description": "Whether to enable l3-agent HA",
      "Label": "NeutronL3HA",
      "NoEcho": "false",
      "Type": "String"
    },
    "NeutronMechanismDrivers": {
      "Default": "openvswitch",
      "Description": "The mechanism drivers for the Neutron tenant network.\n",
      "Label": "NeutronMechanismDrivers",
      "NoEcho": "false",
      "Type": "CommaDelimitedList"
    },
    "NeutronMetadataProxySharedSecret": {
      "Default": "A2kEkckqfAzxcdVEJtnWj4hGP",
      "Description": "Shared secret to prevent spoofing",
      "Label": "NeutronMetadataProxySharedSecret",
      "NoEcho": "true",
      "Type": "String"
    },
    "NeutronNetworkType": {
      "Default": "vxlan",
      "Description": "The tenant network type for Neutron.",
      "Label": "NeutronNetworkType",
      "NoEcho": "false",
      "Type": "CommaDelimitedList"
    },
    "NeutronNetworkVLANRanges": {
      "Default": "datacentre:1:1000",
      "Description": "The Neutron ML2 and OpenVSwitch vlan mapping range to support. See the Neutron documentation for permitted values. Defaults to permitting any VLAN on the 'datacentre' physical network (See NeutronBridgeMappings).\n",
      "Label": "NeutronNetworkVLANRanges",
      "NoEcho": "false",
      "Type": "CommaDelimitedList"
    },
    "NeutronPassword": {
      "Default": "9n3AfD2b9zfBrmmBHwHyc7TgV",
      "Description": "The password for the neutron service account, used by neutron agents.",
      "Label": "NeutronPassword",
      "NoEcho": "true",
      "Type": "String"
    },
    "NeutronPluginExtensions": {
      "Default": "qos,port_security",
      "Description": "Comma-separated list of extensions enabled for the Neutron plugin.\n",
      "Label": "NeutronPluginExtensions",
      "NoEcho": "false",
      "Type": "CommaDelimitedList"
    },
    "NeutronPublicInterface": {
      "Default": "nic2",
      "Description": "What interface to bridge onto br-ex for network nodes.",
      "Label": "NeutronPublicInterface",
      "NoEcho": "false",
      "Type": "String"
    },
    "NeutronPublicInterfaceDefaultRoute": {
      "Default": "",
      "Description": "A custom default route for the NeutronPublicInterface.",
      "Label": "NeutronPublicInterfaceDefaultRoute",
      "NoEcho": "false",
      "Type": "String"
    },
    "NeutronPublicInterfaceIP": {
      "Default": "",
      "Description": "A custom IP address to put onto the NeutronPublicInterface.",
      "Label": "NeutronPublicInterfaceIP",
      "NoEcho": "false",
      "Type": "String"
    },
    "NeutronPublicInterfaceRawDevice": {
      "Default": "",
      "Description": "If set, the public interface is a vlan with this device as the raw device.",
      "Label": "NeutronPublicInterfaceRawDevice",
      "NoEcho": "false",
      "Type": "String"
    },
    "NeutronPublicInterfaceTag": {
      "Default": "",
      "Description": "VLAN tag for creating a public VLAN. The tag will be used to create an access port on the exterior bridge for each control plane node, and that port will be given the IP address returned by neutron from the public network. Set CONTROLEXTRA=overcloud-vlan-port.yaml when compiling overcloud.yaml to include the deployment of VLAN ports to the control plane.\n",
      "Label": "NeutronPublicInterfaceTag",
      "NoEcho": "false",
      "Type": "String"
    },
    "NeutronServicePlugins": {
      "Default": "router,qos",
      "Description": "Comma-separated list of service plugin entrypoints to be loaded from the\nneutron.service_plugins namespace.\n",
      "Label": "NeutronServicePlugins",
      "NoEcho": "false",
      "Type": "CommaDelimitedList"
    },
    "NeutronTenantMtu": {
      "Default": 1400,
      "Description": "The default MTU for tenant networks. For VXLAN/GRE tunneling, this should be at least 50 bytes smaller than the MTU on the physical network. This value will be used to set the MTU on the virtual Ethernet device. This number is related to the value of NeutronDnsmasqOptions, since that will determine the MTU that is assigned to the VM host through DHCP.\n",
      "Label": "NeutronTenantMtu",
      "NoEcho": "false",
      "Type": "Number"
    },
    "NeutronTunnelIdRanges": {
      "Default": ["1:4094"],
      "Description": "Comma-separated list of \u003Ctun_min\u003E:\u003Ctun_max\u003E tuples enumerating ranges\nof GRE tunnel IDs that are available for tenant network allocation\n",
      "Label": "NeutronTunnelIdRanges",
      "NoEcho": "false",
      "Type": "CommaDelimitedList"
    },
    "NeutronTunnelTypes": {
      "Default": "vxlan",
      "Description": "The tunnel types for the Neutron tenant network.\n",
      "Label": "NeutronTunnelTypes",
      "NoEcho": "false",
      "Type": "CommaDelimitedList"
    },
    "NeutronTypeDrivers": {
      "Default": "vxlan,vlan,flat,gre",
      "Description": "Comma-separated list of network type driver entrypoints to be loaded.\n",
      "Label": "NeutronTypeDrivers",
      "NoEcho": "false",
      "Type": "CommaDelimitedList"
    },
    "NeutronVniRanges": {
      "Default": ["1:4094"],
      "Description": "Comma-separated list of \u003Cvni_min\u003E:\u003Cvni_max\u003E tuples enumerating ranges\nof VXLAN VNI IDs that are available for tenant network allocation\n",
      "Label": "NeutronVniRanges",
      "NoEcho": "false",
      "Type": "CommaDelimitedList"
    },
    "NovaComputeDriver": {
      "Default": "libvirt.LibvirtDriver",
      "Description": "",
      "Label": "NovaComputeDriver",
      "NoEcho": "false",
      "Type": "String"
    },
    "NovaComputeExtraConfig": {
      "Default": {},
      "Description": "NovaCompute specific configuration to inject into the cluster. Same\nstructure as ExtraConfig.\n",
      "Label": "NovaComputeExtraConfig",
      "NoEcho": "false",
      "Type": "Json"
    },
    "NovaComputeLibvirtType": {
      "Default": "kvm",
      "Description": "",
      "Label": "NovaComputeLibvirtType",
      "NoEcho": "false",
      "Type": "String"
    },
    "NovaComputeLibvirtVifDriver": {
      "Default": "",
      "Description": "Libvirt VIF driver configuration for the network",
      "Label": "NovaComputeLibvirtVifDriver",
      "NoEcho": "false",
      "Type": "String"
    },
    "NovaComputeSchedulerHints": {
      "Default": {},
      "Description": "Optional scheduler hints to pass to nova",
      "Label": "NovaComputeSchedulerHints",
      "NoEcho": "false",
      "Type": "Json"
    },
    "NovaEnableRbdBackend": {
      "Default": false,
      "Description": "Whether to enable or not the Rbd backend for Nova",
      "Label": "NovaEnableRbdBackend",
      "NoEcho": "false",
      "Type": "Boolean"
    },
    "NovaIPv6": {
      "Default": false,
      "Description": "Enable IPv6 features in Nova",
      "Label": "NovaIPv6",
      "NoEcho": "false",
      "Type": "Boolean"
    },
    "NovaImage": {
      "CustomConstraint": "glance.image",
      "Default": "overcloud-full",
      "Description": "",
      "Label": "NovaImage",
      "NoEcho": "false",
      "Type": "String"
    },
    "NovaOVSBridge": {
      "Default": "br-int",
      "Description": "Name of integration bridge used by Open vSwitch",
      "Label": "NovaOVSBridge",
      "NoEcho": "false",
      "Type": "String"
    },
    "NovaPassword": {
      "Default": "QCn7EHTkMMrJHH7Upp6txzUYX",
      "Description": "The password for the nova service account, used by nova-api.",
      "Label": "NovaPassword",
      "NoEcho": "true",
      "Type": "String"
    },
    "NovaSecurityGroupAPI": {
      "Default": "neutron",
      "Description": "The full class name of the security API class",
      "Label": "NovaSecurityGroupAPI",
      "NoEcho": "false",
      "Type": "String"
    },
    "NtpServer": {
      "Default": "",
      "Description": "Comma-separated list of ntp servers",
      "Label": "NtpServer",
      "NoEcho": "false",
      "Type": "CommaDelimitedList"
    },
    "ObjectStorageCount": {
      "Default": 0,
      "Description": "",
      "Label": "ObjectStorageCount",
      "NoEcho": "false",
      "Type": "Number"
    },
    "ObjectStorageExtraConfig": {
      "Default": {},
      "Description": "ObjectStorage specific configuration to inject into the cluster. Same\nstructure as ExtraConfig.\n",
      "Label": "ObjectStorageExtraConfig",
      "NoEcho": "false",
      "Type": "Json"
    },
    "ObjectStorageHostnameFormat": {
      "Default": "%stackname%-objectstorage-%index%",
      "Description": "Format for SwiftStorage node hostnames",
      "Label": "ObjectStorageHostnameFormat",
      "NoEcho": "false",
      "Type": "String"
    },
    "ObjectStorageRemovalPolicies": {
      "Default": [],
      "Description": "List of resources to be removed from ObjectStorageResourceGroup when doing an update which requires removal of specific resources.\n",
      "Label": "ObjectStorageRemovalPolicies",
      "NoEcho": "false",
      "Type": "Json"
    },
    "ObjectStorageSchedulerHints": {
      "Default": {},
      "Description": "Optional scheduler hints to pass to nova",
      "Label": "ObjectStorageSchedulerHints",
      "NoEcho": "false",
      "Type": "Json"
    },
    "OvercloudBlockStorageFlavor": {
      "CustomConstraint": "nova.flavor",
      "Default": "Flavor-16-x86_64-16384-99",
      "Description": "Flavor for block storage nodes to request when deploying.",
      "Label": "OvercloudBlockStorageFlavor",
      "NoEcho": "false",
      "Type": "String"
    },
    "OvercloudCephStorageFlavor": {
      "CustomConstraint": "nova.flavor",
      "Default": "Flavor-16-x86_64-16384-99",
      "Description": "Flavor for Ceph storage nodes to request when deploying.",
      "Label": "OvercloudCephStorageFlavor",
      "NoEcho": "false",
      "Type": "String"
    },
    "OvercloudComputeFlavor": {
      "CustomConstraint": "nova.flavor",
      "Default": "Flavor-16-x86_64-16384-99",
      "Description": "Use this flavor",
      "Label": "OvercloudComputeFlavor",
      "NoEcho": "false",
      "Type": "String"
    },
    "OvercloudControlFlavor": {
      "CustomConstraint": "nova.flavor",
      "Default": "Flavor-16-x86_64-16384-99",
      "Description": "Flavor for control nodes to request when deploying.",
      "Label": "OvercloudControlFlavor",
      "NoEcho": "false",
      "Type": "String"
    },
    "OvercloudSwiftStorageFlavor": {
      "CustomConstraint": "nova.flavor",
      "Default": "Flavor-16-x86_64-16384-99",
      "Description": "Flavor for Swift storage nodes to request when deploying.",
      "Label": "OvercloudSwiftStorageFlavor",
      "NoEcho": "false",
      "Type": "String"
    },
    "PublicVirtualFixedIPs": {
      "Default": [],
      "Description": "Control the IP allocation for the PublicVirtualInterface port. E.g. [{'ip_address':'1.2.3.4'}]\n",
      "Label": "PublicVirtualFixedIPs",
      "NoEcho": "false",
      "Type": "Json"
    },
    "PublicVirtualInterface": {
      "Default": "br-ex",
      "Description": "Specifies the interface where the public-facing virtual ip will be assigned. This should be int_public when a VLAN is being used.\n",
      "Label": "PublicVirtualInterface",
      "NoEcho": "false",
      "Type": "String"
    },
    "PurgeFirewallRules": {
      "Default": false,
      "Description": "Whether IPtables rules should be purged before setting up the ones.",
      "Label": "PurgeFirewallRules",
      "NoEcho": "false",
      "Type": "Boolean"
    },
    "RabbitClientPort": {
      "Default": 5672,
      "Description": "Set rabbit subscriber port, change this if using SSL",
      "Label": "RabbitClientPort",
      "NoEcho": "false",
      "Type": "Number"
    },
    "RabbitClientUseSSL": {
      "Default": false,
      "Description": "Rabbit client subscriber parameter to specify an SSL connection to the RabbitMQ host.\n",
      "Label": "RabbitClientUseSSL",
      "NoEcho": "false",
      "Type": "String"
    },
    "RabbitCookieSalt": {
      "Default": "unset",
      "Description": "Salt for the rabbit cookie, change this to force the randomly generated rabbit cookie to change.",
      "Label": "RabbitCookieSalt",
      "NoEcho": "false",
      "Type": "String"
    },
    "RabbitFDLimit": {
      "Default": 16384,
      "Description": "Configures RabbitMQ FD limit",
      "Label": "RabbitFDLimit",
      "NoEcho": "false",
      "Type": "String"
    },
    "RabbitIPv6": {
      "Default": false,
      "Description": "Enable IPv6 in RabbitMQ",
      "Label": "RabbitIPv6",
      "NoEcho": "false",
      "Type": "Boolean"
    },
    "RabbitPassword": {
      "Default": "guest",
      "Description": "The password for RabbitMQ",
      "Label": "RabbitPassword",
      "NoEcho": "true",
      "Type": "String"
    },
    "RabbitUserName": {
      "Default": "guest",
      "Description": "The username for RabbitMQ",
      "Label": "RabbitUserName",
      "NoEcho": "false",
      "Type": "String"
    },
    "RedisPassword": {
      "Default": "Rhq8Fd7eEIoPP821Ui",
      "Description": "The password for Redis",
      "Label": "RedisPassword",
      "NoEcho": "true",
      "Type": "String"
    },
    "ServerMetadata": {
      "Default": {},
      "Description": "Extra properties or metadata passed to Nova for the created nodes in the overcloud. It's accessible via the Nova metadata API.\n",
      "Label": "ServerMetadata",
      "NoEcho": "false",
      "Type": "Json"
    },
    "ServiceNetMap": {
      "Default": {
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
      "Description": "Mapping of service_name -\u003E network name. Typically set via parameter_defaults in the resource registry.",
      "Label": "ServiceNetMap",
      "NoEcho": "false",
      "Type": "Json"
    },
    "SnmpdReadonlyUserName": {
      "Default": "ro_snmp_user",
      "Description": "The user name for SNMPd with readonly rights running on all Overcloud nodes",
      "Label": "SnmpdReadonlyUserName",
      "NoEcho": "false",
      "Type": "String"
    },
    "SnmpdReadonlyUserPassword": {
      "Default": "password",
      "Description": "The user password for SNMPd with readonly rights running on all Overcloud nodes",
      "Label": "SnmpdReadonlyUserPassword",
      "NoEcho": "true",
      "Type": "String"
    },
    "StorageMgmtVirtualFixedIPs": {
      "Default": [],
      "Description": "Control the IP allocation for the StorageMgmgVirtualInterface port. E.g. [{'ip_address':'1.2.3.4'}]\n",
      "Label": "StorageMgmtVirtualFixedIPs",
      "NoEcho": "false",
      "Type": "Json"
    },
    "StorageVirtualFixedIPs": {
      "Default": [],
      "Description": "Control the IP allocation for the StorageVirtualInterface port. E.g. [{'ip_address':'1.2.3.4'}]\n",
      "Label": "StorageVirtualFixedIPs",
      "NoEcho": "false",
      "Type": "Json"
    },
    "SwiftHashSuffix": {
      "Default": "JN273288Xt3JTBqnE8RBsrYze",
      "Description": "A random string to be used as a salt when hashing to determine mappings in the ring.",
      "Label": "SwiftHashSuffix",
      "NoEcho": "true",
      "Type": "String"
    },
    "SwiftMinPartHours": {
      "Default": 1,
      "Description": "The minimum time (in hours) before a partition in a ring can be moved following a rebalance.",
      "Label": "SwiftMinPartHours",
      "NoEcho": "false",
      "Type": "Number"
    },
    "SwiftMountCheck": {
      "Default": "false",
      "Description": "Value of mount_check in Swift account/container/object -server.conf",
      "Label": "SwiftMountCheck",
      "NoEcho": "false",
      "Type": "Boolean"
    },
    "SwiftPartPower": {
      "Default": 10,
      "Description": "Partition Power to use when building Swift rings",
      "Label": "SwiftPartPower",
      "NoEcho": "false",
      "Type": "Number"
    },
    "SwiftPassword": {
      "Default": "KfqyTxGtQ9y7P6yCK2m7n2xMz",
      "Description": "The password for the swift service account, used by the swift proxy services.",
      "Label": "SwiftPassword",
      "NoEcho": "true",
      "Type": "String"
    },
    "SwiftReplicas": {
      "Default": 3,
      "Description": "How many replicas to use in the swift rings.",
      "Label": "SwiftReplicas",
      "NoEcho": "false",
      "Type": "Number"
    },
    "SwiftStorageImage": {
      "Default": "overcloud-full",
      "Description": "",
      "Label": "SwiftStorageImage",
      "NoEcho": "false",
      "Type": "String"
    },
    "TimeZone": {
      "Default": "UTC",
      "Description": "The timezone to be set on nodes.",
      "Label": "TimeZone",
      "NoEcho": "false",
      "Type": "String"
    },
    "UpdateIdentifier": {
      "Default": "",
      "Description": "Setting to a previously unused value during stack-update will trigger package update on all nodes\n",
      "Label": "UpdateIdentifier",
      "NoEcho": "false",
      "Type": "String"
    },
    "controllerExtraConfig": {
      "Default": {},
      "Description": "Controller specific configuration to inject into the cluster. Same\nstructure as ExtraConfig.\n",
      "Label": "controllerExtraConfig",
      "NoEcho": "false",
      "Type": "Json"
    },
    "controllerImage": {
      "CustomConstraint": "glance.image",
      "Default": "overcloud-full",
      "Description": "",
      "Label": "controllerImage",
      "NoEcho": "false",
      "Type": "String"
    }
  },
  "roles": ["Controller", "Compute", "BlockStorage", "ObjectStorage", "CephStorage"]
}];
