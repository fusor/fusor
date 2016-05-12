import Ember from 'ember';
import request from 'ic-ajax';
import NeedsDeploymentMixin from "../../mixins/needs-deployment-mixin";

const UndercloudDeployController = Ember.Controller.extend(NeedsDeploymentMixin, {

  deploymentId: Ember.computed.alias("deploymentController.model.id"),
  openstackDeployment: Ember.computed.alias('model'),

  // these 3 attributes are not persisted by UI.
  // backend controller will persist these
  undercloudIP: null,
  sshUser: null,
  sshPassword: null,

  isRhev: Ember.computed.alias("deploymentController.isRhev"),
  fullnameOpenStack: Ember.computed.alias("deploymentController.fullnameOpenStack"),

  undercloudIPHelp: Ember.computed('fullnameOpenStack', function() {
    return `The IP address that the already-installed ${this.get('fullnameOpenStack')} undercloud is running on.`;
  }),

  undercloudIpValidator: Ember.computed.alias('openstackDeployment.validations.undercloud_ip_address'),

  isDeployed: Ember.computed.alias('openstackDeployment.isUndercloudDeployed'),

  deployDisabled: Ember.computed('isDeployed', 'undercloudIP', 'sshUser', 'sshPassword', function () {
    return this.get('isDeployed') ||
        this.get('undercloudIpValidator').isInvalid(this.get('undercloudIP')) ||
        Ember.isBlank(this.get('sshUser')) ||
        Ember.isBlank(this.get('sshPassword'));
  }
  ),

  disableDeployUndercloudNext: Ember.computed('isDeployed', function() {
    return !this.get('isDeployed');
  }),

  disableTabRegisterNodes: Ember.computed('isDeployed', function() {
    return !this.get('isDeployed');
  }),

  disableTabAssignNodes: Ember.computed('isDeployed', function() {
    return !this.get('isDeployed');
  }),

  backRouteNameUndercloud: Ember.computed('isRhev', function() {
    if (this.get('isRhev')) {
      return 'storage';
    } else {
      return 'satellite.access-insights';
    }
  }),

  actions: {
    resetCredentials() {
      this.set('undercloudIP', null);
      this.set('sshUser', null);
      this.set('sshPassword', null);
      this.set('isDeployed', false);
      this.set('openstackDeployment.undercloud_admin_password', null);
    },

    deployUndercloud() {
      var self = this;
      var openstackDeployment = this.get('openstackDeployment');
      console.log('detectUndercloud');
      console.log("host " + this.get('undercloudIP'));
      console.log("user " + this.get('sshUser'));
      var data = {
        'underhost': this.get('undercloudIP'),
        'underuser': this.get('sshUser'),
        'underpass': this.get('sshPassword'),
        'deployment_id': this.get('deploymentId')
      };

      var promiseFunction = function (resolve) {
        self.set('deploymentError', null);
        var token = Ember.$('meta[name="csrf-token"]').attr('content');

        console.log('action: deployUndercloud');
        console.log('POST /fusor/api/openstack/deployments/' + self.get('deploymentId') + '/underclouds');
        request({
          url: '/fusor/api/openstack/deployments/' + self.get('deploymentId') + '/underclouds',
          type: 'POST',
          data: JSON.stringify(data),
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "X-CSRF-Token": token
          }
        }).then(function(response) {
          promise.then(fulfill);
          console.log('create success');
          console.log(response);
          if (self.get('applicationController.isEmberCliMode')) {
                  // only used for development to enabled OSP tabs (disableOspTab: false)
            openstackDeployment.set('openstack_undercloud_password', 'this-passwd-is-populated by fusor/server');
            openstackDeployment.save();
          }
          Ember.run.later(checkForDone, 3000);
        },  function(error) {
          error = error.jqXHR;
          self.set('deploymentError', error.responseJSON.errors);
          self.set('showLoadingSpinner', false);
          console.log('create failed');
          console.log(error);
        }
        );

        var checkForDone = function () {
          console.log("running check for done for id " + self.get('deploymentId'));
          request({
            url: '/fusor/api/openstack/deployments/' + self.get('deploymentId') + '/underclouds/' + self.get('deploymentId'),
            type: 'GET',
            contentType: 'application/json'
          }).then(function(response) {
            console.log('api check success');
            console.log(response);
            if (response['deployed'] || response['failed']) {
              console.log('detection finished');
              if (response['failed']) {
                console.log('detection failed');
                self.set('deploymentError', 'Please check foreman logs.');
                self.set('showLoadingSpinner', false);
              } else {
                console.log('detection success');
                self.set('deploymentError', null);
                resolve(true);
              }
            } else {
              console.log('detection ongoing');
              Ember.run.later(checkForDone, 3000);
            }
          }, function(error) {
            error = error.jqXHR;
            console.log('api check error');
            console.log(error);
            self.set('deploymentError', 'Status check failed');
            self.set('showLoadingSpinner', false);
          }
        );
        };
      };

      var fulfill = function (isDone) {
        if (isDone) {
          console.log("fulfill");
          self.set('showLoadingSpinner', false);
          self.set('isDeployed', true);
        }
      };

      var promise = new Ember.RSVP.Promise(promiseFunction);
      self.set('loadingSpinnerText', "Detecting Undercloud...");
      self.set('showLoadingSpinner', true);

    }
  }
});

export default UndercloudDeployController;
