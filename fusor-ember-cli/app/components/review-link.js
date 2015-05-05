import Ember from 'ember';

export default Ember.Component.extend({

  // all these values can be overwritten
  isRequired: false,
  isDefault: false,
  useYieldInstead: false,
  isPassword: false,
  validationMessage: 'required field',
  defaultMessage: 'default',

  showValidationMessage: function() {
    return (this.get('isRequired') && Ember.isBlank(this.get('value')));
  }.property('isRequired', 'value'),

  showDefaultMessage: function() {
    return (this.get('isDefault') && Ember.isBlank(this.get('value')));
  }.property('isDefault', 'value'),

  valueFormatted: function() {
    if (this.get('isPassword') && Ember.isPresent(this.get('value'))) {
      return '********';
    } else {
      return this.get('value');
    }
  }.property('isPassword', 'value')

});
