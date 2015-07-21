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
    return (this.get('isPassword') && (this.get('value.length') < 8));
  }.property('value', 'isPassword'),

  hasError: function() {
    return (Ember.isPresent(this.get('errors.name')) || this.get('passwordTooShort') || this.get('validIsRequiredAndBlank'));
  }.property('errors.name', 'passwordTooShort', 'validIsRequiredAndBlank'),

  actions: {
     showValidationErrors: function() {
       this.set("showValidationError", true);
     }
   }

});
