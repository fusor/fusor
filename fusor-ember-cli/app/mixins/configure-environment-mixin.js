import Ember from 'ember';
import NeedsDeploymentMixin from "./needs-deployment-mixin";

export default Ember.Mixin.create(NeedsDeploymentMixin, {

  selectedEnvironment: Ember.computed.alias("model"),

  step1DRouteName: 'satellite.access-insights',

  useDefaultOrgViewForEnv: Ember.computed('model', function() {
    return Ember.isBlank(this.get('model'));
  }),

  nonLibraryEnvironments: Ember.computed.filterBy('lifecycleEnvironments', 'library', false),
  libraryEnvironments: Ember.computed.filterBy('lifecycleEnvironments', 'library', true),
  libraryEnv: Ember.computed('libraryEnvironments', function() {
    return this.get('libraryEnvironments').get('firstObject');
  }),

  priorLibraryEnvironments: Ember.computed.filter('lifecycleEnvironments', function(item) {
    return (item.get('prior_id') === 1);
  }),

  fields_env: {},

  showAlertMessage: false,

  envLabelName: Ember.computed('newEnvName', function() {
    if (this.get('newEnvName')) {
      var label = this.get('newEnvName').underscore();
      return label.replace(/[^A-Z0-9]/ig, "_");
    }
  }),

  hasNoEnvironments: Ember.computed('lifecycleEnvironments.[]', function() {
    return Ember.isEmpty(this.get('lifecycleEnvironments'));
  }),

  hasOnlyLibraryEnvironment: Ember.computed('lifecycleEnvironments.[]', function() {
    return (this.get('lifecycleEnvironments.length') === 1);
  }),

  envSetup: Ember.computed('useDefaultOrgViewForEnv', function() {
    return (this.get('useDefaultOrgViewForEnv') ? "immediately" : "after_publishing");
  }),

  isImmediate: Ember.computed('envSetup', function() {
    return (this.get('envSetup') === 'immediately');
  }),

  actions: {
    envSetupChanged() {
      return this.set('useDefaultOrgViewForEnv', this.get('isImmediate'));
    }
  }


});
