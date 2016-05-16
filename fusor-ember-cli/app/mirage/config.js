import Mirage from 'ember-cli-mirage';

export default function() {

  // route to prevent js console error by ember-cli-blanket
  this.post('/write-blanket-coverage', function(db, request) {
    return {};
  });

  this.get('/fusor/api/v3/deployments', function(db, request) {
    return {
      data: db.deployments.map(attrs => (
        { type: 'deployments', id: attrs.id, attributes: attrs }
      ))
    };
  });

  this.get('/fusor/api/v3/deployments/:id', function(db, request) {
    let id = request.params.id;

    return {
      data: {
        type: 'deployments',
        id: id,
        attributes: db.deployments.find(id)
      }
    };
  });
  this.post('/fusor/api/v3/deployments', function(db, request) {
    let id = 123456789;

    return {
      data: {
        type: 'deployments',
        id: id,
        attributes: db.deployments.find(id)
      }
    };
  });
  this.put('/fusor/api/v3/deployments/:id', function(db, request) {
    let id = request.params.id;

    return {
      data: {
        type: 'deployments',
        id: id,
        attributes: db.deployments.find(id)
      }
    };
  });
  this.patch('/fusor/api/v3/deployments/:id', function(db, request) {
    let id = request.params.id;

    return {
      data: {
        type: 'deployments',
        id: id,
        attributes: db.openstack_deployments.find(id)
      }
    };
  });

  this.del('/fusor/api/v3/deployments/:id');

  this.get('/fusor/api/v3/openstack_deployments', function(db, request) {
    return {
      data: db.openstack_deployments.map(attrs => (
        { type: 'openstack_deployments', id: attrs.id, attributes: attrs }
      ))
    };
  });

  this.get('/fusor/api/v3/openstack_deployments/:id', function(db, request) {
    let id = request.params.id;

    return {
      data: {
        type: 'openstack_deployments',
        id: id,
        attributes: db.openstack_deployments.find(id)
      }
    };
  });

  this.post('/fusor/api/v3/openstack_deployments');
  this.put('/fusor/api/v3/openstack_deployments/:id');
  this.del('/fusor/api/v3/openstack_deployments/:id');

  this.get('/api/v3/organizations', function(db, request) {
    return {
      data: db.organizations.map(attrs => (
        { type: 'organizations', id: attrs.id, attributes: attrs }
      ))
    };
  });

  this.get('/api/v3/organizations/:id', function(db, request) {
    let id = request.params.id;

    return {
      data: {
        type: 'organizations',
        id: id,
        attributes: db.organizations.find(id)
      }
    };
  });

  this.get('/fusor/api/v3/lifecycle_environments', function(db, request) {
    return {
      data: db.lifecycle_environments.map(attrs => (
        { type: 'lifecycle_environments', id: attrs.id, attributes: attrs }
      ))
    };
  });

  this.get('/fusor/api/v3/lifecycle_environments/:id', function(db, request) {
    let id = request.params.id;

    return {
      data: {
        type: 'lifecycle_environments',
        id: id,
        attributes: db.lifecycle_environments.find(id)
      }
    };
  });

  this.post('/fusor/api/v3/lifecycle_environments', function(db, request) {
    var attrs = JSON.parse(request.requestBody).lifecycle_environment;
    attrs['prior_id'] = 1;
    var record = db.lifecycle_environments.insert(attrs);
    console.log(record);
    return {
      data: {
        type: 'lifecycle_environments',
        id: id,
        attributes: record
      }
    };
  });

  this.get('/fusor/api/v3/discovered_hosts', function(db, request) {
    return {
      data: db.discovered_hosts.map(attrs => (
        { type: 'discovered_hosts', id: attrs.id, attributes: attrs }
      ))
    };
  });

  this.get('/fusor/api/v3/discovered_hosts/:id', function(db, request) {
    let id = request.params.id;

    return {
      data: {
        type: 'discovered_hosts',
        id: id,
        attributes: db.discovered_hosts.find(id)
      }
    };
  });

  this.patch('/fusor/api/v3/discovered_hosts/:id/rename', function(db, request) {
    var id = request.params.id;
    return db.discovered_hosts.find(id);
  });

  this.get('/katello/api/v2/organizations/:id', function(db, request) {
    var id = request.params.id;
    return db.katello_organizations.find(id);
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

  this.get('/fusor/api/v3/subscriptions', function(db, request) {
    return {
      data: db.subscriptions.map(attrs => (
        { type: 'subscriptions', id: attrs.id, attributes: attrs }
      ))
    };
  });
  this.post('/fusor/api/v3/subscriptions');

  this.get('/api/v3/hostgroups', function(db, request) {
    return {
      data: db.hostgroups.map(attrs => (
        { type: 'hostgroups', id: attrs.id, attributes: attrs }
      ))
    };
  });

  this.get('/api/v3/hostgroups/:id', function(db, request) {
    let id = request.params.id;

    return {
      data: {
        type: 'hostgroups',
        id: id,
        attributes: db.hostgroups.find(id)
      }
    };
  });

  this.get('/api/v3/domains', function(db, request) {
    return {
      data: db.domains.map(attrs => (
        { type: 'domains', id: attrs.id, attributes: attrs }
      ))
    };
  });

  this.get('/api/v3/domains/:id', function(db, request) {
    let id = request.params.id;

    return {
      data: {
        type: 'domains',
        id: id,
        attributes: db.domains.find(id)
      }
    };
  });

  this.get('/fusor/api/v3/deployments/:id/validate', function(db, request) {
    var id = request.params.id;
    return {validation:{deployment_id: id, errors:[], warnings:[]}};
  });

  this.put('/fusor/api/v3/deployments/:id/deploy', function(db, request) {
    return db.foreman_tasks.find('db25a76f-e344-48ba-ac77-f29303586dbe');
  });

  this.get('/fusor/api/v3/foreman_tasks', function(db, request) {
    return {
      data: db.foreman_tasks.map(attrs => (
        { type: 'foreman_tasks', id: attrs.id, attributes: attrs }
      ))
    };
  });

  this.get('/fusor/api/v3/foreman_tasks/:id', function(db, request) {
    let id = request.params.id;

    return {
      data: {
        type: 'foreman_tasks',
        id: id,
        attributes: db.foreman_tasks.find(id)
      }
    };
  });

  this.post('/fusor/api/openstack/deployments/:id/underclouds', function(db, request) {
    return {'undercloud': 2};
  });

  this.get('/fusor/api/openstack/deployments/:id/underclouds/:id', function(db, request) {
    return {
      'deployed': true,
      'failed': false
    };
  });

  this.get('/fusor/api/openstack/deployments/:id/nodes', function(db, request) {
    return {nodes: db.nodes};
  });

  this.post('/fusor/api/openstack/deployments/:id/nodes', function(db, request) {
    var id = request.params.id;
    return db.nodes.find(id);
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

  this.post('/fusor/api/v3/openstack_deployments/:id/sync_openstack');

  this.post('/customer_portal/consumers/:uuid/entitlements');

  this.get('/api/v2/settings', function(db, request) {
    return {results: db.settings};
  });

  this.get('/fusor/api/v21/unlogged/deployments/:id/log', function(db, request) {
    return {
      "fusor_log": {path: ''},
      "foreman_log": {path: ''},
      "foreman_proxy_log": {path: ''},
      "candlepin_log": {path: ''},
      "messages_log": {path: ''}
    };
  });

  /*
    Route shorthand cheatsheet
  */
  /*
    GET shorthands

    // Collections
    this.get('/contacts');
    this.get('/contacts', 'users');
    this.get('/contacts', ['contacts', 'addresses']);

    // Single objects
    this.get('/contacts/:id');
    this.get('/contacts/:id', 'user');
    this.get('/contacts/:id', ['contact', 'addresses']);
  */

  /*
    POST shorthands

    this.post('/contacts');
    this.post('/contacts', 'user'); // specify the type of resource to be created
  */

  /*
    PUT shorthands

    this.put('/contacts/:id');
    this.put('/contacts/:id', 'user'); // specify the type of resource to be updated
  */

  /*
    DELETE shorthands

    this.del('/contacts/:id');
    this.del('/contacts/:id', 'user'); // specify the type of resource to be deleted

    // Single object + related resources. Make sure parent resource is first.
    this.del('/contacts/:id', ['contact', 'addresses']);
  */

  /*
    Function fallback. Manipulate data in the db via

      - db.{collection}
      - db.{collection}.find(id)
      - db.{collection}.where(query)
      - db.{collection}.update(target, attrs)
      - db.{collection}.remove(target)

    // Example: return a single object with related models
    this.get('/contacts/:id', function(db, request) {
      var contactId = +request.params.id;

      return {
        contact: db.contacts.find(contactId),
        addresses: db.addresses.where({contact_id: contactId})
      };
    });

  */
}

/*
You can optionally export a config that is only loaded during tests
export function testConfig() {

}
*/
