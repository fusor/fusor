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
    return (this.get('showValidationError') &&
            (Ember.isPresent(this.get('errors.name')) ||
             this.get('passwordTooShort') ||
             this.get('validIsRequiredAndBlank') ||
             this.get('validIsUnique')
            )
           );
  }.property('showValidationError', 'errors.name', 'passwordTooShort', 'validIsRequiredAndBlank'),

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

  actions: {
    showValidationErrors: function() {
      this.set("showValidationError", true);
    }
  }
});
