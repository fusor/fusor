import Ember from 'ember';
import ConfigureEnvironmentMixin from "../../../mixins/configure-environment-mixin";

export default Ember.Controller.extend(ConfigureEnvironmentMixin, {

  needs: ['deployment-new', 'deployment', 'application'],

  organizationTabRouteName: Ember.computed.alias("controllers.deployment-new.organizationTabRouteName"),

  selectedOrganization: Ember.computed.alias("controllers.deployment-new.model.organization"),

  step2RouteName: Ember.computed.alias("controllers.deployment-new.step2RouteName"),

  nullifyLifecycleEnvIfSelected: function(){
    if (this.get('useDefaultOrgViewForEnv')) {
      this.set('selectedEnvironment', null);
      return this.get('controllers.deployment-new.model').set('lifecycle_environment', null);
    }
  }.observes('useDefaultOrgViewForEnv'),

  hasLifecycleEnvironment: Ember.computed.alias("controllers.deployment-new.hasLifecycleEnvironment"),
  hasNoLifecycleEnvironment: Ember.computed.alias("controllers.deployment-new.hasNoLifecycleEnvironment"),
  disableNextOnLifecycleEnvironment: Ember.computed.alias("controllers.deployment-new.disableNextOnLifecycleEnvironment"),

  deployment: Ember.computed.alias("controllers.deployment-new"),

  actions: {
    selectEnvironment: function(environment) {
      this.set('showAlertMessage', false);
      this.set('selectedEnvironment', environment);
      return this.get('controllers.deployment-new.model').set('lifecycle_environment', environment);
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
        self.get('controllers.deployment-new.model').set('lifecycle_environment', environment);
        return self.set('showAlertMessage', true);
      }, function(error) {
        self.get('controllers.deployment').set('errorMsg', 'error saving environment' + error);
      });

    }
  }

});
