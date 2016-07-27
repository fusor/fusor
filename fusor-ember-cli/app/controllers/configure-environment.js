import Ember from 'ember';
import ConfigureEnvironmentMixin from "../mixins/configure-environment-mixin";
import NeedsDeploymentMixin from "../mixins/needs-deployment-mixin";
import {
  AllValidator,
  PresenceValidator,
  AlphaNumericDashUnderscoreValidator
} from '../utils/validators';

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

  envNameValidator: PresenceValidator.create({}),

  actions: {
    selectEnvironment(environment) {
      this.set('showAlertMessage', false);
      this.set('selectedEnvironment', environment);
      this.get('deploymentController.model').set('lifecycle_environment', environment);
      this.get('deploymentController').set('errorMsg', null);
      this.set('errorMsg', null);
    },

    createEnvironment(fields_env) {
      var self = this;
      this.set('showAlertMessage', false);
      this.set('errorMsg', null);
      this.get('deploymentController').set('errorMsg', null);

      var nameAlreadyExists =  this.get('lifecycleEnvironments').findBy('name', fields_env.name);
      if (nameAlreadyExists) {
        let errorMsg = fields_env.name + ' is not a unique name. Environment not saved.';
        this.get('deploymentController').set('errorMsg', errorMsg);
        this.set('errorMsg', errorMsg);
        return false; // return and don't continue
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
        self.set('errorMsg', null);
        self.set('showAlertMessage', true);
      }, function(error) {
        let errorMsg = 'error saving environment' + error;
        self.get('deploymentController').set('errorMsg', errorMsg);
        self.set('errorMsg', errorMsg);
      });

    }
  }

});
