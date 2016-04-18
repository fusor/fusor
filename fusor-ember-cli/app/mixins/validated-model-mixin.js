import Ember from 'ember';

export default Ember.Mixin.create({
  validate(...fieldNames) {
    if (Ember.isEmpty(fieldNames)) {
      return this.validateAll();
    }

    for (let fieldName of fieldNames) {
      if (!this.validateField(fieldName)) {
        return false;
      }
    }

    return true;
  },

  validateField(fieldName) {
    let validation = this.get('validations').get(fieldName);
    return validation ? validation.isValid(this.get(fieldName)) : true;
  },

  validateAll() {
    let validations = this.get('validations');

    if (Ember.isEmpty(validations)) {
      return true;
    }

    for (let fieldName in validations) {
      if (validations.hasOwnProperty(fieldName) && !this.validateField(fieldName)) {
        return false;
      }
    }

    return true;
  }
});