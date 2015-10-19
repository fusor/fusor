module.exports = function(app) {
  var express = require('express');
  var deploymentPlanRouter = express.Router();

  deploymentPlanRouter.get('/', function(req, res) {
    res.send({
      'deployment-plan': []
    });
  });

  deploymentPlanRouter.post('/', function(req, res) {
    res.status(201).end();
  });

  deploymentPlanRouter.get('/:id/deployment_plans/:plan_id', function(req, res) {
    res.send({
      'deployment_plan': {
        "created_at": "2015-10-12T19:40:16",
        "description": null,
        "name": req.params.plan_id,
        "parameters": [
            {
                "constraints": [],
                "default": "",
                "description": "If set, the contents of an SSL certificate .key file for encrypting SSL endpoints.",
                "hidden": true,
                "label": null,
                "name": "Controller-1::SSLKey",
                "parameter_type": "string",
                "value": ""
            },
            {
                "constraints": [],
                "default": false,
                "description": "Rabbit client subscriber parameter to specify an SSL connection to the RabbitMQ host.\n",
                "hidden": null,
                "label": null,
                "name": "Compute-1::RabbitClientUseSSL",
                "parameter_type": "string",
                "value": false
            },
        ],
        "roles": [
            {
                "uuid": 1,
                "constraints": [
                    {
                        "constraint_type": "range",
                        "definition": {
                            "min": "0"
                        },
                        "description": null
                    }
                ],
                "default": null,
                "description": null,
                "hidden": null,
                "label": null,
                "name": "Controller-1::count",
                "parameter_type": "number",
                "value": "1"
            },
            {
                "uuid": 2,
                "constraints": [
                    {
                        "constraint_type": "range",
                        "definition": {
                            "min": "0"
                        },
                        "description": null
                    }
                ],
                "default": null,
                "description": null,
                "hidden": null,
                "label": null,
                "name": "Ceph-Storage-1::count",
                "parameter_type": "number",
                "value": "0"
            },
            {
                "uuid": 3,
                "constraints": [
                    {
                        "constraint_type": "range",
                        "definition": {
                            "min": "0"
                        },
                        "description": null
                    }
                ],
                "default": null,
                "description": null,
                "hidden": null,
                "label": null,
                "name": "Compute-1::count",
                "parameter_type": "number",
                "value": "1"
            },
            {
                "uuid": 4,
                "constraints": [
                    {
                        "constraint_type": "range",
                        "definition": {
                            "min": "0"
                        },
                        "description": null
                    }
                ],
                "default": null,
                "description": null,
                "hidden": null,
                "label": null,
                "name": "Swift-Storage-1::count",
                "parameter_type": "number",
                "value": "0"
            },
            {
                "uuid": 5,
                "constraints": [
                    {
                        "constraint_type": "range",
                        "definition": {
                            "min": "0"
                        },
                        "description": null
                    }
                ],
                "default": null,
                "description": null,
                "hidden": null,
                "label": null,
                "name": "Cinder-Storage-1::count",
                "parameter_type": "number",
                "value": "0"
            },
        ],
        "updated_at": null,
        "uuid": "5393d0c1-001b-4b4b-99ed-dee163a8200f"
      }
    });
  });

  deploymentPlanRouter.put('/:id/deployment_plans/:plan_id/update_parameters', function(req, res) {
    res.send({
      'deployment_plan': {
        "created_at": "2015-10-12T19:40:16",
        "description": null,
        "name": req.params.plan_id,
        "parameters": [
            {
                "constraints": [],
                "default": "",
                "description": "If set, the contents of an SSL certificate .key file for encrypting SSL endpoints.",
                "hidden": true,
                "label": null,
                "name": "Controller-1::SSLKey",
                "parameter_type": "string",
                "value": ""
            },
            {
                "constraints": [],
                "default": false,
                "description": "Rabbit client subscriber parameter to specify an SSL connection to the RabbitMQ host.\n",
                "hidden": null,
                "label": null,
                "name": "Compute-1::RabbitClientUseSSL",
                "parameter_type": "string",
                "value": false
            },
        ],
        "roles": [
            {
                "constraints": [
                    {
                        "constraint_type": "range",
                        "definition": {
                            "min": "0"
                        },
                        "description": null
                    }
                ],
                "default": null,
                "description": null,
                "hidden": null,
                "label": null,
                "name": "Controller-1::count",
                "parameter_type": "number",
                "value": "1"
            },
            {
                "constraints": [
                    {
                        "constraint_type": "range",
                        "definition": {
                            "min": "0"
                        },
                        "description": null
                    }
                ],
                "default": null,
                "description": null,
                "hidden": null,
                "label": null,
                "name": "Ceph-Storage-1::count",
                "parameter_type": "number",
                "value": "0"
            },
            {
                "constraints": [
                    {
                        "constraint_type": "range",
                        "definition": {
                            "min": "0"
                        },
                        "description": null
                    }
                ],
                "default": null,
                "description": null,
                "hidden": null,
                "label": null,
                "name": "Compute-1::count",
                "parameter_type": "number",
                "value": "1"
            },
            {
                "constraints": [
                    {
                        "constraint_type": "range",
                        "definition": {
                            "min": "0"
                        },
                        "description": null
                    }
                ],
                "default": null,
                "description": null,
                "hidden": null,
                "label": null,
                "name": "Swift-Storage-1::count",
                "parameter_type": "number",
                "value": "0"
            },
            {
                "constraints": [
                    {
                        "constraint_type": "range",
                        "definition": {
                            "min": "0"
                        },
                        "description": null
                    }
                ],
                "default": null,
                "description": null,
                "hidden": null,
                "label": null,
                "name": "Cinder-Storage-1::count",
                "parameter_type": "number",
                "value": "0"
            },
        ],
        "updated_at": null,
        "uuid": "5393d0c1-001b-4b4b-99ed-dee163a8200f"
      }
    });
  });

  deploymentPlanRouter.put('/:id/deployment_plans/:plan_id/update_role_count', function(req, res) {
    res.send({
      'deployment_plan': {
        "created_at": "2015-10-12T19:40:16",
        "description": null,
        "name": req.params.plan_id,
        "parameters": [
            {
                "constraints": [],
                "default": "",
                "description": "If set, the contents of an SSL certificate .key file for encrypting SSL endpoints.",
                "hidden": true,
                "label": null,
                "name": "Controller-1::SSLKey",
                "parameter_type": "string",
                "value": ""
            },
            {
                "constraints": [],
                "default": false,
                "description": "Rabbit client subscriber parameter to specify an SSL connection to the RabbitMQ host.\n",
                "hidden": null,
                "label": null,
                "name": "Compute-1::RabbitClientUseSSL",
                "parameter_type": "string",
                "value": false
            },
        ],
        "roles": [
            {
                "constraints": [
                    {
                        "constraint_type": "range",
                        "definition": {
                            "min": "0"
                        },
                        "description": null
                    }
                ],
                "default": null,
                "description": null,
                "hidden": null,
                "label": null,
                "name": "Controller-1::count",
                "parameter_type": "number",
                "value": "1"
            },
            {
                "constraints": [
                    {
                        "constraint_type": "range",
                        "definition": {
                            "min": "0"
                        },
                        "description": null
                    }
                ],
                "default": null,
                "description": null,
                "hidden": null,
                "label": null,
                "name": "Ceph-Storage-1::count",
                "parameter_type": "number",
                "value": "0"
            },
            {
                "constraints": [
                    {
                        "constraint_type": "range",
                        "definition": {
                            "min": "0"
                        },
                        "description": null
                    }
                ],
                "default": null,
                "description": null,
                "hidden": null,
                "label": null,
                "name": "Compute-1::count",
                "parameter_type": "number",
                "value": "1"
            },
            {
                "constraints": [
                    {
                        "constraint_type": "range",
                        "definition": {
                            "min": "0"
                        },
                        "description": null
                    }
                ],
                "default": null,
                "description": null,
                "hidden": null,
                "label": null,
                "name": "Swift-Storage-1::count",
                "parameter_type": "number",
                "value": "0"
            },
            {
                "constraints": [
                    {
                        "constraint_type": "range",
                        "definition": {
                            "min": "0"
                        },
                        "description": null
                    }
                ],
                "default": null,
                "description": null,
                "hidden": null,
                "label": null,
                "name": "Cinder-Storage-1::count",
                "parameter_type": "number",
                "value": "0"
            },
        ],
        "updated_at": null,
        "uuid": "5393d0c1-001b-4b4b-99ed-dee163a8200f"
      }
    });
  });

  deploymentPlanRouter.put('/:id/deployment_plans/:plan_id/update_role_flavor', function(req, res) {
    res.send({
      'deployment_plan': {
        "created_at": "2015-10-12T19:40:16",
        "description": null,
        "name": req.params.plan_id,
        "parameters": [
            {
                "constraints": [],
                "default": "",
                "description": "If set, the contents of an SSL certificate .key file for encrypting SSL endpoints.",
                "hidden": true,
                "label": null,
                "name": "Controller-1::SSLKey",
                "parameter_type": "string",
                "value": ""
            },
            {
                "constraints": [],
                "default": false,
                "description": "Rabbit client subscriber parameter to specify an SSL connection to the RabbitMQ host.\n",
                "hidden": null,
                "label": null,
                "name": "Compute-1::RabbitClientUseSSL",
                "parameter_type": "string",
                "value": false
            },
        ],
        "roles": [
            {
                "constraints": [
                    {
                        "constraint_type": "range",
                        "definition": {
                            "min": "0"
                        },
                        "description": null
                    }
                ],
                "default": null,
                "description": null,
                "hidden": null,
                "label": null,
                "name": "Controller-1::count",
                "parameter_type": "number",
                "value": "1"
            },
            {
                "constraints": [
                    {
                        "constraint_type": "range",
                        "definition": {
                            "min": "0"
                        },
                        "description": null
                    }
                ],
                "default": null,
                "description": null,
                "hidden": null,
                "label": null,
                "name": "Ceph-Storage-1::count",
                "parameter_type": "number",
                "value": "0"
            },
            {
                "constraints": [
                    {
                        "constraint_type": "range",
                        "definition": {
                            "min": "0"
                        },
                        "description": null
                    }
                ],
                "default": null,
                "description": null,
                "hidden": null,
                "label": null,
                "name": "Compute-1::count",
                "parameter_type": "number",
                "value": "1"
            },
            {
                "constraints": [
                    {
                        "constraint_type": "range",
                        "definition": {
                            "min": "0"
                        },
                        "description": null
                    }
                ],
                "default": null,
                "description": null,
                "hidden": null,
                "label": null,
                "name": "Swift-Storage-1::count",
                "parameter_type": "number",
                "value": "0"
            },
            {
                "constraints": [
                    {
                        "constraint_type": "range",
                        "definition": {
                            "min": "0"
                        },
                        "description": null
                    }
                ],
                "default": null,
                "description": null,
                "hidden": null,
                "label": null,
                "name": "Cinder-Storage-1::count",
                "parameter_type": "number",
                "value": "0"
            },
        ],
        "updated_at": null,
        "uuid": "5393d0c1-001b-4b4b-99ed-dee163a8200f"
      }
    });
  });

  app.use('/fusor/api222/openstack/deployments', deploymentPlanRouter);

};
