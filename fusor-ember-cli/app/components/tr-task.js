import Ember from 'ember';

export default Ember.Component.extend({

  tagName: 'tr',

  actionNameAndRepository: function() {
    return (this.get('task.humanized_name') + ' ' + (this.get('task.repository') || ''));
  }.property('task.humanized_name', 'task.repository'),

  isError: function () {
    return (this.get('task.result') === 'error');
  }.property('task.result'),

  textBold: function () {
    if (this.get('isError')) {
      return 'bold';
    }
  }.property('isError'),

  textColor: function () {
    if (this.get('isError')) {
      return 'errorForValidation';
    }
  }.property('isError'),

  percentProgress: function() {
    return ((this.get('task.progress') * 100).toFixed(0) + '%');
  }.property('task.progress'),

});
