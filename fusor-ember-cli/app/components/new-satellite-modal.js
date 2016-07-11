import Ember from 'ember';

export default Ember.Component.extend({

  onOpenModal: Ember.observer('openModal', function() {
    if (this.get('openModal')) {
      this.set('newSatelliteName', null);
    }
  }),

  actions: {
    createSatellite() {
      this.set('openModal', false);
      this.sendAction('createSatellite', this.get('newSatelliteName'));
    }
  }

});
