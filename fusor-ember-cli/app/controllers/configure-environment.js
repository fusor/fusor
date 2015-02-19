import Ember from 'ember';

export default Ember.ArrayController.extend({
  needs: ['satellite'],
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

  disable1CNext: function() {
    return (this.get('selectedEnvironment.length') === 0);
  }.property('selectedEnvironment'),

  disableAll: Ember.computed.alias("controllers.satellite.disableAll"),

  nameRHCI: Ember.computed.alias("controllers.rhci.nameRHCI"),

  fields_env: {},

  selectedEnvironment: "",

  rhciNewEnvButtons: [
      Ember.Object.create({title: 'Cancel', clicked:"cancel", dismiss: 'modal'}),
      Ember.Object.create({title: 'Create', clicked:"createEnvironment", type: 'primary'})
  ],

  envLabelName: function() {
    if(this.get('fields_env.name')) {
      return this.get('fields_env.name').underscore();
    }
  }.property('fields_env.name'),

  // hasEnvironments: function() {
  //   return (this.get('length') > 0);
  // }.property('model.@each.[]'),

  actions: {
    createEnvironment: function() {
      var self = this;
      var environment = this.store.createRecord('environment', this.get('fields_env'));
      this.set('selectedEnvironment', environment.get('name'));
      this.set('fields_env',{});
      environment.save().then(function() {
        //success
      }, function(response) {
        alert('error saving environment');
      });
      return Bootstrap.ModalManager.hide('newEnvironmentModal');
    }

  }

});
