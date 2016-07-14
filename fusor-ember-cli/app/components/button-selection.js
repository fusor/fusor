import Ember from 'ember';

export default Ember.Component.extend({

  classNames: ['button-selection'],

  classNameBindings: ['buttonSelectionSelected', 'buttonDisabled'],

  buttonSelectionSelected: Ember.computed(
    'value',
    'groupValue',
    'customFocused',
    function() {
      return (this.get('value') === this.get('groupValue')) &&
        !this.get('customFocused');
    }
  ),

  buttonDisabled: Ember.computed('disabled', function() {
    return this.get('disabled');
  }),

  cssId: Ember.computed('buttonType', 'value', function() {
    return `${this.get('buttonType')}-${this.get('value')}`;
  }),

  click() {
    if (!this.get('disabled')) {
      this.sendAction('changed', this.get('value'));
    }
  }

});
