module.exports = function(app) {
  var express = require('express');
  var organizationsRouter = express.Router();

  var organizations = [
        {
            "id": 1,
            "name": "Default_Organization",
            "title": "Default_Organization",
            "description": null,
            "created_at": "2014-07-14T13:01:06Z",
            "updated_at": "2014-07-14T13:01:06Z",
        }
    ];

  organizationsRouter.get('/', function(req, res) {
    res.send({
      'results': organizations
    });
  });

  organizationsRouter.post('/', function(req, res) {
    res.status(201).end();
  });

  organizationsRouter.get('/:id', function(req, res) {
    res.send({
        id: req.params.id
    });
  });

  organizationsRouter.put('/:id', function(req, res) {
    res.send({
      'organization': {
        id: req.params.id
      }
    });
  });

  organizationsRouter.delete('/:id', function(req, res) {
    res.status(204).end();
  });

  app.use('/api/v2/organizations', organizationsRouter);
};
