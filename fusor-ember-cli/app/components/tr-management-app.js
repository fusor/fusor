import Ember from 'ember';

export default Ember.Component.extend({

  tagName: 'tr',

  isChecked: function () {
    return (this.get('model.consumerUUID') === this.get('managementApp.uuid'));
  }.property('model.consumerUUID', 'managementApp.uuid'),

  actions: {
    changeManagementApp: function(event) {
      this.sendAction('action', this.get('managementApp'));
    }
  }

});
