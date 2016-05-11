import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'li',
  classNames: ['path-list-item', 'list_item_active'],

  isChecked: Ember.computed('selectedEnvironment', 'env', function () {
    return (this.get('selectedEnvironment') === this.get('env'));
  }),

  bgColor: Ember.computed('isChecked', 'disabled', 'isSelectable', function () {
    if (this.get('isSelectable')) {
      if (this.get('isChecked') && this.get('disabled')) {
        return 'env_path_disabled';
      } else if (this.get('isChecked')) {
        return 'env_path_active';
      } else {
        return null;
      }
    }
  }),

  isLibrary: Ember.computed('env', 'libraryEnv', function () {
    return (this.get('env') === this.get('libraryEnv'));
  }),

  isNonSelectableLibrary: Ember.computed('isLibrary', 'isSelectable', function () {
    return (this.get('isLibrary') && !(this.get('isSelectable')));
  }),

  envCssId: Ember.computed('env', function () {
    return ('env_' + this.get('env.id'));
  }),

  click() {
    if (!this.get('disabled') && this.get('isSelectable')) {
      this.sendAction('action', this.get('env'));
    }
  }

});
