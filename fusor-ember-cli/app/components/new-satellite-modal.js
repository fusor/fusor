import Ember from 'ember';

export default Ember.Component.extend({

  didInsertElement() {
    this.set('newSatelliteName', null);
  },

  actions: {
    createSatellite() {
      this.set('openModal', false);
      this.sendAction('createSatellite', this.get('newSatelliteName'));
    }
  }

});
