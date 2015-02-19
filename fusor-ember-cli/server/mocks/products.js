module.exports = function(app) {
  var express = require('express');
  var productsRouter = express.Router();

  var products = [
        {
          id: 1,
          name: 'Red Hat Enterprise Virtualization',
          state_time: null,
          duration: '25 minutes',
          size: '3 GB',
          result: 'Sync in progress',
       },
       {
          id: 2,
          name: 'Red Hat CloudForms Management Engine',
          state_time: null,
          duration: '14 minutes',
          size: '1 GB',
          result: 'Sync in progress',
       },
       {
          id: 3,
          name: 'Red Hat OpenStack Platform',
          state_time: null,
          duration: '22 minutes',
          size: '2 GB',
          result: 'Sync in progress',
       }
  ];

  productsRouter.get('/', function(req, res) {
    res.send({
      'results': products
    });
  });

  productsRouter.post('/', function(req, res) {
    res.status(201).end();
  });

  productsRouter.get('/:id', function(req, res) {
    res.send({
        id: req.params.id
    });
  });

  productsRouter.put('/:id', function(req, res) {
    res.send({
      'product': {
        id: req.params.id
      }
    });
  });

  productsRouter.delete('/:id', function(req, res) {
    res.status(204).end();
  });

  app.use('/api/v2/products', productsRouter);
};
