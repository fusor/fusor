import Ember from 'ember';
import { EqualityValidator, PasswordValidator } from '../utils/validators';

export default Ember.Mixin.create({

  passwordValidator: PasswordValidator.create({}),

  confirmCommonPasswordValidator: Ember.computed('commonPassword', function() {
    return EqualityValidator.create({equals: this.get('commonPassword')});
  }),

  isValidCommonPassword: Ember.computed(
    'commonPassword',
    'confirmCommonPassword',
    'confirmCommonPasswordValidator',
    function () {
      return this.get('passwordValidator').isValid(this.get('commonPassword')) &&
             this.get('confirmCommonPasswordValidator').isValid(this.get('confirmCommonPassword'));
    })
});
