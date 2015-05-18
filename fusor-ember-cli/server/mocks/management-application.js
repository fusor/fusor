module.exports = function(app) {
  var express = require('express');
  var managementApplicationsRouter = express.Router();

  var managementApplications = [
          {
           id: 1,
           name: 'dave.dev.lab',
           type: 'Subscription Asset Manager Organization',
           subscriptions_attached: 5,
           uuid: 'adfad-adfads-fasdfa-dfadf'
         },
         {
           id: 2,
           name: 'fred.dev.lab',
           type: 'Subscription Asset Manager Organization',
           subscriptions_attached: 1,
           uuid: 'klkl-klkk-klkkl-k2332'
         },
         {
           id: 3,
           name: 'sam.dev.lab',
           type: 'Subscription Asset Manager Organization',
           subscriptions_attached: 1,
           uuid: 'vbcv-zvbxcv-zcvzcv-zcv-zxcv-zcv'
         }
    ];


  managementApplicationsRouter.get('/', function(req, res) {
    res.send({
      'management_applications': managementApplications
    });
  });

  managementApplicationsRouter.post('/', function(req, res) {
    res.status(201).end();
  });

  managementApplicationsRouter.get('/:id', function(req, res) {
    res.send({
        id: req.params.id
    });
  });

  managementApplicationsRouter.put('/:id', function(req, res) {
    res.send({
      'subscription': {
        id: req.params.id
      }
    });
  });

  managementApplicationsRouter.delete('/:id', function(req, res) {
    res.status(204).end();
  });

  app.use('/api/v21aaaaaa/management_applications', managementApplicationsRouter);
};
