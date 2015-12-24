import Ember from 'ember';

export default Ember.Component.extend({

  classNames: ['row'],

  actions: {
    openCancelDeploymentModal() {
      this.set('openModal', true);
    },

    saveAndCancelDeployment() {
      this.get('targetObject').send('saveAndCancelDeployment');
      return this.set('openModal', false);
    },

    cancelAndDeleteDeployment() {
      this.get('targetObject').send('cancelAndDeleteDeployment');
      return this.set('openModal', false);
    },

    cancelAndRollbackNewDeployment() {
      this.get('targetObject').send('cancelAndRollbackNewDeployment');
      return this.set('openModal', false);
    }
  }

});
