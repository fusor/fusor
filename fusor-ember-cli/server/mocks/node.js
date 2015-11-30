module.exports = function(app) {
  var express = require('express');
  var nodeRouter = express.Router();

  nodeRouter.get('/:id/nodes', function(req, res) {
    res.send({
      'nodes': [
        {
            "console_enabled": false,
            "created_at": "2015-10-12T20:00:58+00:00",
            "driver": "pxe_ssh",
            "driver_info": {
                "deploy_kernel": "69c1410b-2e59-4bad-b6ab-9a7570744fc1",
                "deploy_ramdisk": "7bcd5577-92fd-4793-a38d-acb183f4b1fb",
                "ssh_address": "sherr-desktop.usersys.redhat.com",
                "ssh_password": "******",
                "ssh_username": "root",
                "ssh_virt_type": "virsh"
            },
            "extra": {
                "block_devices": {
                    "serials": [
                        "QM00005"
                    ]
                },
                "hardware_swift_object": "extra_hardware-4b2c920a-3f81-4c6e-9449-89fe6d438318",
                "newly_discovered": "true"
            },
            "instance_info": {},
            "instance_uuid": null,
            "last_error": null,
            "links": [
                {
                    "href": "http://192.0.2.1:6385/v1/nodes/4b2c920a-3f81-4c6e-9449-89fe6d438318",
                    "rel": "self"
                },
                {
                    "href": "http://192.0.2.1:6385/nodes/4b2c920a-3f81-4c6e-9449-89fe6d438318",
                    "rel": "bookmark"
                }
            ],
            "maintenance": true,
            "maintenance_reason": "During sync_power_state, max retries exceeded for node 4b2c920a-3f81-4c6e-9449-89fe6d438318, node state None does not match expected state 'power off'. Updating DB state to 'None' Switching node to maintenance mode.",
            "ports": [
                {
                    "href": "http://192.0.2.1:6385/v1/nodes/4b2c920a-3f81-4c6e-9449-89fe6d438318/ports",
                    "rel": "self"
                },
                {
                    "href": "http://192.0.2.1:6385/nodes/4b2c920a-3f81-4c6e-9449-89fe6d438318/ports",
                    "rel": "bookmark"
                }
            ],
            "power_state": null,
            "properties": {
                "capabilities": "boot_option:local",
                "cpu_arch": "x86_64",
                "cpus": "4",
                "local_gb": "40",
                "memory_mb": "6144"
            },
            "provision_state": null,
            "provision_updated_at": "2015-10-13T15:27:31+00:00",
            "reservation": null,
            "target_power_state": null,
            "target_provision_state": null,
            "updated_at": "2015-10-13T15:27:31+00:00",
            "uuid": "4b2c920a-3f81-4c6e-9449-89fe6d438318"
        },
        {
            "console_enabled": false,
            "created_at": "2015-10-12T20:01:40+00:00",
            "driver": "pxe_ssh",
            "driver_info": {
                "deploy_kernel": "69c1410b-2e59-4bad-b6ab-9a7570744fc1",
                "deploy_ramdisk": "7bcd5577-92fd-4793-a38d-acb183f4b1fb",
                "ssh_address": "sherr-desktop.usersys.redhat.com",
                "ssh_password": "******",
                "ssh_username": "root",
                "ssh_virt_type": "virsh"
            },
            "extra": {
                "block_devices": {
                    "serials": [
                        "QM00005"
                    ]
                },
                "hardware_swift_object": "extra_hardware-133bcf86-63f8-4479-bba3-1eb3aa1bcfcf",
                "newly_discovered": "true"
            },
            "instance_info": {},
            "instance_uuid": null,
            "last_error": null,
            "links": [
                {
                    "href": "http://192.0.2.1:6385/v1/nodes/133bcf86-63f8-4479-bba3-1eb3aa1bcfcf",
                    "rel": "self"
                },
                {
                    "href": "http://192.0.2.1:6385/nodes/133bcf86-63f8-4479-bba3-1eb3aa1bcfcf",
                    "rel": "bookmark"
                }
            ],
            "maintenance": true,
            "maintenance_reason": "During sync_power_state, max retries exceeded for node 133bcf86-63f8-4479-bba3-1eb3aa1bcfcf, node state None does not match expected state 'power off'. Updating DB state to 'None' Switching node to maintenance mode.",
            "ports": [
                {
                    "href": "http://192.0.2.1:6385/v1/nodes/133bcf86-63f8-4479-bba3-1eb3aa1bcfcf/ports",
                    "rel": "self"
                },
                {
                    "href": "http://192.0.2.1:6385/nodes/133bcf86-63f8-4479-bba3-1eb3aa1bcfcf/ports",
                    "rel": "bookmark"
                }
            ],
            "power_state": null,
            "properties": {
                "capabilities": "boot_option:local",
                "cpu_arch": "x86_64",
                "cpus": "4",
                "local_gb": "40",
                "memory_mb": "6144"
            },
            "provision_state": null,
            "provision_updated_at": "2015-10-13T15:27:32+00:00",
            "reservation": null,
            "target_power_state": null,
            "target_provision_state": null,
            "updated_at": "2015-10-13T15:27:32+00:00",
            "uuid": "133bcf86-63f8-4479-bba3-1eb3aa1bcfcf"
        }
      ]
    });
  });

  nodeRouter.post('/:id/nodes', function(req, res) {
    res.status(201).send({
      "instance_uuid": null,
      "target_power_state": null,
      "maintenance": false,
      "uuid":"e18e5660-8b55-47b6-b032-44a51e02d6f2",
      "driver_info": {
        "ssh_username": "root",
        "deploy_kernel": "69c1410b-2e59-4bad-b6ab-9a7570744fc1",
        "deploy_ramdisk": "7bcd5577-92fd-4793-a38d-acb183f4b1fb",
        "ssh_password": "******",
        "ssh_virt_type": "virsh",
        "ssh_address": "sherr-desktop.usersys.redhat.com"
      },
      "target_provision_state": null,
      "updated_at": "2015-10-13T17:41:01+00:00",
      "last_error": null,
      "console_enabled": false,
      "extra": {
        "on_discovery": "true"
      },
      "driver": "pxe_ssh",
      "links": [
        {"href":"http://192.0.2.1:6385/v1/nodes/e18e5660-8b55-47b6-b032-44a51e02d6f2",
         "rel":"self"
        },
        {"href":"http://192.0.2.1:6385/nodes/e18e5660-8b55-47b6-b032-44a51e02d6f2",
         "rel":"bookmark"
        }
      ],
      "maintenance_reason": null,
      "properties": {
        "capabilities": "boot_option:local"
      },
      "provision_updated_at": "2015-10-13T17:40:59+00:00",
      "power_state": null,
      "provision_state": "manageable",
      "reservation":null,
      "created_at": "2015-10-13T17:40:59+00:00",
      "instance_info": {},
      "ports":[
          {"href": "http://192.0.2.1:6385/v1/nodes/e18e5660-8b55-47b6-b032-44a51e02d6f2/ports",
           "rel": "self"
          },
          {"href": "http://192.0.2.1:6385/nodes/e18e5660-8b55-47b6-b032-44a51e02d6f2/ports",
           "rel": "bookmark"
          }
      ]

    });

  });

  nodeRouter.get('/:id/nodes/:node_uuid/ready', function(req, res) {
    res.send({
      'node': {
        id: req.params.node_uuid,
        ready: true
      }
    });
  });

  app.use('/fusor/api/openstack/deployments', nodeRouter);
};
