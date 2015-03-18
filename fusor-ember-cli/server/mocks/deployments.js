module.exports = function(app) {
  var express = require('express');
  var deploymentsRouter = express.Router();

  var deployments = [
        {
          id: 1,
          name: 'My first RHEV'
       },
       {
          id: 2,
          name: 'My second RHEV and CloudForms'
       },
       {
          id: 3,
          name: 'Going Live RHEV and CloudForms'
       }
  ];

  deploymentsRouter.get('/', function(req, res) {
    res.send({
      'deployments': deployments
    });
  });

  deploymentsRouter.post('/', function(req, res) {
    res.status(201).end();
  });

  deploymentsRouter.get('/:id', function(req, res) {
    res.send({
        id: req.params.id
    });
  });

  deploymentsRouter.put('/:id', function(req, res) {
    res.send({
      'deployment': {
        id: req.params.id
      }
    });
  });

  deploymentsRouter.delete('/:id', function(req, res) {
    res.status(204).end();
  });

  app.use('/fusor/api/v21aaaa/deployments', deploymentsRouter);
};
