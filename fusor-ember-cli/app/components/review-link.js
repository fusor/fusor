import Ember from 'ember';

export default Ember.Component.extend({

  // all these values can be overwritten
  isRequired: false,
  isDefault: false,
  useYieldInstead: false,
  isExternalURL: false,
  validationMessage: 'required field',
  defaultMessage: 'default',

  eyeIcon: 'fa-eye',
  isEyeOpen: true,

  showValidationMessage: Ember.computed('isRequired', 'value', function() {
    return (this.get('isRequired') && Ember.isBlank(this.get('value')));
  }),

  showDefaultMessage: Ember.computed('isDefault', 'value', function() {
    return (this.get('isDefault') && Ember.isBlank(this.get('value')));
  }),

  valueFormatted: Ember.computed('isPassword', 'isEyeOpen', 'value', function() {
    if (this.get('isPassword') && this.get('isEyeOpen') && Ember.isPresent(this.get('value'))) {
      return '********';
    } else {
      return this.get('value');
    }
  }),

  isNotALink: Ember.computed('isExternalURL', 'routeName', function() {
    return (Ember.isBlank(this.get('routeName')) && !(this.get('isExternalURL')));
  }),

  actions: {
    showPassword() {
      this.set('isEyeOpen', this.toggleProperty('isEyeOpen'));
      if (this.get('isEyeOpen')) {
          return this.set('eyeIcon', "fa-eye");
      } else {
          return this.set('eyeIcon', "fa-eye-slash");
      }
    }
  }

});
