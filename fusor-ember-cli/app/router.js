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

  this.route('deployments', {resetNamespace: true});

  this.route("deployment-new", {path: '/deployments/new', resetNamespace: true}, function() {
    this.route("start");
    this.route('satellite', function() {
      this.route('configure-environment');
    });
  });

  this.route('deployment', {path: '/deployments/:deployment_id', resetNamespace: true}, function() {
    this.route("start");

    this.route('satellite', {resetNamespace: true}, function() {
      this.route('configure-environment', {resetNamespace: true});
      this.route('access-insights');
    });

    this.route('rhev', {resetNamespace: true}, function() {
      this.route('rhev-setup', {path: 'setup', resetNamespace: true});
      this.route('engine', {resetNamespace: true}, function() {
        this.route('discovered-host');
      });
      this.route('hypervisor', {resetNamespace: true}, function() {
        this.route('discovered-host');
      });
      this.route('rhev-options', {path: 'configuration', resetNamespace: true});
      this.route('storage', {resetNamespace: true});
    });

    this.route('openstack', {resetNamespace: true}, function() {
      this.route('undercloud-deploy', {resetNamespace: true});
      this.route('register-nodes', {resetNamespace: true});
      this.route('assign-nodes', {resetNamespace: true});
      this.route('overcloud');
    });
    this.route('cloudforms', {resetNamespace: true}, function() {
      this.route('where-install', {resetNamespace: true});
      this.route('cfme-configuration', { path: 'configuration' });
    });
    this.route('openshift', {resetNamespace: true}, function() {
      this.route('openshift-nodes', { path: 'nodes' });
      this.route('openshift-configuration', { path: 'configuration' });
    });
    this.route('subscriptions', {resetNamespace: true}, function() {
      this.route('credentials');
      this.route('management-application', function() {
        this.route('consumer', { path: '/:management_application_uuid' });
      });
      this.route('select-subscriptions', {path: 'select'});
      this.route('review-subscriptions', {path: 'review'});
    });
    this.route('review', {resetNamespace: true}, function() {
      this.route('installation');
      this.route('progress', function() {
        this.route('overview');
        this.route('details');
        this.route('log');
      });
      this.route('summary');
    });
  });

  this.route('readme'); // for demo only, not used in app
});
