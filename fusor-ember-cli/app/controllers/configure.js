import Ember from 'ember';

export default Ember.Controller.extend({
  needs: ['organization', 'organizations', 'satellite/index'],

  fields_org: {},
  fields_env: {},

  deploymentName: Ember.computed.alias("controllers.satellite/index.name"),
  defaultOrgName: function () {
    return this.getWithDefault('defaultOrg', this.get('deploymentName'));
  }.property(),

  selectedEnvironment: "Development",
  selectedOrganzation: "Default_Organization",

  rhciModalButtons: [
      Ember.Object.create({title: 'Cancel', clicked:"cancel", dismiss: 'modal'}),
      Ember.Object.create({title: 'Create', clicked:"createOrganization", type: 'primary'})
  ],

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
    // cancel: function() {
    //   //nothing needed here alert('cancel');
    // },
    createOrganization: function() {
      //if (this.get('fields.isDirty')) {
        this.set('fields_org.name', this.get('defaultOrgName'));
        var organization = this.store.createRecord('organization', this.get('fields_org'));
        this.set('selectedOrganzation', organization.get('name'));
        this.set('fields_org',{});
      //}
      return Bootstrap.ModalManager.hide('newOrganizationModal');
    },
    createEnvironment: function() {
      var environment = this.store.createRecord('newenv', this.get('fields_env'));
      this.set('selectedEnvironment', environment.get('name'));
      this.set('fields_env',{});
      return Bootstrap.ModalManager.hide('newEnvironmentModal');
    }

  }

});
