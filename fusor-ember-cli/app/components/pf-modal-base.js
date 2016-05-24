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

  actions: {
    closeModal: function() {
      this.set('openModal', false);
    }
  }

});
