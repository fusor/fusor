module.exports = function(app) {
  var express = require('express');
  var lifecycleEnvironmentsRouter = express.Router();

  var lifecycleEnvironments = [
        {
            "id": 2,
            "name": "Library",
            "label": "Library",
            "description": null,
            "organization": {
                "name": "Default_Organization",
                "label": "Default_Organization"
            },
            "created_at": "2014-07-14T13:01:06Z",
            "updated_at": "2014-07-14T13:01:06Z",
            "library": true,
            "prior": null,
            "permissions": {
                "view_lifecycle_environments": true,
                "edit_lifecycle_environments": true,
                "destroy_lifecycle_environments": true,
                "promote_or_remove_content_views_to_environments": true
            }
        },
        {
            "id": 3,
            "name": "Development",
            "label": "Development",
            "description": null,
            "organization": {
                "name": "Default_Organization",
                "label": "Default_Organization"
            },
            "created_at": "2014-08-03T10:25:18Z",
            "updated_at": "2014-08-03T10:25:18Z",
            "library": false,
            "prior": {
                "name": "Library",
                "id": 2
            },
            "permissions": {
                "view_lifecycle_environments": true,
                "edit_lifecycle_environments": true,
                "destroy_lifecycle_environments": true,
                "promote_or_remove_content_views_to_environments": true
            }
        },
        {
            "id": 4,
            "name": "Test",
            "label": "Test",
            "description": null,
            "organization": {
                "name": "Default_Organization",
                "label": "Default_Organization"
            },
            "created_at": "2014-08-03T10:25:18Z",
            "updated_at": "2014-08-03T10:25:18Z",
            "library": false,
            "prior": {
                "name": "Development",
                "id": 3
            },
            "permissions": {
                "view_lifecycle_environments": true,
                "edit_lifecycle_environments": true,
                "destroy_lifecycle_environments": true,
                "promote_or_remove_content_views_to_environments": true
            }
        },
        {
            "id": 5,
            "name": "Production",
            "label": "Production",
            "description": null,
            "organization": {
                "name": "Default_Organization",
                "label": "Default_Organization"
            },
            "created_at": "2014-08-03T10:25:18Z",
            "updated_at": "2014-08-03T10:25:18Z",
            "library": false,
            "prior": {
                "name": "Test",
                "id": 4
            },
            "permissions": {
                "view_lifecycle_environments": true,
                "edit_lifecycle_environments": true,
                "destroy_lifecycle_environments": true,
                "promote_or_remove_content_views_to_environments": true
            }
        }
    ];

  lifecycleEnvironmentsRouter.get('/', function(req, res) {
    res.send({
      'results': lifecycleEnvironments
    });
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

  app.use('/katello/api/v2/environments', lifecycleEnvironmentsRouter);
};
