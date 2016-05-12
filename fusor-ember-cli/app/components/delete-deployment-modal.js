import Ember from 'ember';

export default Ember.Component.extend({

  title: Ember.computed('deployment.name', function() {
    return "Delete QCI Deployment - " + this.get('deployment.name');
  }),

  actions: {
    deleteDeployment() {
      this.set('openModal', false);
      this.sendAction('deleteDeployment', this.get('deployment'));
    },

    cancelModal() {
      this.set('openModal', false);
    }
  }

});
