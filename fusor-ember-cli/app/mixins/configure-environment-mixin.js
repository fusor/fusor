import Ember from 'ember';

export default Ember.Mixin.create({

  selectedEnvironment: Ember.computed.alias("model"),

  nonLibraryEnvironments: Ember.computed.filterBy('lifecycleEnvironments', 'library', false),
  libraryEnvironments: Ember.computed.filterBy('lifecycleEnvironments', 'library', true),
  libraryEnv: function() {
    return this.get('libraryEnvironments').get('firstObject');
  }.property('libraryEnvironments'),

  fields_env: {},

  showAlertMessage: false,

  envLabelName: function() {
    if(this.get('name')) {
      return this.get('name').underscore();
    }
  }.property('name'),
  label: Ember.computed.alias("envLabelName"),

});
