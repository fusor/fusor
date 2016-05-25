import Ember from 'ember';

export default Ember.Component.extend({

  isInvalid: Ember.computed.not('isValid'),

  validationMessages: Ember.computed('value', function() {
    return [ 'must select an option' ];
  }),

  hasError: Ember.computed(
    'showValidationError',
    'errors.name',
    'isInvalid',
    function() {
      return this.get('showValidationError') && this.get('isInvalid');
    }
  ),

  showValidationError: false // Sane default if not bound to external property
});

