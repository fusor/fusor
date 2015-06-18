import Ember from 'ember';

export default Ember.Component.extend({

  tagName: 'tr',

  classNameBindings: ['bgColor'],

  isChecked: function () {
    return (this.get('consumerUUID') === this.get('managementApp.uuid'));
  }.property('consumerUUID', 'managementApp.uuid'),

  bgColor: function () {
    if (this.get('isChecked')) {
      return 'white-on-blue';
    }
  }.property('isChecked'),

  actions: {
    changeManagementApp: function() {
      this.sendAction('action', this.get('managementApp'));
    }
  }

});
