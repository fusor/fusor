import Ember from 'ember';

export default Ember.Component.extend({

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
