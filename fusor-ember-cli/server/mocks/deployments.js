module.exports = function(app) {
  var express = require('express');
  var deploymentsRouter = express.Router();

  var deployments = [
        {
          id: 1,
          name: 'My first RHEV',
          organization: 'default_organization',
          environment: 'development',
       },
       {
          id: 2,
          name: 'My second RHEV and CloudForms',
          organization: 'default_organization',
          environment: 'staging',
       },
       {
          id: 3,
          name: 'Going Live RHEV and CloudForms',
          organization: 'default_organization',
          environment: 'production',
       }
  ];

  deploymentsRouter.get('/', function(req, res) {
    res.send({
      'results': deployments
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

  app.use('/api/v2/deployments', deploymentsRouter);
};
