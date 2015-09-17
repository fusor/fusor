import Ember from 'ember';

export default Ember.Controller.extend({

  needs: ['deployment'],

  isRhev: Ember.computed.alias("controllers.deployment.isRhev"),

  undercloudIPHelp: "The IP address that the already-installed Red Hat Enterprise Linux OpenStack Platform undercloud is running on.",

  deployed: false,

  deployDisabled: function() {
    return this.get('deployed') && !this.get('isDirty');
  }.property('deployed', 'isDirty'),

  disableDeployUndercloudNext: function() {
    return !this.get('deployed');
  }.property('deployed'),

  disableTabRegisterNodes: function() {
    return !this.get('deployed');
  }.property('deployed'),

  disableTabAssignNodes: function() {
    return !this.get('deployed');
  }.property('deployed'),

  isDirty: false,

  watchModel: function() {
    this.set('isDirty', true);
  }.observes('model.undercloudIP', 'model.sshUser',
             'model.sshPassword'),

  backRouteNameUndercloud: function() {
    if (this.get('isRhev')) {
      return 'storage';
    } else {
      return 'configure-environment';
    }
  }.property('isRhev'),

  actions: {
    deployUndercloud: function () {
      var me = this;
      var model = this.get('model');
      console.log('detectUndercloud');
      console.log("host " + model.undercloudIP);
      console.log("user " + model.sshUser);
      var deployment = this.controllerFor('deployment');
      var id = deployment.model.id;

      var data = { 'underhost': model.undercloudIP,
        'underuser': model.sshUser,
        'underpass': model.sshPassword,
        'deployment_id': id};

      var promiseFunction = function (resolve) {
        me.set('deploymentError', null);
      var token = Ember.$('meta[name="csrf-token"]').attr('content');

      Ember.$.ajax({
          url: '/fusor/api/openstack/underclouds',
          type: 'POST',
          data: JSON.stringify(data),
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "X-CSRF-Token": token,
          },
          success: function(response) {
            promise.then(fulfill);
            console.log('create success');
            console.log(response);
            Ember.run.later(checkForDone, 3000);
          },
          error: function(error) {
            me.set('deploymentError', error.responseJSON.errors);
            me.set('showLoadingSpinner', false);
            console.log('create failed');
            console.log(error);
          }
      });

      var checkForDone = function () {
        console.log("running check for done for id " + id);
        Ember.$.ajax({
          url: '/fusor/api/openstack/underclouds/' + id,
          type: 'GET',
          contentType: 'application/json',
          success: function(response) {
            console.log('api check success');
            console.log(response);
            if (response['deployed'] || response['failed']) {
              console.log('detection finished');
              if (response['failed']) {
                console.log('detection failed');
                me.set('deploymentError', 'Please check foreman logs.');
                me.set('showLoadingSpinner', false);
              } else {
                console.log('detection success');
                me.set('deploymentError', null);
                resolve(true);
              }
            } else {
              console.log('detection ongoing');
              Ember.run.later(checkForDone, 3000);
            }
          },
          error: function(error) {
            console.log('api check error');
            console.log(error);
            me.set('deploymentError', 'Status check failed');
            me.set('showLoadingSpinner', false);
          }
        });
      };
    };

    var fulfill = function (isDone) {
      if (isDone) {
        console.log("fulfill");
        me.set('showLoadingSpinner', false);
        me.set('deployed', true);
        me.set('isDirty', false);
      }
    };

    var promise = new Ember.RSVP.Promise(promiseFunction);
    me.set('loadingSpinnerText', "Detecting Undercloud...");
    me.set('showLoadingSpinner', true);

    }
  }
});
