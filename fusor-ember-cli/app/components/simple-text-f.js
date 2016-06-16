import Ember from 'ember';

export default Ember.Component.extend({

  typeInput: Ember.computed('type', function() {
    return (this.get('type') ? this.get('type') : 'text');
  }),

  isValid: Ember.computed('value', 'validator', 'errors.name', 'validIsRequiredAndBlank', function() {
    if (Ember.isPresent(this.get('errors.name')) || this.get('validIsRequiredAndBlank')) {
      return false;
    }

    let validator = this.get('validator');
    return validator ? validator.isValid(this.get('value')) : true;
  }),

  isInvalid: Ember.computed.not('isValid'),

  hasError: Ember.computed('showValidationError', 'errors.name', 'isInvalid', function () {
    return this.get('showValidationError') && this.get('isInvalid');
  }),

  validationMessages: Ember.computed('value', 'validator', 'validIsRequiredAndBlank', function() {
    if (this.get('validIsRequiredAndBlank')) {
      return ['cannot be blank'];
    }

    let validator = this.get('validator');
    return validator ? validator.getMessages(this.get('value')) : [];
  }),

  actions: {
    showValidationErrors() {
      this.set("showValidationError", true);
    },

    resetValidationErrors() {
      this.set("showValidationError", false);
    }
  }
});
