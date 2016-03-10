import Mirage from 'ember-cli-mirage';

export default function() {

  // route to prevent js console error by ember-cli-blanket
  this.post('/write-blanket-coverage', function(db, request) {
      return {};
  });

  this.get('/fusor/api/v21/deployments');
  this.post('/fusor/api/v21/deployments');
  this.get('/fusor/api/v21/deployments/:id');
  this.put('/fusor/api/v21/deployments/:id');
  this.del('/fusor/api/v21/deployments/:id');

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

  this.get('/fusor/api/v21/subscriptions', function(db, request) {
    var id = request.params.deployment_id;
    console.log(request.params);
    return db.subscriptions;
  });

  this.get('/api/v21/hostgroups');
  this.get('/api/v21/hostgroups/:id');

  this.get('/api/v21/domains');
  this.get('/api/v21/domains/:id');

  this.get('fusor/api/v21/deployments/:id/validate', function(db, request) {
    var id = request.params.id;
    return db.deployments.find(id);
  });

  this.put('fusor/api/v21/deployments/:id/deploy', function(db, request) {
    return db.foreman_tasks.find('db25a76f-e344-48ba-ac77-f29303586dbe');
  });

  this.get('/api/v21/foreman_tasks');
  this.get('/api/v21/foreman_tasks/:id', function(db, request) {
    var id = request.params.id;
    return db.foreman_tasks.find(id);
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

  this.get('/fusor/api/v21/subscriptions');
  this.post('/fusor/api/v21/subscriptions');


  this.post('/customer_portal/consumers/:uuid/entitlements');

  this.get('/api/v2/settings', function(db, request) {
    return {results: db.settings};
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
