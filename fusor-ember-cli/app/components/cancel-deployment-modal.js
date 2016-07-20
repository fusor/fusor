import Ember from 'ember';

export default Ember.Component.extend({

  title: Ember.computed('deploymentName', function() {
    const deploymentName = this.get('deploymentName');

    if (Ember.isPresent(deploymentName)) {
      return `Cancel QCI Deployment - ${deploymentName}`;
    }

    return 'Cancel QCI Deployment';
  }),

  actions: {

    saveAndCancelDeployment() {
      this.set('openModal', false);
      this.get('targetObject').send('saveAndCancelDeployment');
    },

    cancelAndDeleteDeployment() {
      this.set('openModal', false);
      this.get('targetObject').send('cancelAndDeleteDeployment');
    },

    cancelAndRollbackNewDeployment() {
      this.set('openModal', false);
      this.get('targetObject').send('cancelAndRollbackNewDeployment');
    },

    closeModal() {
      this.set('openModal', false);
    }

  }


});
