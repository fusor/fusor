import Ember from 'ember';

export default Ember.Component.extend({

  classNames: ['button-selection'],

  classNameBindings: ['buttonSelectionSelected', 'buttonDisabled'],

  buttonSelectionSelected: Ember.computed('value', 'groupValue', function() {
    return (this.get('value') === this.get('groupValue'));
  }),

  buttonDisabled: Ember.computed('disabled', function() {
    return this.get('disabled');
  }),

  click() {
    if (!this.get('disabled')) {
      return this.sendAction('changed', this.get('value'));
    }
  }

});
