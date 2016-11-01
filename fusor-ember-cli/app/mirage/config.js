import Mirage, { faker } from 'ember-cli-mirage';
import ENV from 'fusor-ember-cli/config/environment';

export default function() {

  this.timing = 5; // default is 400

  // route to prevent js console error by ember-cli-blanket
  this.post('/write-blanket-coverage', function(db, request) {
    return {};
  });

  // These routes to SAT6 or FUSOR WILL run using --environment mocks-enabled,
  // but WILL NOT run using --environment partial-mocks-enabled
  if ((ENV.environment === 'mocks-enabled') || (ENV.environment === 'test')) {

    this.get('/fusor/api/v21/deployments', function (db, request) {
      return {
        deployments: db.deployments,
        meta: {
          total: 107,
          total_pages: 5,
          page: 1
        }
      };
    });

    this.post('/fusor/api/v21/deployments', function(db, request) {
      var attrs = JSON.parse(request.requestBody);
      attrs['deployment']['id'] = faker.random.number({min:150, max:1000});
      return attrs;
    });
    this.get('/fusor/api/v21/deployments/:id');
    this.put('/fusor/api/v21/deployments/:id');
    this.del('/fusor/api/v21/deployments/:id');

    this.get('/fusor/api/v21/openstack_deployments');
    this.post('/fusor/api/v21/openstack_deployments');
    this.get('/fusor/api/v21/openstack_deployments/:id');
    this.put('/fusor/api/v21/openstack_deployments/:id');
    this.del('/fusor/api/v21/openstack_deployments/:id');

    this.get('/api/v21/organizations');
    this.get('/api/v21/organizations/:id');

    this.get('/api/v21/lifecycle_environments');
    this.get('/api/v21/lifecycle_environments/:id');
    this.post('/api/v21/lifecycle_environments', function(db, request) {
      var attrs = JSON.parse(request.requestBody).lifecycle_environment;
      attrs['prior_id'] = 1;
      var record = db.lifecycle_environments.insert(attrs);
      console.log(record);
      return {
        lifecycle_environment: record
      };
    });

    this.get('/api/v21/discovered_hosts');
    this.get('/api/v21/discovered_hosts/:id');
    this.put('/api/v21/discovered_hosts/:id/rename', function(db, request) {
      var id = request.params.id;
      return db.discovered_hosts.find(id);
    });

    this.get('/katello/api/v2/organizations/:id', function(db, request) {
      var id = request.params.id;
      return db.katello_organizations.find(id);
    });

    this.get('/katello/api/v2/organizations/:id/subscriptions', function(db, request) {
      return {"results": []};
    });

    this.get('/fusor/api/v21/subscriptions');
    this.post('/fusor/api/v21/subscriptions');

    this.get('/api/v21/hostgroups');
    this.get('/api/v21/hostgroups/:id');

    this.get('/api/v21/domains');
    this.get('/api/v21/domains/:id');

    this.get('/api/v2/settings', function(db, request) {
      return {results: db.settings};
    });

  } /* END if (ENV.environment === 'mocks-enabled') */

  //////////////////////////////////////////////////////////////
  // These routes WILL run in EITHER mode
  // using --environment mocks-enabled OR --environment partial-mocks-enabled
  // Routes are related to OSP, subscriptions, and validations

  this.get('/fusor/api/v21/subscriptions/validate', function(db, request) {
    return {valid: true};
  });
  this.put('/fusor/api/v21/subscriptions/upload', function(db, request) {
    return {manifest_file: '/file/path/to/manifest'};
  });

  this.get('/fusor/api/v21/deployments/:id/validate_cdn', function(db, request) {
    return {cdn_url_code: '200'};
  });

  this.get('fusor/api/v21/deployments/:id/validate', function(db, request) {
    var id = request.params.id;
    return {validation:{deployment_id: id, errors:[], warnings:[]}};
  });

  this.post('/fusor/api/openstack/deployments/:id/undercloud', function(db, request) {
    return {'undercloud': request.params.id};
  });

  this.get('/fusor/api/openstack/deployments/:id/undercloud', function(db, request) {
    return {
      'deployed': true,
      'failed': false,
      'undercloud_dns': '192.168.236.10',
      'overcloud_dns': '192.168.236.10',
      'satellite_dns': '192.168.236.10'
    };
  });

  this.post('/fusor/api/openstack/deployments/:id/undercloud/update_dns', function(db, request) {
    return {
      'deployed': true,
      'undercloud_dns': '192.168.236.10',
      'overcloud_dns': '192.168.236.10',
      'satellite_dns': '192.168.236.10'
    };
  });

  this.get('/fusor/api/openstack/deployments/:id/stacks', function(db, request) {
    return {'stacks': []};
  });

  this.get('/fusor/api/openstack/deployments/:id/nodes', function(db, request) {
    return {nodes: db.nodes};
  });

  this.post('/fusor/api/openstack/deployments/:id/nodes', function(db, request) {
    var attrs = JSON.parse(request.requestBody);
    attrs['node']['uuid'] = 'abcde12314asdf';
    return attrs;
  });

  this.get('/fusor/api/openstack/deployments/:id/node_ports', function(db, request) {
    return {ports: db.node_ports};
  });

  this.post('/fusor/api/openstack/deployments/:id/node_mac_addresses', function(db, request) {
    return {nodes: db.node_mac_addresses};
  });

  this.get('/fusor/api/openstack/deployments/:id/flavors', function(db, request) {
    // NOTE root node is flavor and not flavors
    return {flavor: db.flavors};
  });

  this.get('/fusor/api/openstack/deployments/:id/images', function(db, request) {
    return {images: db.images};
  });

  this.get('/fusor/api/openstack/deployments/:id/deployment_plans/overcloud', function(db, request) {
    return {deployment_plan: db.deployment_plan[0]};
  });

  this.put('/fusor/api/openstack/deployments/:id/deployment_plans/overcloud/:update_action', function(db, request) {
    // return deployment plan even though UI should update not based on response
    return {deployment_plan: db.deployment_plan[0]};
  });

  this.post('/fusor/api/v21/openstack_deployments/:id/sync_openstack');

  this.get('/fusor/api/v21/deployments/:id/openshift_disk_space',
    function(db, request) {
      return { openshift_disk_space: 1024 * 250 };
    }
  );

  this.get('/fusor/api/v21/unlogged/deployments/:id/log', function(db, request) {
    return {
      "fusor_log": {path: ''},
      "foreman_log": {path: ''},
      "foreman_proxy_log": {path: ''},
      "candlepin_log": {path: ''},
      "messages_log": {path: ''}
    };
  });

  this.get('/fusor/api/v21/deployments/:id/check_mount_point', function(db, request) {
    return {mounted: true, is_empty: true};
  });

  this.get('/fusor/api/v21/deployments/:id/compatible_cpu_families', function(db, request) {
    return {
      cpu_families: [
        "Intel Conroe Family",
        "Intel Penryn Family",
        "Intel Nehalem Family",
        "Intel Westmere Family",
        "Intel SandyBridge Family",
        "Intel Haswell-noTSX Family"
      ],
      default_family: "Intel Haswell-noTSX Family"
    };
  });

  this.get('/customer_portal/owners/:owner_key/consumers', function(db, request) {
    return db.management_applications;
  });

  this.get('/customer_portal/consumers/:uuid/entitlements', function(db, request) {
    return db.entitlements;
  });

  this.get('/customer_portal/users/:username/owners', function(db, request) {
    return db.owners;
  });

  this.get('/customer_portal/pools', function(db, request) {
    return db.pools;
  });

  this.post('/customer_portal/login', function(db, request) {
    return {};
  });

  this.post('/customer_portal/login', function(db, request) {
    return {};
  });
  this.post('/customer_portal/consumers/:uuid/entitlements', function(db, request) {
    return {};
  });

  // route to prevent js console error by ember-cli-blanket
  this.post('/write-blanket-coverage', function(db, request) {
    return {};
  });

  this.put('fusor/api/v21/deployments/:id/deploy', function(db, request) {
    // fusor/server saves foreman_task_uuid to deployment
    // but mirage doesn't have access to ember-data store,
    // so mirage can't save the foreman_task_uuid to the deployment and
    // transition to review/progress/overview
    // fusor/server returns deployment
    return db.foreman_tasks.find('db25a76f-e344-48ba-ac77-f29303586dbe');
  });

  this.get('/api/v21/foreman_tasks');
  this.get('/api/v21/foreman_tasks/:id', function(db, request) {
    var id = request.params.id;
    return db.foreman_tasks.find(id);
  });

  // All route NOT defined in mirage/config.js
  // will passthrough to real backend server
  this.passthrough();

}
