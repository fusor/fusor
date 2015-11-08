import Ember from 'ember';
import NeedsDeploymentMixin from "./needs-deployment-mixin";

export default Ember.Mixin.create(NeedsDeploymentMixin, {

  selectedEnvironment: Ember.computed.alias("model"),

  step1DRouteName: 'satellite.access-insights',

  useDefaultOrgViewForEnv: function() {
    return Ember.isBlank(this.get('model'));
  }.property('model'),

  nonLibraryEnvironments: Ember.computed.filterBy('lifecycleEnvironments', 'library', false),
  libraryEnvironments: Ember.computed.filterBy('lifecycleEnvironments', 'library', true),
  libraryEnv: function() {
    return this.get('libraryEnvironments').get('firstObject');
  }.property('libraryEnvironments'),

  priorLibraryEnvironments: Ember.computed.filter('lifecycleEnvironments', function(item) {
    return (item.get('prior_id') === 1);
  }).property('lifecycleEnvironments.@each.[]', 'libraryEnv'),

  fields_env: {},

  showAlertMessage: false,

  envLabelName: function() {
    if (this.get('name')) {
      var label = this.get('name').underscore();
      return label.replace(/[^A-Z0-9]/ig, "_");
    }
  }.property('name'),
  label: Ember.computed.alias("envLabelName"),

  hasNoEnvironments: function() {
    return Ember.isEmpty(this.get('lifecycleEnvironments'));
  }.property('lifecycleEnvironments.@each.[]'),

  hasOnlyLibraryEnvironment: function() {
    return (this.get('lifecycleEnvironments.length') === 1);
  }.property('lifecycleEnvironments.@each.[]')

});
