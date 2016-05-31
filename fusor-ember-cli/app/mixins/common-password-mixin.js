import Ember from 'ember';
import { EqualityValidator, PasswordValidator, AnyValidator } from '../utils/validators';

export default Ember.Mixin.create({

  passwordValidator: Ember.computed('commonPassword', function() {
    if (Ember.isPresent(this.get('commonPassword'))) {
      return PasswordValidator.create({});
    } else {
      return AnyValidator.create({});
    }
  }),

  confirmCommonPasswordValidator: Ember.computed('commonPassword', function() {
    if (Ember.isPresent(this.get('commonPassword'))) {
      return EqualityValidator.create({equals: this.get('commonPassword')});
    } else {
      return AnyValidator.create({});
    }
  }),

  isValidCommonPassword: Ember.computed('commonPassword', 'confirmCommonPassword', 'confirmCommonPasswordValidator',
    function () {
      if (Ember.isBlank(this.get('commonPassword')) && Ember.isBlank(this.get('commonPassword'))) {
        return true;
      } else {
        return this.get('passwordValidator').isValid(this.get('commonPassword')) &&
               this.get('confirmCommonPasswordValidator').isValid(this.get('confirmCommonPassword'));
      }
    }
  )

});
