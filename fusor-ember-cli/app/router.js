import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType,
  // log when Ember generates a controller or a route from a generic class
  LOG_ACTIVE_GENERATION: true,
  // log when Ember looks up a template or a view
  LOG_VIEW_LOOKUPS: true
});

export default Router.map(function() {
  this.route('login');
  this.route('loggedin');

  this.resource('rhci', { path: '/old-deployments/new-old' }, function() {
    this.route('satellite', function() {
      this.route('configure-organization');
      this.route('configure-environment');
    });
  });

  this.resource('deployments');

  this.resource("deployment-new", { path: '/deployments/new' }, function() {
    this.route("start");
    this.route('satellite', function() {
      this.route('configure-environment');
      this.route("configure-organization");
    });
  });

  this.resource('deployment', { path: '/deployments/:deployment_id' }, function() {

    this.route("start");

    this.resource('satellite', function() {
      this.resource('configure-organization');
      this.resource('configure-environment');
      this.route('access-insights');
    });

    this.resource('rhev', function() {
      this.resource('rhev-setup', { path: 'setup' });
      this.resource('engine', function() {
        this.route('discovered-host');
      });
      this.resource('hypervisor', function() {
        this.route('discovered-host');
      });
      this.resource('rhev-options', { path: 'configuration' });
      this.resource('storage');
    });

    this.resource('openstack', function() {
      this.resource('undercloud-deploy');
      this.resource('register-nodes');
      this.resource('assign-nodes');
    });
    this.resource('cloudforms', function() {
      this.resource('where-install');
      this.route('cfme-configuration', { path: 'configuration' });
    });
    this.resource('subscriptions', function() {
      this.route('credentials');
      this.route('management-application', function() {
        this.route('consumer', { path: '/:management_application_uuid' });
      });
      this.route('select-subscriptions', {path: 'select'});
      this.route('review-subscriptions', {path: 'review'});
    });
    this.resource('review', function() {
      this.route('installation');
      this.route('progress', function() {
        this.route('overview');
        this.route('details');
      });
      this.route('summary');
    });
  });

});
