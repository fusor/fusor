import Ember from 'ember';

export default Ember.ArrayController.extend({
  needs: ['organization', 'organizations', 'satellite/index'],

  fields_org: {},

  deploymentName: Ember.computed.alias("controllers.satellite/index.name"),
  defaultOrgName: function () {
    return this.getWithDefault('defaultOrg', this.get('deploymentName'));
  }.property(),

  selectedOrganzation: "Default_Organization",
  selectedOrg: "Default_Organization",
  organizationId: function() {
    return this.get('selectedOrg').id;
  }.property('selectedOrg'),

  rhciModalButtons: [
      Ember.Object.create({title: 'Cancel', clicked:"cancel", dismiss: 'modal'}),
      Ember.Object.create({title: 'Create', clicked:"createOrganization", type: 'primary'})
  ],

  actions: {
    createOrganization: function() {
      //if (this.get('fields_org.isDirty')) {
        var self = this;
        this.set('fields_org.name', this.get('defaultOrgName'));
        var organization = this.store.createRecord('organization', this.get('fields_org'));
        self.set('fields_org',{});
        self.set('selectedOrganzation', organization.get('name'));
        self.set('selectedOrg', organization);
        organization.save().then(function() {
          //success
        }, function(response) {
          alert('error saving organization');
        //organization.destroyRecord();
        //organization.rollback()
        //organization.reload();
        //organization.unloadRecord();
        });
      //}

      return Bootstrap.ModalManager.hide('newOrganizationModal');
    },
  }

});
