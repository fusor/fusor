module.exports = function(app) {
  var express = require('express');
  var undercloudRouter = express.Router();

  //GET
  undercloudRouter.get('/:id/underclouds/:id', function(req, res) {
    res.send({
      'deployed': true,
      'undercloud_dns': '192.168.121.1',
      'overcloud_dns': '192.168.121.1',
      'satellite_dns': '192.168.121.1'
    });
  });

  //POST
  undercloudRouter.post('/:id/underclouds', function(req, res) {
    res.send({
      'undercloud': 2
    });
  });

  app.use('/fusor/api/openstack/deployments', undercloudRouter);
};
