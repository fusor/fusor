import Ember from 'ember';

export default Ember.Component.extend({

  actions: {
    cancelGlobalServiceConfig() {
      this.sendAction('cancelGlobalServiceConfig');
    },
    saveGlobalServiceConfig() {
      this.sendAction('saveGlobalServiceConfig');
    }
  }

});
