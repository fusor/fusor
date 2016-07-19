import Ember from 'ember';

export default Ember.Component.extend({

  envLabelName: Ember.computed('name', function() {
    if (this.get('name')) {
      var label = this.get('name').trim();
      return label.replace(/[^A-Z0-9]/ig, "_");
    }
  }),

  fields_env: {},

  isValidEnvName: Ember.computed('name', function() {
    return this.get('envNameValidator') && this.get('envNameValidator').isValid(this.get('name'));
  }),
  invalidEnvName: Ember.computed.not('isValidEnvName'),

  actions: {
    createEnvironment() {
      this.set('openModal', false); //this closes it
      this.set('fields_env.name', this.get('name'));
      this.set('fields_env.label', this.get('envLabelName'));
      this.set('fields_env.description', this.get('description'));
      this.sendAction('createEnvironment', this.get('fields_env'));
    }
  }
});
