import Ember from 'ember';
import ConfigureEnvironmentMixin from "../mixins/configure-environment-mixin";

export default Ember.Controller.extend(ConfigureEnvironmentMixin, {

  needs: ['deployment'],

  disableNextOnLifecycleEnvironment: Ember.computed.alias("controllers.deployment.disableNextOnLifecycleEnvironment"),

  organizationTabRouteName: Ember.computed.alias("controllers.deployment.organizationTabRouteName"),

  selectedOrganization: Ember.computed.alias("controllers.deployment.organization"),

  step2RouteName: Ember.computed.alias("controllers.deployment.step2RouteName"),

  actions: {
    selectEnvironment: function(environment) {
      this.set('showAlertMessage', false);
      this.set('selectedEnvironment', environment);
      return this.get('controllers.deployment').set('lifecycle_environment', environment);
    },

    createEnvironment: function() {
      var self = this;
      var selectedOrganization = this.get('selectedOrganization')
      this.set('fields_env.name', this.get('name'));
      this.set('fields_env.label', this.get('label'));
      this.set('fields_env.description', this.get('description'));
      this.set('fields_env.organization', selectedOrganization);

      // TODO - refactor DRY
      if (this.get('hasLibrary')) {
        var library = this.get('libraryEnvForOrg');
        // assign library to prior db attribute
        this.set('fields_env.prior', library.get('id'));
        var environment = this.store.createRecord('lifecycle-environment', this.get('fields_env'));
        environment.save().then(function(result) {
          //success
          self.get('nonLibraryEnvironments').pushObject(result);
          self.set('selectedEnvironment', environment);
          self.get('controllers.deployment').set('lifecycle_environment', environment);
          return self.set('showAlertMessage', true);
        }, function(response) {
          alert('error saving environment');
        });

      } else {
        // create library
        var library = this.store.createRecord('lifecycle-environment', {name: 'Library', label: 'Library', library: true, organization: selectedOrganization});
        // save library first and then save environment
        library.save().then(function(response) {
          self.set('fields_env.prior', response.get('id'));
          var environment = this.store.createRecord('lifecycle-environment', this.get('fields_env'));
          environment.save().then(function(result) {
            //success
            self.get('nonLibraryEnvironments').pushObject(result);
            self.set('selectedEnvironment', environment);
            return self.set('showAlertMessage', true);
          }, function(response) {
            alert('error saving environment');
          });
        });
      }

      return Bootstrap.ModalManager.hide('newEnvironmentModal');
    },
  }

});
