module.exports = function(app) {
  var express = require('express');
  var undercloudRouter = express.Router();

  //GET
  undercloudRouter.get('/:id/underclouds/:id', function(req, res) {
    res.send({
      'deployed': true,
      'failed': false
    });
  });

  //POST
  undercloudRouter.post('/:id/underclouds', function(req, res) {
    res.send({
      'undercloud': 2
    });
  });

  app.use('/fusor/api222/openstack/deployments', undercloudRouter);
};
