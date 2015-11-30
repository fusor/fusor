module.exports = function(app) {
  var express = require('express');
  var lifecycleEnvironmentsRouter = express.Router();

  var lifecycleEnvironments = {
  "lifecycle_environments": [
    {
      "id": 1,
      "name": "Library",
      "label": "Library",
      "description": null,
      "library": true,
      "prior_id": null,
      "prior": null,
      "created_at": "2015-11-05T08:40:34Z",
      "updated_at": "2015-11-05T08:40:34Z"
    }
  ]
};

  lifecycleEnvironmentsRouter.get('/', function(req, res) {
    res.send(lifecycleEnvironments);
  });

  lifecycleEnvironmentsRouter.post('/', function(req, res) {
    res.status(201).end();
  });

  lifecycleEnvironmentsRouter.get('/:id', function(req, res) {
    res.send({
        id: req.params.id
    });
  });

  lifecycleEnvironmentsRouter.put('/:id', function(req, res) {
    res.send({
      'lifecycle_environment': {
        id: req.params.id
      }
    });
  });

  lifecycleEnvironmentsRouter.delete('/:id', function(req, res) {
    res.status(204).end();
  });

  app.use('/api/v21/lifecycle_environments', lifecycleEnvironmentsRouter);
};
