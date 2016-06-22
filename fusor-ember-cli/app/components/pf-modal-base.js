import Ember from 'ember';

export default Ember.Component.extend({

  openCloseModal: Ember.observer('openModal', function() {
    if (this.get('openModal')) {
      Ember.$('#'+this.get('idModal')).modal({
        backdrop: 'static',
        keyboard: false
      });
    } else {
      Ember.$('#'+this.get('idModal')).modal('hide');
    }
  }),

  closeXActionName: Ember.computed('closeXAction', function () {
    return this.getWithDefault('closeXAction', 'closeModal');
  }),

  actions: {
    closeModal() {
      this.set('openModal', false);
    },

    cancelNamingScheme() {
      this.sendAction('closeXAction');
    }

  }

});
