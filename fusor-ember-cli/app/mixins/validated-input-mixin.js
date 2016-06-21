import Ember from 'ember';

export default Ember.Mixin.create({

  didInsertElement: function () {
    let resetErrorsMessageKey = this.get('resetErrorsMessageKey');
    if (resetErrorsMessageKey) {
      this.eventBus.on(resetErrorsMessageKey,
        () => this.send('resetValidationErrors'));
    }
  },
  willClearRender: function () {
    let resetErrorsMessageKey = this.get('resetErrorsMessageKey');
    if (resetErrorsMessageKey) {
      this.eventBus.off(resetErrorsMessageKey);
    }
  },

  validIsRequiredAndBlank: Ember.computed('value', 'isRequired', function () {
    return (this.get('isRequired') && Ember.isBlank(this.get('value')));
  }),

  isValid: Ember.computed('value', 'validator', 'errors.name', 'validIsRequiredAndBlank', function () {
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

  validationMessages: Ember.computed('value', 'validator', 'validIsRequiredAndBlank', function () {
    if (this.get('validIsRequiredAndBlank')) {
      return ['This field cannot be blank.'];
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
