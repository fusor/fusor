module.exports = function(app) {
  var express = require('express');
  var discoveredHostsRouter = express.Router();

  var discoveredHosts = [
        {
          id: 1,
          name: '22:99:23:A6:2B:BC',
          ip: '10.0.0.1',
          mac: '22:99:23:A6:2B:BC',
          last_report: '2015-02-15 12:10:00',
          subnet_id: '1',
          subnet_name: 'SAT Lab 180',
          memory: '8 GB',
          disk_count: '1',
          disks_size: '500 GB',
          cpus: '2',
          organization_id: 1,
          organization_name: 'Default_Organization',
          location_id: 3,
          location_name: 'TLV'
       },
       {
          id: 2,
          name: '52:54:00:D3:3E:DF',
          ip: '10.0.1.5',
          mac: '52:54:00:D3:3E:DF',
          last_report: '2015-02-15 12:10:00',
          subnet_id: '1',
          subnet_name: 'SAT Lab 180',
          memory: '8 GB',
          disk_count: '1',
          disks_size: '500 GB',
          cpus: '2',
          organization_id: 1,
          organization_name: 'Default_Organization',
          location_id: 3,
          location_name: 'TLV'
       },
       {
          id: 3,
          name: '19:88:00:A5:7D:EE',
          ip: '10.0.2.7',
          mac: '19:88:00:A5:7D:EE',
          last_report: '2015-02-15 12:10:00',
          subnet_id: '1',
          subnet_name: 'SAT Lab 180',
          memory: '8 GB',
          disk_count: '1',
          disks_size: '500 GB',
          cpus: '2',
          organization_id: 1,
          organization_name: 'Default_Organization',
          location_id: 3,
          location_name: 'TLV'
       }
  ];

  discoveredHostsRouter.get('/', function(req, res) {
    res.send({
      'results': discoveredHosts
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

  app.use('/api/v2/discovered_hosts', discoveredHostsRouter);
};
