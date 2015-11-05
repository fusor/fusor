import Ember from 'ember';
import ConfigureEnvironmentMixin from "../mixins/configure-environment-mixin";
import NeedsDeploymentMixin from "../mixins/needs-deployment-mixin";

export default Ember.Controller.extend(ConfigureEnvironmentMixin, NeedsDeploymentMixin, {

  satelliteTabRouteName: Ember.computed.alias("controllers.deployment.model.satelliteTabRouteName"),
  organizationTabRouteName: Ember.computed.alias("controllers.deployment.model.organizationTabRouteName"),
  isStarted: Ember.computed.alias("controllers.deployment.isStarted"),

  selectedOrganization: Ember.computed.alias("controllers.deployment.model.organization"),

  step2RouteName: Ember.computed.alias("controllers.deployment.step2RouteName"),

  nullifyLifecycleEnvIfSelected: function(){
    this.set('showAlertMessage', false);
    if (this.get('useDefaultOrgViewForEnv')) {
      this.set('selectedEnvironment', null);
      return this.get('controllers.deployment.model').set('lifecycle_environment', null);
    }
  }.observes('useDefaultOrgViewForEnv'),

  hasLifecycleEnvironment: Ember.computed.alias("controllers.deployment.hasLifecycleEnvironment"),
  hasNoLifecycleEnvironment: Ember.computed.alias("controllers.deployment.hasNoLifecycleEnvironment"),
  disableNextOnLifecycleEnvironment: Ember.computed.alias("controllers.deployment.disableNextOnLifecycleEnvironment"),
  openNewEnvironmentModal: false,

  deployment: Ember.computed.alias("controllers.deployment.model"),

  actions: {
    selectEnvironment: function(environment) {
      this.set('showAlertMessage', false);
      this.set('selectedEnvironment', environment);
      return this.get('controllers.deployment.model').set('lifecycle_environment', environment);
    },

    newEnvironment: function() {
      this.set('name', '');
      this.set('label', '');
      this.set('description', '');
      this.set('openNewEnvironmentModal', true);
    },

    createEnvironment: function() {
      var self = this;
      var selectedOrganization = this.get('selectedOrganization');
      this.set('fields_env.name', this.get('name'));
      this.set('fields_env.label', this.get('label'));
      this.set('fields_env.description', this.get('description'));
      this.set('fields_env.organization', selectedOrganization);

      var library = this.get('libraryEnv');
      // assign library to prior db attribute
      this.set('fields_env.prior', library.get('id'));
      var environment = this.store.createRecord('lifecycle-environment', this.get('fields_env'));
      environment.save().then(function(result) {
        //success
        self.get('lifecycleEnvironments').addObject(result);
        self.set('selectedEnvironment', environment);
        self.get('controllers.deployment.model').set('lifecycle_environment', environment);
        return self.set('showAlertMessage', true);
      }, function(error) {
        self.get('controllers.deployment').set('errorMsg', 'error saving environment' + error);
      });

    }
  }

});
