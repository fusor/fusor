import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'li',
  classNames: ['path-list-item', 'list_item_active'],

  isChecked: function () {
    return (this.get('selectedEnvironment') === this.get('env'));
  }.property('selectedEnvironment', 'env'),

  bgColor: function () {
    if (this.get('isChecked') && this.get('disabled')) {
      return 'env_path_disabled';
    } else if (this.get('isChecked')) {
      return 'env_path_active';
    } else {
      return null;
    }
  }.property('isChecked', 'disabled'),

  envCssId: function () {
    return ('env_' + this.get('env.id'));
  }.property('env'),

  click: function() {
    if (!this.get('disabled')) {
      return this.sendAction('action', this.get('env'));
    }
  }

});
