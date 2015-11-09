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
  }).property('lifecycleEnvironments.@each.[]', 'libraryEnv'),

  fields_env: {},

  showAlertMessage: false,

  envLabelName: Ember.computed('name', function() {
    if (this.get('name')) {
      var label = this.get('name').underscore();
      return label.replace(/[^A-Z0-9]/ig, "_");
    }
  }),
  label: Ember.computed.alias("envLabelName"),

  hasNoEnvironments: Ember.computed('lifecycleEnvironments.@each.[]', function() {
    return Ember.isEmpty(this.get('lifecycleEnvironments'));
  }),

  hasOnlyLibraryEnvironment: Ember.computed('lifecycleEnvironments.@each.[]', function() {
    return (this.get('lifecycleEnvironments.length') === 1);
  })

});
