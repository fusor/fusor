module.exports = function(app) {
  var express = require('express');
  var hostsRouter = express.Router();

  var hosts = [
        {
          id: 197,
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
          id: 927,
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
          id: 857,
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

  hostsRouter.get('/', function(req, res) {
    res.send({
      'hosts': hosts
    });
  });

  hostsRouter.post('/', function(req, res) {
    res.status(201).end();
  });

  hostsRouter.get('/:id', function(req, res) {
    res.send({
        id: req.params.id
    });
  });

  hostsRouter.put('/:id', function(req, res) {
    res.send({
      'host': {
        id: req.params.id
      }
    });
  });

  hostsRouter.delete('/:id', function(req, res) {
    res.status(204).end();
  });

  app.use('/api/v21/hosts', hostsRouter);
};
