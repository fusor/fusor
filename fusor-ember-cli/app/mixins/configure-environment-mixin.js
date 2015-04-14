import Ember from 'ember';

export default Ember.Mixin.create({

  selectedEnvironment: Ember.computed.alias("model"),

  nonLibraryEnvironments: Ember.computed.filterBy('lifecycleEnvironments', 'library', false),
  libraryEnvironments: Ember.computed.filterBy('lifecycleEnvironments', 'library', true),

  hasLibrary: function() {
    return (this.get('libraryEnvironments.length') > 0);
  }.property('libraryEnvironments'),
  libraryEnvForOrg: function() {
    if (this.get('hasLibrary')) {
      return this.get('libraryEnvironments.firstObject');
    }
  }.property('libraryEnvironments', 'hasLibrary'),

  fields_env: {},

  showAlertMessage: false,

  envLabelName: function() {
    if(this.get('name')) {
      return this.get('name').underscore();
    }
  }.property('name'),
  label: Ember.computed.alias("envLabelName"),

});
