module.exports = function(app) {
  var express = require('express');
  var deploymentsRouter = express.Router();

  var deployments = {
  "deployments": [
    {
      "id": 13,
      "name": "osp deployment",
      "description": "",
      "deploy_rhev": false,
      "deploy_cfme": false,
      "deploy_openstack": true,
      "rhev_engine_admin_password": null,
      "rhev_database_name": "Default",
      "rhev_cluster_name": "Default",
      "rhev_storage_name": "my_storage",
      "rhev_storage_type": null,
      "rhev_storage_address": null,
      "rhev_cpu_type": null,
      "rhev_share_path": null,
      "rhev_export_domain_name": "my_export",
      "rhev_export_domain_address": null,
      "rhev_export_domain_path": null,
      "rhev_local_storage_path": null,
      "rhev_gluster_node_name": null,
      "rhev_gluster_node_address": null,
      "rhev_gluster_ssh_port": null,
      "rhev_gluster_root_password": null,
      "rhev_is_self_hosted": false,
      "cfme_install_loc": "OpenStack",
      "foreman_task_uuid": null,
      "upstream_consumer_uuid": "15900031-27df-4004-be36-1203df10b238",
      "upstream_consumer_name": "jmagen2-rhci",
      "rhev_root_password": null,
      "cfme_root_password": "quantity', 'consumed",
      "cfme_admin_password": "quantity', 'consumed",
      "host_naming_scheme": "Freeform",
      "custom_preprend_name": null,
      "enable_access_insights": false,
      "cfme_address": null,
      "rhev_engine_host_id": null,
      "openstack_undercloud_password": "this-passwd-is-populated by fusor/server",
      "openstack_undercloud_ip_addr": null,
      "openstack_undercloud_user": null,
      "openstack_undercloud_user_password": null,
      "openstack_overcloud_address": null,
      "is_autogenerate_overcloud_password": null,
      "openstack_overcloud_password": null,
      "openstack_overcloud_interface": "eth1",
      "openstack_overcloud_private_net": "adf",
      "openstack_overcloud_float_net": "adf",
      "is_disconnected": false,
      "cdn_url": null,
      "manifest_file": null,
      "created_at": "2015-11-11T13:33:14Z",
      "updated_at": "2015-11-23T14:55:59Z",
      "organization_id": 1,
      "lifecycle_environment_id": 1,
      "discovered_host_id": null,
      "discovered_host_ids": [],
      "subscription_ids": [
        14,
        15
      ],
      "introspection_task_ids": []
    },
    {
      "id": 18,
      "name": "rhev and cfme deployment",
      "description": null,
      "deploy_rhev": true,
      "deploy_cfme": true,
      "deploy_openstack": false,
      "rhev_engine_admin_password": "11111111",
      "rhev_database_name": "Default",
      "rhev_cluster_name": "Default",
      "rhev_storage_name": "my_storage",
      "rhev_storage_type": "NFS",
      "rhev_storage_address": "adsf",
      "rhev_cpu_type": null,
      "rhev_share_path": "/333",
      "rhev_export_domain_name": "my_export",
      "rhev_export_domain_address": null,
      "rhev_export_domain_path": null,
      "rhev_local_storage_path": null,
      "rhev_gluster_node_name": null,
      "rhev_gluster_node_address": null,
      "rhev_gluster_ssh_port": null,
      "rhev_gluster_root_password": null,
      "rhev_is_self_hosted": false,
      "cfme_install_loc": null,
      "foreman_task_uuid": null,
      "upstream_consumer_uuid": "15900031-27df-4004-be36-1203df10b238",
      "upstream_consumer_name": "jmagen2-rhci",
      "rhev_root_password": "11111111",
      "cfme_root_password": null,
      "cfme_admin_password": null,
      "host_naming_scheme": "Freeform",
      "custom_preprend_name": null,
      "enable_access_insights": false,
      "cfme_address": null,
      "rhev_engine_host_id": 2,
      "openstack_undercloud_password": null,
      "openstack_undercloud_ip_addr": null,
      "openstack_undercloud_user": null,
      "openstack_undercloud_user_password": null,
      "openstack_overcloud_address": null,
      "is_autogenerate_overcloud_password": null,
      "openstack_overcloud_password": null,
      "openstack_overcloud_interface": null,
      "openstack_overcloud_private_net": null,
      "openstack_overcloud_float_net": null,
      "is_disconnected": false,
      "cdn_url": null,
      "manifest_file": null,
      "created_at": "2015-11-17T14:52:03Z",
      "updated_at": "2015-11-17T14:53:03Z",
      "organization_id": 1,
      "lifecycle_environment_id": 1,
      "discovered_host_id": 2,
      "discovered_host_ids": [
        6
      ],
      "subscription_ids": [
        10
      ],
      "introspection_task_ids": []
    },
    {
      "id": 9,
      "name": "already started deployment",
      "description": null,
      "deploy_rhev": false,
      "deploy_cfme": false,
      "deploy_openstack": true,
      "rhev_engine_admin_password": "adfadfadfad",
      "rhev_database_name": "Default",
      "rhev_cluster_name": "Default",
      "rhev_storage_name": "my_storage",
      "rhev_storage_type": "NFS",
      "rhev_storage_address": "adfadf",
      "rhev_cpu_type": null,
      "rhev_share_path": "/333",
      "rhev_export_domain_name": "my_export",
      "rhev_export_domain_address": null,
      "rhev_export_domain_path": null,
      "rhev_local_storage_path": null,
      "rhev_gluster_node_name": null,
      "rhev_gluster_node_address": null,
      "rhev_gluster_ssh_port": null,
      "rhev_gluster_root_password": null,
      "rhev_is_self_hosted": false,
      "cfme_install_loc": "OpenStack",
      "foreman_task_uuid": "db25a76f-e344-48ba-ac77-f29303586dbe",
      "upstream_consumer_uuid": "15900031-27df-4004-be36-1203df10b238",
      "upstream_consumer_name": "jmagen2-rhci",
      "rhev_root_password": "adfadfadf",
      "cfme_root_password": null,
      "cfme_admin_password": null,
      "host_naming_scheme": "Freeform",
      "custom_preprend_name": null,
      "enable_access_insights": false,
      "cfme_address": null,
      "rhev_engine_host_id": 4,
      "openstack_undercloud_password": null,
      "openstack_undercloud_ip_addr": null,
      "openstack_undercloud_user": null,
      "openstack_undercloud_user_password": null,
      "openstack_overcloud_address": null,
      "is_autogenerate_overcloud_password": null,
      "openstack_overcloud_password": null,
      "openstack_overcloud_interface": null,
      "openstack_overcloud_private_net": null,
      "openstack_overcloud_float_net": null,
      "is_disconnected": false,
      "cdn_url": null,
      "manifest_file": null,
      "created_at": "2015-11-10T10:35:15Z",
      "updated_at": "2015-11-19T13:04:38Z",
      "organization_id": 1,
      "lifecycle_environment_id": 1,
      "discovered_host_id": 4,
      "discovered_host_ids": [
        5
      ],
      "subscription_ids": [],
      "introspection_task_ids": []
    },
    {
      "id": 7,
      "name": "rhev only deployment",
      "description": null,
      "deploy_rhev": true,
      "deploy_cfme": false,
      "deploy_openstack": false,
      "rhev_engine_admin_password": "11111111",
      "rhev_database_name": "asdfadfadf",
      "rhev_cluster_name": "Default",
      "rhev_storage_name": "my_storage",
      "rhev_storage_type": "NFS",
      "rhev_storage_address": "adsfadf",
      "rhev_cpu_type": null,
      "rhev_share_path": "/333",
      "rhev_export_domain_name": "my_export",
      "rhev_export_domain_address": "adsadf",
      "rhev_export_domain_path": "/333",
      "rhev_local_storage_path": null,
      "rhev_gluster_node_name": null,
      "rhev_gluster_node_address": null,
      "rhev_gluster_ssh_port": null,
      "rhev_gluster_root_password": null,
      "rhev_is_self_hosted": false,
      "cfme_install_loc": "RHEV",
      "foreman_task_uuid": null,
      "upstream_consumer_uuid": "15900031-27df-4004-be36-1203df10b238",
      "upstream_consumer_name": "jmagen2-rhci",
      "rhev_root_password": "11111111",
      "cfme_root_password": "adfadfadsf",
      "cfme_admin_password": "adsfadfadsf",
      "host_naming_scheme": "Freeform",
      "custom_preprend_name": null,
      "enable_access_insights": false,
      "cfme_address": null,
      "rhev_engine_host_id": 2,
      "openstack_undercloud_password": null,
      "openstack_undercloud_ip_addr": null,
      "openstack_undercloud_user": null,
      "openstack_undercloud_user_password": null,
      "openstack_overcloud_address": null,
      "is_autogenerate_overcloud_password": null,
      "openstack_overcloud_password": null,
      "openstack_overcloud_interface": null,
      "openstack_overcloud_private_net": null,
      "openstack_overcloud_float_net": null,
      "is_disconnected": false,
      "cdn_url": null,
      "manifest_file": null,
      "created_at": "2015-11-09T17:02:50Z",
      "updated_at": "2015-11-23T14:55:35Z",
      "organization_id": 1,
      "lifecycle_environment_id": null,
      "discovered_host_id": 2,
      "discovered_host_ids": [
        4
      ],
      "subscription_ids": [],
      "introspection_task_ids": []
    }
  ],
  "organizations": [
    {
      "id": 1,
      "name": "Default Organization",
      "title": "Default Organization",
      "label": "Default_Organization",
      "description": null,
      "created_at": "2015-11-05T08:40:31Z",
      "updated_at": "2015-11-05T08:45:36Z"
    }
  ],
  "lifecycle_environments": [
    {
      "id": 1,
      "name": "Library",
      "label": "Library",
      "description": null,
      "library": true,
      "prior_id": null,
      "prior": null,
      "created_at": "2015-11-05T08:40:34Z",
      "updated_at": "2015-11-05T08:40:34Z"
    }
  ],
  "subscriptions": [
    {
      "id": 14,
      "deployment_id": 13,
      "contract_number": "10593540",
      "product_name": "Red Hat Cloud Infrastructure with Smart Management, Premium (2-sockets)",
      "quantity_attached": 1
    },
    {
      "id": 15,
      "deployment_id": 13,
      "contract_number": "10670000",
      "product_name": "Red Hat Cloud Infrastructure with Smart Management, Premium (2-sockets)",
      "quantity_attached": 1
    },
    {
      "id": 10,
      "deployment_id": 18,
      "contract_number": "10593540",
      "product_name": "Red Hat Cloud Infrastructure with Smart Management, Premium (2-sockets)",
      "quantity_attached": 3
    }
  ],
  "discovered_hosts": [
    {
      "id": 2,
      "name": "mac5254001c9566",
      "type": "Host::Discovered",
      "ip": "192.168.152.12",
      "mac": "52:54:00:1c:95:66",
      "created_at": "2015-11-05T09:05:43Z",
      "updated_at": "2015-11-15T09:20:38Z",
      "cpus": 1,
      "memory_human_size": "1.96 GB",
      "disks_human_size": "10 GB",
      "disk_count": 1,
      "subnet_to_s": "default (192.168.152.0/24)",
      "is_virtual": "true",
      "environment_name": null,
      "hostgroup_name": null,
      "compute_resource_name": null,
      "domain_name": null,
      "is_managed": false,
      "is_discovered": true
    },
    {
      "id": 6,
      "name": "mac5254006a8c68",
      "type": "Host::Discovered",
      "ip": "192.168.152.22",
      "mac": "52:54:00:6a:8c:68",
      "created_at": "2015-11-12T12:31:44Z",
      "updated_at": "2015-11-22T12:47:03Z",
      "cpus": 1,
      "memory_human_size": "1.96 GB",
      "disks_human_size": "10 GB",
      "disk_count": 1,
      "subnet_to_s": "default (192.168.152.0/24)",
      "is_virtual": "true",
      "environment_name": null,
      "hostgroup_name": null,
      "compute_resource_name": null,
      "domain_name": null,
      "is_managed": false,
      "is_discovered": true
    },
    {
      "id": 4,
      "name": "mac525400a2a5c2.example.com",
      "type": "Host::Managed",
      "ip": "192.168.152.17",
      "mac": "52:54:00:a2:a5:c2",
      "created_at": "2015-11-09T09:40:36Z",
      "updated_at": "2015-11-23T14:42:17Z",
      "cpus": "1",
      "memory_human_size": "1.83 GB",
      "disks_human_size": "10737418240",
      "disk_count": null,
      "subnet_to_s": "default (192.168.152.0/24)",
      "is_virtual": "true",
      "environment_name": "KT_Default_Organization_Library_Fusor_Puppet_Content_2",
      "hostgroup_name": "Fusor Base/aaaaa/RHEV-Engine",
      "compute_resource_name": null,
      "domain_name": "example.com",
      "is_managed": true,
      "is_discovered": false
    },
    {
      "id": 5,
      "name": "mac525400fb6b8b.example.com",
      "type": "Host::Managed",
      "ip": "192.168.152.18",
      "mac": "52:54:00:fb:6b:8b",
      "created_at": "2015-11-09T09:40:46Z",
      "updated_at": "2015-11-23T14:34:16Z",
      "cpus": "1",
      "memory_human_size": "1.83 GB",
      "disks_human_size": "10737418240",
      "disk_count": null,
      "subnet_to_s": "default (192.168.152.0/24)",
      "is_virtual": "true",
      "environment_name": "KT_Default_Organization_Library_Fusor_Puppet_Content_2",
      "hostgroup_name": "Fusor Base/aaaaa/RHEV-Hypervisor",
      "compute_resource_name": null,
      "domain_name": "example.com",
      "is_managed": true,
      "is_discovered": false
    }
  ]
};

  deploymentsRouter.get('/', function(req, res) {
    res.send(deployments);
  });

  deploymentsRouter.post('/', function(req, res) {
    res.send({
      'deployment': {
        id: 22
      }
    });
  });

  deploymentsRouter.get('/13', function(req, res) {
    res.send(deployments['deployments'][0]);
  });
  deploymentsRouter.get('/18', function(req, res) {
    res.send(deployments['deployments'][1]);
  });
  deploymentsRouter.get('/9', function(req, res) {
    res.send(deployments['deployments'][2]);
  });
  deploymentsRouter.get('/7', function(req, res) {
    res.send(deployments['deployments'][3]);
  });

  deploymentsRouter.put('/:id', function(req, res) {
    res.send({
      'deployment': {
        id: req.params.id
      }
    });
  });

  deploymentsRouter.put('/:id/deploy', function(req, res) {
    res.send({
      'deployment': {
        id: req.params.id
      }
    });
  });


  deploymentsRouter.delete('/:id', function(req, res) {
    res.status(204).end();
  });

  app.use('/fusor/api/v21/deployments', deploymentsRouter);
};
