import Ember from 'ember';

export default Ember.Component.extend({

  typeInput: function() {
    return (this.get('type') ? this.get('type') : 'text');
  }.property('type'),

  validIsRequiredAndBlank: function() {
    return (this.get('isRequired') && Ember.isBlank(this.get('value')));
  }.property('value', 'isRequired'),

  isPassword: function() {
    return (this.get('type') === 'password');
  }.property('type'),

  passwordTooShort: function() {
    if (this.get('minChars')) {
      return (this.get('isPassword') && (this.get('value.length') < this.get('minChars')));
    }
  }.property('value', 'isPassword', 'minChars'),

  invalidIsAlphaNumeric: function() {
    if (this.get('isAlphaNumeric')) {
        var validAlphaNumbericRegex = new RegExp(/^[A-Za-z0-9_-]+$/);
        if (Ember.isPresent(this.get('value'))) {
            return !(this.get('value').match(validAlphaNumbericRegex));
        }
    }
  }.property('value', 'isAlphaNumeric'),

  invalidIsHostname: function() {
    if (this.get('isHostname')) {
       var validHostnameRegex = "^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9\-]*[A-Za-z0-9])$";
       if (Ember.isPresent(this.get('value'))) {
            return !(this.get('value').match(validHostnameRegex));
        }
    }
  }.property('value', 'isHostname'),

  hasError: function() {
    return (this.get('showValidationError') &&
            (Ember.isPresent(this.get('errors.name')) ||
             this.get('passwordTooShort') ||
             this.get('validIsRequiredAndBlank') ||
             this.get('validIsUnique') ||
             this.get('invalidIsAlphaNumeric') ||
             this.get('invalidIsHostname')
            )
           );
  }.property('showValidationError', 'errors.name', 'passwordTooShort',
             'validIsRequiredAndBlank', 'validIsUnique',
             'invalidIsAlphaNumeric', 'invalidIsHostname'),

  setOrigValue: function() {
    console.log('didInsertElement');
    this.set('origValue', this.get('value'));
    console.log(this.get('origValue'));
  }.on('didInsertElement'),

  validIsUnique: function() {
    if (this.get('isUnique')) {
        var uniqueNames = this.get('uniqueValues').removeObject(this.get('origValue'));
        return uniqueNames.contains(this.get('value'));
    }
  }.property('uniqueValues', 'value', 'isUnique'),

  eyeIcon: 'fa-eye',
  isEyeOpen: true,

  actions: {
    showValidationErrors: function() {
      this.set("showValidationError", true);
    },

    showPassword: function() {
      this.set('isEyeOpen', this.toggleProperty('isEyeOpen'));
      if (this.get('isEyeOpen')) {
          this.set('typeInput', 'password');
          return this.set('eyeIcon', "fa-eye");
      } else {
          this.set('typeInput', 'text');
          return this.set('eyeIcon', "fa-eye-slash");
      }
    }
  }
});
