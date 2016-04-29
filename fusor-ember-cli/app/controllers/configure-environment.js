import Ember from 'ember';
import ConfigureEnvironmentMixin from "../mixins/configure-environment-mixin";
import NeedsDeploymentMixin from "../mixins/needs-deployment-mixin";

export default Ember.Controller.extend(ConfigureEnvironmentMixin, NeedsDeploymentMixin, {

  satelliteTabRouteName: Ember.computed.alias("deploymentController.satelliteTabRouteName"),
  isStarted: Ember.computed.alias("deploymentController.isStarted"),

  selectedOrganization: Ember.computed.alias("deploymentController.model.organization"),

  step2RouteName: Ember.computed.alias("deploymentController.step2RouteName"),

  nullifyLifecycleEnvIfSelected: Ember.observer('useDefaultOrgViewForEnv', function(){
    this.set('showAlertMessage', false);
    if (this.get('useDefaultOrgViewForEnv')) {
      this.set('selectedEnvironment', null);
      this.get('deploymentController.model').set('lifecycle_environment', null);
    }
  }),

  hasLifecycleEnvironment: Ember.computed.alias("deploymentController.hasLifecycleEnvironment"),
  hasNoLifecycleEnvironment: Ember.computed.alias("deploymentController.hasNoLifecycleEnvironment"),
  disableNextOnLifecycleEnvironment: Ember.computed.alias("deploymentController.disableNextOnLifecycleEnvironment"),
  openModal: false,

  deployment: Ember.computed.alias("deploymentController.model"),

  actions: {
    selectEnvironment(environment) {
      this.set('showAlertMessage', false);
      this.set('selectedEnvironment', environment);
      return this.get('deploymentController.model').set('lifecycle_environment', environment);
    },

    newEnvironment() {
      this.set('newEnvName', '');
      this.set('description', '');
      // this opens it
      this.set('openModal', true);
    },

    createEnvironment(fields_env) {
      var self = this;

      var envName = this.get('newEnvName');
      var nameAlreadyExists =  self.get('lifecycleEnvironments').findBy('name', envName);
      if (nameAlreadyExists) {
        return self.get('deploymentController').set('errorMsg', envName + ' is not a unique name. Environment not saved.');
      }

      var selectedOrganization = this.get('selectedOrganization');
      this.set('fields_env', fields_env);
      this.set('fields_env.organization', selectedOrganization);

      var library = this.get('libraryEnv');
      // assign library to prior db attribute
      this.set('fields_env.prior', library.get('id'));
      var environment = this.store.createRecord('lifecycle-environment', this.get('fields_env'));
      environment.save().then(function(result) {
        //success
        self.get('lifecycleEnvironments').addObject(result._internalModel);
        self.set('selectedEnvironment', environment);
        self.get('deploymentController.model').set('lifecycle_environment', environment);
        self.get('deploymentController').set('errorMsg', null);
        return self.set('showAlertMessage', true);
      }, function(error) {
        self.get('deploymentController').set('errorMsg', 'error saving environment' + error);
      });

    }
  }

});
