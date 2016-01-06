import Ember from 'ember';

export default Ember.Component.extend({

  title: Ember.computed('deployment.name', function() {
      return "Continue RHCI Deployment - " + this.get('deployment.name');
  }),

  actions: {
    deleteDeployment() {
      this.set('openModal', false);
      this.sendAction('installDeployment', this.get('deployment'));
    },

    cancelModal() {
      this.set('openModal', false);
    }
  }

});
