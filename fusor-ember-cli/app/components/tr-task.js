import Ember from 'ember';

export default Ember.Component.extend({

  tagName: 'tr',

  actionNameAndRepository: Ember.computed('task.humanized_name', 'task.repository', function() {
    return (this.get('task.humanized_name') + ' ' + (this.get('task.repository') || ''));
  }),

  isError: Ember.computed('task.result', function () {
    return (this.get('task.result') === 'error');
  }),

  textBold: Ember.computed('isError', function () {
    if (this.get('isError')) {
      return 'bold';
    }
  }),

  textColor: Ember.computed('isError', function () {
    if (this.get('isError')) {
      return 'errorForValidation';
    }
  }),

  percentProgress: Ember.computed('task.progress', function() {
    return ((this.get('task.progress') * 100).toFixed(0) + '%');
  })

});
