import Ember from 'ember';

export default Ember.Controller.extend({
  fields_env: {},

  selectedEnvironment: "Development",

  rhciNewEnvButtons: [
      Ember.Object.create({title: 'Cancel', clicked:"cancel", dismiss: 'modal'}),
      Ember.Object.create({title: 'Create', clicked:"createEnvironment", type: 'primary'})
  ],

  envLabelName: function() {
    if(this.get('fields_env.name')) {
      return this.get('fields_env.name').underscore();
    }
  }.property('fields_env.name'),

  hasNewEnvs: function() {
    return (this.get('newenvs').get('length') > 0);
  }.property('newenvs.@each.[]'),

  actions: {
    createEnvironment: function() {
      var environment = this.store.createRecord('newenv', this.get('fields_env'));
      this.set('selectedEnvironment', environment.get('name'));
      this.set('fields_env',{});
      return Bootstrap.ModalManager.hide('newEnvironmentModal');
    }
  }

});
