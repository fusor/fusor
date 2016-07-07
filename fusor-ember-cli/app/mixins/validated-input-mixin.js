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
    // this action is triggered on focus-out
    showValidationErrors() {
      this.set("showValidationError", true);
    },

    // this action is triggered on key-down. it cancels any existing time
    // and sets new timer of 1 second until showing any validation errors
    showValidationErrorsKeyDown() {
      let showValidationTimer = this.get('showValidationTimer');

      if (showValidationTimer) {
        Ember.run.cancel(showValidationTimer);
      }

      this.set("showValidationError", false);
      showValidationTimer = Ember.run.later(() => this.set("showValidationError", true), 1000);
      this.set('showValidationTimer', showValidationTimer);
    },

    resetValidationErrors() {
      this.set("showValidationError", false);
    }
  }
});
