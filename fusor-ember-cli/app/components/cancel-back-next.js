import Ember from 'ember';

export default Ember.Component.extend({

  classNames: ['row cancel-back-next-row'],

  dataQciBackButton: Ember.computed('backRouteName', function() {
    return `back-${this.get('backRouteName')}`;
  }),

  dataQciNextButton: Ember.computed('nextRouteName', function() {
    return `next-${this.get('nextRouteName')}`;
  }),

  dataQciCancelButton: Ember.computed('nextRouteName', function() {
    return `cancel-${this.get('nextRouteName')}`;
  }),

  actions: {
    openCancelDeploymentModal() {
      this.set('openModal', true);
    },

    saveAndCancelDeployment() {
      this.get('targetObject').send('saveAndCancelDeployment');
      this.set('openModal', false);
    },

    cancelAndDeleteDeployment() {
      this.get('targetObject').send('cancelAndDeleteDeployment');
      this.set('openModal', false);
    },

    cancelAndRollbackNewDeployment() {
      this.get('targetObject').send('cancelAndRollbackNewDeployment');
    }
  }

});
