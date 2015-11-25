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
      'organizations': organizations
    });
  });

  organizationsRouter.get('/1', function(req, res) {
    res.send(organizations[0]);
  });

  app.use('/api/v21/organizations', organizationsRouter);
};
