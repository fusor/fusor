import Ember from 'ember';

export default Ember.ObjectController.extend({
  fields: {},

  rhciModalButtons: [
      Ember.Object.create({title: 'Cancel', clicked:"cancel", dismiss: 'modal'}),
      Ember.Object.create({title: 'Create', clicked:"createOrganization"})
  ],

  myModalButtons: [
      Ember.Object.create({title: 'Submit', type: 'primary', clicked:"submit"}),
      Ember.Object.create({title: 'Cancel', clicked:"cancel", dismiss: 'modal'})
  ],

  actions: {

    cancel: function() {
      this.transitionTo('configure');
    },

    createOrganization: function() {
      var self = this;
      var organization = this.store.createRecord('organization', this.get('fields'));
      organization.save().then(function() {
        self.controllerFor('configure').set('selectedOrganization', organization);
        self.transitionTo('configure');
      }, function() {
        alert('error');
      });
    }
  }
});
