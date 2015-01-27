import Ember from 'ember';

export default Ember.ArrayController.extend({
  //needs: ['configure-organization'],
  queryParams: ['organization_id'],

  organization_id: null,

  filteredEnvironments: function() {
    var organization_id = this.get('organization_id');
    var environments = this.get('model');

    if (organization_id) {
      return environments.filterBy('organization_id', organization_id);
    } else {
      return environments;
    }
  }.property('organization_id', 'model'),

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
    return (this.get('length') > 0);
  }.property('model.@each.[]'),

  actions: {
    createEnvironment: function() {
      var environment = this.store.createRecord('newenv', this.get('fields_env'));
      this.set('selectedEnvironment', environment.get('name'));
      this.set('fields_env',{});
      return Bootstrap.ModalManager.hide('newEnvironmentModal');
    },

     submit: function() {
      return alert(this.get('organization_id')); // null value
     }

  }

});
