import Ember from 'ember';

export default Ember.Component.extend({

  didInsertElement() {
    this.set('name', null);
    this.set('description', null);
  },

  envLabelName: Ember.computed('name', function() {
    if (this.get('name')) {
      var label = this.get('name').underscore();
      return label.replace(/[^A-Z0-9]/ig, "_");
    }
  }),

  fields_env: {},

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
