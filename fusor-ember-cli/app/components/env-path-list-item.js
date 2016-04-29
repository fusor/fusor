import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'li',
  classNames: ['path-list-item', 'list_item_active'],

  isChecked: Ember.computed('selectedEnvironment', 'env', function () {
    return (this.get('selectedEnvironment') === this.get('env'));
  }),

  bgColor: Ember.computed('isChecked', 'disabled', function () {
    if (this.get('isChecked') && this.get('disabled')) {
      return 'env_path_disabled';
    } else if (this.get('isChecked')) {
      return 'env_path_active';
    } else {
      return null;
    }
  }),

  envCssId: Ember.computed('env', function () {
    return ('env_' + this.get('env.id'));
  }),

  click() {
    if (!this.get('disabled')) {
      this.sendAction('action', this.get('env'));
    }
  }

});
