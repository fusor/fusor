module.exports = function(app) {
  var express = require('express');
  var discoveredHostsRouter = express.Router();

  var discoveredHosts = [
        {
            "id": 2,
            "name": "mac5254007d02be",
            "type": "Host::Discovered",
            "ip": "192.168.152.12",
            "mac": "52:54:00:7d:02:be",
            "created_at": "2015-10-18T13:27:59Z",
            "updated_at": "2015-10-18T13:27:59Z",
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
            "id": 3,
            "name": "mac525400ab9e78",
            "type": "Host::Discovered",
            "ip": "192.168.152.14",
            "mac": "52:54:00:ab:9e:78",
            "created_at": "2015-10-18T13:28:15Z",
            "updated_at": "2015-10-18T13:28:16Z",
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
            "id": 5,
            "name": "mac525400c5fc31",
            "type": "Host::Discovered",
            "ip": "192.168.152.18",
            "mac": "52:54:00:c5:fc:31",
            "created_at": "2015-10-19T10:32:20Z",
            "updated_at": "2015-10-19T10:32:20Z",
            "cpus": 4,
            "memory_human_size": "7.8 GB",
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
            "name": "mac525400ebc504",
            "type": "Host::Discovered",
            "ip": "192.168.152.16",
            "mac": "52:54:00:eb:c5:04",
            "created_at": "2015-10-19T10:31:21Z",
            "updated_at": "2015-10-19T10:31:21Z",
            "cpus": 4,
            "memory_human_size": "7.8 GB",
            "disks_human_size": "10 GB",
            "disk_count": 1,
            "subnet_to_s": "default (192.168.152.0/24)",
            "is_virtual": "false",
            "environment_name": null,
            "hostgroup_name": null,
            "compute_resource_name": null,
            "domain_name": null,
            "is_managed": false,
            "is_discovered": true
        }
  ];

  discoveredHostsRouter.get('/', function(req, res) {
    res.send({
      'discovered_hosts': discoveredHosts
    });
  });

  discoveredHostsRouter.post('/', function(req, res) {
    res.status(201).end();
  });

  discoveredHostsRouter.get('/:id', function(req, res) {
    res.send({
        id: req.params.id
    });
  });

  discoveredHostsRouter.put('/:id', function(req, res) {
    res.send({
      'discovered_host': {
        id: req.params.id
      }
    });
  });

  discoveredHostsRouter.delete('/:id', function(req, res) {
    res.status(204).end();
  });

  app.use('/api/v21aaaa/discovered_hosts', discoveredHostsRouter);
};
