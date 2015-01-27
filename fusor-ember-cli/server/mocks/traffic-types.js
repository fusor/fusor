module.exports = function(app) {
  var express = require('express');
  var trafficTypesRouter = express.Router();

  var trafficTypes = [
       {
          id: 1,
          name: 'External',
       },
       {
          id: 2,
          name: 'Tenant',
       },
       {
          id: 3,
          name: 'Management',
       },
       {
          id: 4,
          name: 'Cluster Management',
       },
       {
          id: 5,
          name: 'Admin API',
       },
       {
          id: 6,
          name: 'Public API',
       },
       {
          id: 7,
          name: 'Storage',
       },
       {
          id: 8,
          name: 'Storage Clustering',
       },
  ];


  trafficTypesRouter.get('/', function(req, res) {
    res.send({
      'results': trafficTypes
    });
  });

  trafficTypesRouter.post('/', function(req, res) {
    res.status(201).end();
  });

  trafficTypesRouter.get('/:id', function(req, res) {
    res.send({
        id: req.params.id
    });
  });

  trafficTypesRouter.put('/:id', function(req, res) {
    res.send({
      'traffic_type': {
        id: req.params.id
      }
    });
  });

  trafficTypesRouter.delete('/:id', function(req, res) {
    res.status(204).end();
  });

  app.use('/api/v2/traffic_types', trafficTypesRouter);
};
