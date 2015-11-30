module.exports = function(app) {
  var express = require('express');
  var flavorRouter = express.Router();

  flavorRouter.get('/:id/flavors', function(req, res) {
    res.send({
      'flavor': [
        {
            "disabled": false,
            "disk": 40,
            "ephemeral": 0,
            "extra_specs": {
                "capabilities:boot_option": "local",
                "cpu_arch": "x86_64"
            },
            "id": "1",
            "is_public": true,
            "links": [
                {
                    "href": "http://192.0.2.1:8774/v2/434547ba69cf4a30aa5747ff012efb4e/flavors/1",
                    "rel": "self"
                },
                {
                    "href": "http://192.0.2.1:8774/434547ba69cf4a30aa5747ff012efb4e/flavors/1",
                    "rel": "bookmark"
                }
            ],
            "name": "Flavor-4-x86_64-6144-40",
            "ram": 6144,
            "rxtx_factor": 1.0,
            "swap": "",
            "vcpus": 4
        }
      ]
    });
  });


  app.use('/fusor/api/openstack/deployments', flavorRouter);
};
