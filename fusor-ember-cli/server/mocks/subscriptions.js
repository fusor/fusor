module.exports = function(app) {
  var express = require('express');
  var subscriptionsRouter = express.Router();

  var subscriptions = [
          {
           id: 1,
           name: 'Red Hat Employee Subscription',
           contract_number: '1234567',
           available: '12831 of 25000',
           subscription_type: 'System: Physical',
           start_date: '03/03/2014',
           end_date: '01/01/2022',
           quantity: null
         },
         {
           id: 2,
           name: '30 Day Self-Supported OpenShift Enterprise, 2 Cores Evaluation',
           contract_number: '234234234',
           available: '2 or 3',
           subscription_type: 'System: Physical',
           start_date: '09/01/2014',
           end_date: '09/30/2014',
           quantity: 1
         },
         {
           id: 3,
           name: 'CloudForms Employee Subscription',
           contract_number: '675676576',
           available: '2 or 1000',
           subscription_type: 'System: Physical',
           start_date: '07/01/2014',
           end_date: '07/30/2019',
           quantity: null
         }
    ];


  subscriptionsRouter.get('/', function(req, res) {
    res.send({
      'results': subscriptions
    });
  });

  subscriptionsRouter.post('/', function(req, res) {
    res.status(201).end();
  });

  subscriptionsRouter.get('/:id', function(req, res) {
    res.send({
        id: req.params.id
    });
  });

  subscriptionsRouter.put('/:id', function(req, res) {
    res.send({
      'subscription': {
        id: req.params.id
      }
    });
  });

  subscriptionsRouter.delete('/:id', function(req, res) {
    res.status(204).end();
  });

  app.use('/api/v2/subscriptions', subscriptionsRouter);
};
