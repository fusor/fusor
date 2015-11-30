module.exports = function(app) {
  var express = require('express');
  var portalRouter = express.Router();

  portalRouter.post('/login', function(req, res) {
    res.status(200).end();
  });

  portalRouter.post('/logout', function(req, res) {
    res.status(200).end();
  });

  portalRouter.get('/users/:username/owners', function(req, res) {
    res.send([
        {
        "parentOwner": null,
        "id": "8a85f9814a192108014a1adef5826b38",
        "key": "7473998",
        "displayName": "7473998",
        "contentPrefix": null,
        "defaultServiceLevel": null,
        "upstreamConsumer": null,
        "logLevel": null,
        "href": "/owners/7473998",
        "created": "2014-12-05T14:33:47.000+0000",
        "updated": "2014-12-05T14:33:47.000+0000"
        }
      ]);
  });

  app.use('/customer_portal', portalRouter);
};
