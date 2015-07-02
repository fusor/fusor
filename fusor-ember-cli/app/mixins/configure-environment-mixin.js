import Ember from 'ember';

export default Ember.Mixin.create({

  selectedEnvironment: Ember.computed.alias("model"),

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
    if(this.get('name')) {
      return this.get('name').underscore();
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
