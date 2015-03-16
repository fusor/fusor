module.exports = function(app) {
  var express = require('express');
  var usersRouter = express.Router();

  var users = [
        {
            "id": 1,
            "login": "admin",
            "firstname": "Admin",
            "lastname": "Admin",
            "created_at": "2014-07-14T13:01:06Z",
            "updated_at": "2014-07-14T13:01:06Z",
        }
    ];

  usersRouter.get('/', function(req, res) {
    res.send({
      'users': users
    });
  });

  usersRouter.post('/', function(req, res) {
    res.status(201).end();
  });

  usersRouter.get('/:id', function(req, res) {
    res.send({
        id: req.params.id,
        login: 'admin',
        firstname: "Admin",
        lastname: "Admin"
    });
  });

  usersRouter.put('/:id', function(req, res) {
    res.send({
      'user': {
        id: req.params.id
      }
    });
  });

  usersRouter.delete('/:id', function(req, res) {
    res.status(204).end();
  });

  app.use('/api/v21aaa/users', usersRouter);
};
