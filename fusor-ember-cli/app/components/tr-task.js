import Ember from 'ember';

export default Ember.Component.extend({

  tagName: 'tr',

  actionNameAndRepository: function() {
    return (this.get('task.humanized_name') + ' ' + (this.get('task.repository') || ''));
  }.property('task.humanized_name', 'task.repository')

});
