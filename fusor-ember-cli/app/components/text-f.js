import Ember from 'ember';
import ValidatedInput from '../mixins/validated-input-mixin';

export default Ember.Component.extend(ValidatedInput, {

  typeInput: Ember.computed('type', function () {
    return (this.get('type') ? this.get('type') : 'text');
  }),

  cssFormClass: Ember.computed('preText', 'postText', 'canShowPassword', function () {
    if (Ember.isEmpty(this.get('preText')) && Ember.isEmpty(this.get('postText'))) {
      return this.get('canShowPassword') ? 'form-control can-show-password' : 'form-control';
    }
  }),

  isPassword: Ember.computed('type', function () {
    return (this.get('type') === 'password');
  }),

  inputLength: Ember.computed('maxlength', function() {
    return this.getWithDefault('maxlength', '250');
  }),

  setOrigValue: Ember.on('didInsertElement', function () {
    this.set('origValue', this.get('value'));
  }),

  eyeIcon: 'fa-eye',
  isEyeOpen: true,

  actions: {
    showPassword() {
      this.set('isEyeOpen', this.toggleProperty('isEyeOpen'));
      if (this.get('isEyeOpen')) {
        this.set('typeInput', 'password');
        this.set('eyeIcon', 'fa-eye');
      } else {
        this.set('typeInput', 'text');
        this.set('eyeIcon', 'fa-eye-slash');
      }
    }
  }
});
