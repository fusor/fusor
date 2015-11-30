module.exports = function(app) {
  var express = require('express');
  var hostgroupsRouter = express.Router();

  var hostgroups = {
  "hostgroups": [
    {
      "id": 1,
      "name": "Fusor Base",
      "title": "Fusor Base",
      "parent_id": null,
      "created_at": "2015-11-05T08:45:35Z",
      "updated_at": "2015-11-05T08:45:35Z",
      "location_ids": [
        2
      ],
      "organization_ids": [
        1
      ],
      "puppetclass_ids": [],
      "config_group_ids": [],
      "domain_id": 1,
      "subnet_id": 1
    },
    {
      "id": 5,
      "name": "aaaaa",
      "title": "Fusor Base/aaaaa",
      "parent_id": 1,
      "created_at": "2015-11-10T15:16:45Z",
      "updated_at": "2015-11-10T15:16:45Z",
      "location_ids": [],
      "organization_ids": [
        1
      ],
      "puppetclass_ids": [],
      "config_group_ids": [],
      "domain_id": 1,
      "subnet_id": 1
    },
    {
      "id": 6,
      "name": "RHEV-Engine",
      "title": "Fusor Base/aaaaa/RHEV-Engine",
      "parent_id": 5,
      "created_at": "2015-11-10T15:16:46Z",
      "updated_at": "2015-11-10T15:16:46Z",
      "location_ids": [],
      "organization_ids": [
        1
      ],
      "puppetclass_ids": [
        8,
        3,
        4,
        5
      ],
      "config_group_ids": [],
      "domain_id": 1,
      "subnet_id": 1
    },
    {
      "id": 7,
      "name": "RHEV-Hypervisor",
      "title": "Fusor Base/aaaaa/RHEV-Hypervisor",
      "parent_id": 5,
      "created_at": "2015-11-10T15:16:49Z",
      "updated_at": "2015-11-10T15:16:50Z",
      "location_ids": [],
      "organization_ids": [
        1
      ],
      "puppetclass_ids": [
        8,
        9
      ],
      "config_group_ids": [],
      "domain_id": 1,
      "subnet_id": 1
    },
    {
      "id": 2,
      "name": "rhev only222",
      "title": "Fusor Base/rhev only222",
      "parent_id": 1,
      "created_at": "2015-11-08T23:27:50Z",
      "updated_at": "2015-11-08T23:27:50Z",
      "location_ids": [],
      "organization_ids": [
        1
      ],
      "puppetclass_ids": [
        1
      ],
      "config_group_ids": [],
      "domain_id": 1,
      "subnet_id": 1
    },
    {
      "id": 3,
      "name": "RHEV-Engine",
      "title": "Fusor Base/rhev only222/RHEV-Engine",
      "parent_id": 2,
      "created_at": "2015-11-08T23:27:50Z",
      "updated_at": "2015-11-08T23:27:50Z",
      "location_ids": [],
      "organization_ids": [
        1
      ],
      "puppetclass_ids": [
        8,
        3,
        4,
        5
      ],
      "config_group_ids": [],
      "domain_id": 1,
      "subnet_id": 1
    },
    {
      "id": 4,
      "name": "RHEV-Hypervisor",
      "title": "Fusor Base/rhev only222/RHEV-Hypervisor",
      "parent_id": 2,
      "created_at": "2015-11-08T23:27:56Z",
      "updated_at": "2015-11-08T23:27:56Z",
      "location_ids": [],
      "organization_ids": [
        1
      ],
      "puppetclass_ids": [
        8,
        9
      ],
      "config_group_ids": [],
      "domain_id": 1,
      "subnet_id": 1
    },
    {
      "id": 8,
      "name": "testnew",
      "title": "Fusor Base/testnew",
      "parent_id": 1,
      "created_at": "2015-11-10T16:18:01Z",
      "updated_at": "2015-11-10T16:18:01Z",
      "location_ids": [],
      "organization_ids": [
        1
      ],
      "puppetclass_ids": [],
      "config_group_ids": [],
      "domain_id": 1,
      "subnet_id": 1
    },
    {
      "id": 9,
      "name": "OpenStack-Undercloud",
      "title": "Fusor Base/testnew/OpenStack-Undercloud",
      "parent_id": 8,
      "created_at": "2015-11-10T16:18:03Z",
      "updated_at": "2015-11-10T16:18:03Z",
      "location_ids": [],
      "organization_ids": [
        1
      ],
      "puppetclass_ids": [],
      "config_group_ids": [],
      "domain_id": 1,
      "subnet_id": 1
    }
  ],
  "locations": [
    {
      "id": 2,
      "name": "Default Location",
      "created_at": "2015-11-05T08:40:32Z",
      "updated_at": "2015-11-05T08:45:37Z"
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
  "domains": [
    {
      "id": 1,
      "name": "example.com",
      "fullname": "Default domain used for provisioning",
      "dns_id": 1,
      "hosts_count": 4,
      "hostgroups_count": 9,
      "created_at": "2015-11-05T08:44:16Z",
      "updated_at": "2015-11-05T08:45:30Z"
    }
  ],
  "subnets": [
    {
      "id": 1,
      "name": "default",
      "network": "192.168.152.0",
      "cidr": 24,
      "mask": "255.255.255.0",
      "priority": null,
      "vlanid": null,
      "gateway": "192.168.152.1",
      "dns_primary": "192.168.152.10",
      "dns_secondary": null,
      "from": "192.168.152.11",
      "to": "192.168.152.254",
      "created_at": "2015-11-05T08:45:30Z",
      "updated_at": "2015-11-05T08:45:30Z"
    }
  ],
  "puppetclasses": [
    {
      "id": 8,
      "name": "ovirt",
      "created_at": "2015-11-05T08:45:37Z",
      "updated_at": "2015-11-10T15:32:40Z"
    },
    {
      "id": 3,
      "name": "ovirt::engine::config",
      "created_at": "2015-11-05T08:45:37Z",
      "updated_at": "2015-11-10T15:32:40Z"
    },
    {
      "id": 4,
      "name": "ovirt::engine::packages",
      "created_at": "2015-11-05T08:45:37Z",
      "updated_at": "2015-11-10T15:32:40Z"
    },
    {
      "id": 5,
      "name": "ovirt::engine::setup",
      "created_at": "2015-11-05T08:45:37Z",
      "updated_at": "2015-11-10T15:32:42Z"
    },
    {
      "id": 9,
      "name": "ovirt::hypervisor::packages",
      "created_at": "2015-11-05T08:45:37Z",
      "updated_at": "2015-11-10T15:17:04Z"
    },
    {
      "id": 1,
      "name": "access_insights_client",
      "created_at": "2015-11-05T08:44:46Z",
      "updated_at": "2015-11-08T23:28:25Z"
    }
  ]
};

  hostgroupsRouter.get('/', function(req, res) {
    res.send(hostgroups);
  });

  hostgroupsRouter.post('/', function(req, res) {
    res.status(201).end();
  });

  hostgroupsRouter.get('/:id', function(req, res) {
    res.send({
        id: req.params.id
    });
  });

  hostgroupsRouter.put('/:id', function(req, res) {
    res.send({
      'lifecycle_environment': {
        id: req.params.id
      }
    });
  });

  hostgroupsRouter.delete('/:id', function(req, res) {
    res.status(204).end();
  });

  app.use('/api/v21/hostgroups', hostgroupsRouter);
};
