import Ember from 'ember';

export default Ember.Component.extend({

  classNames: ['row'],

  actions: {
    openCancelDeploymentModal: function() {
      this.set('openModal', true);
    },

    saveAndCancelDeployment: function() {
      this.get('targetObject').send('saveAndCancelDeployment');
      this.set('openModal', false);
    },

    cancelAndDeleteDeployment: function() {
      this.get('targetObject').send('cancelAndDeleteDeployment');
      this.set('openModal', false);
    }
  }

});
