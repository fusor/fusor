import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'li',
  classNames: ['path-list-item', 'list_item_active'],

  isChecked: function () {
    return (this.get('selectedEnvironment') === this.get('env'));
  }.property('selectedEnvironment', 'env'),

  bgColor: function () {
    if (this.get('isChecked')) {
      return 'env_path_active';
    } else {
      return null;
    }
  }.property('isChecked'),

  click: function(event) {
    this.sendAction('action', this.get('env'));
  }

});
