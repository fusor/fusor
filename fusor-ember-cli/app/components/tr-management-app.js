import Ember from 'ember';

export default Ember.Component.extend({

  tagName: 'tr',

  classNameBindings: ['bgColor'],

  isChecked: Ember.computed('consumerUUID', 'managementApp.id', function () {
    return (this.get('consumerUUID') === this.get('managementApp.id'));
  }),

  bgColor: Ember.computed('isChecked', function () {
    if (this.get('isChecked')) {
      return 'white-on-blue';
    }
  }),

  actions: {
    changeManagementApp: function() {
      this.sendAction('action', this.get('managementApp'));
    }
  }

});
