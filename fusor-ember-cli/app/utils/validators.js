import Ember from 'ember';

const Validator = Ember.Object.extend({
  isValid(value) {
    //override me
    return false;
  },

  getMessages(value) {
    if (this.isValid(value)) {
      return [];
    }
    let message = this.get('message');
    if (message) {
      return [message];
    }
    let messages = this.get('messages');
    return messages ? messages : [`${value} is invalid`];
  }
});

const AggregateValidator = Validator.extend({
  isValid(value) {
    let validators = this.get('validators');
    return validators ? validators.every(validator => validator.isValid(value)) : true;
  },

  getMessages(value) {
    let message = this.get('message'), messages = [], validators = this.get('validators');

    if (message) {
      return this.isValid(value) ? [] : [message];
    }

    if (validators) {
      validators.forEach(validator =>
        validator.getMessages(value).forEach(message => messages.push(message))
      );
    }

    return messages;
  }
});

const PresenceValidator = Validator.extend({
  message: 'cannot be blank',

  isValid(value) {
    return Ember.isPresent(value);
  }
});

// expects values to be set during construction:
// equals;
const EqualityValidator = Validator.extend({
  message: 'does not match',

  isValid(value) {
    return value === this.get('equals');
  }
});

const LengthValidator = Validator.extend({
  isValid(value) {
    let min = this.get('min'), max = this.get('max');

    return Ember.isPresent(value) &&
      (Ember.isBlank(min) || value.length >= min) &&
      (Ember.isBlank(max) || value.length <= max);
  },

  getMessages(value) {
    let min = this.get('min'), max = this.get('max');

    //Avoid double failing with presence validator
    if (!Ember.isPresent(value)) {
      return ['cannot be blank'];
    }

    if (Ember.isPresent(min) && value.length < min) {
      return [`must be ${min} or more characters`];
    }

    if (Ember.isPresent(max) && value.length > max) {
      return [`must be ${max} characters or less`];
    }

    return [];
  }
});

const PasswordValidator = LengthValidator.extend({
  min: 8
});

// expects values to be set during construction:
// Array[String] values;
const UniquenessValidator = Validator.extend({
  message: 'must be unique',

  isValid(value) {
    let existingValues = this.get('existingValues');
    if (!existingValues) {
      return true;
    }
    return !(existingValues.contains(value));
  }
});

// expects values to be set during construction:
// RegExp regExp;
// String message;
const RegExpValidator = Validator.extend({
  isValid(value) {
    let trimmedValue = value ? value.trim() : value;
    return this.get('regExp').test(trimmedValue);
  }
});


const AlphaNumericDashUnderscoreValidator = RegExpValidator.extend({
  regExp: new RegExp(/^[A-Za-z0-9_-]*$/),
  message: "must contain only 'A-Z', 'a-z', '0-9', '_' or '-' characters",
});

const IpRangeValidator = RegExpValidator.extend({
  regExp: new RegExp([
      '\\b(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)',
      '\\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)',
      '\\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)',
      '\\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\b'
    ].join(''), ''),
  message: 'invalid network range'
});

const CidrValidator = AggregateValidator.extend({
  validators: [
      IpRangeValidator.create({}),
      RegExpValidator.create({regExp: new RegExp(/\/(3[0-2]|[1-2]?[0-9])$/)})
    ],
  message: 'invalid CIDR notation'
});

const HostnameValidator = RegExpValidator.extend({
  regExp: new RegExp(/^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9\-]*[A-Za-z0-9])$/),
  message: 'invalid hostname'
});

export {
  Validator,
  AggregateValidator,
  PresenceValidator,
  EqualityValidator,
  LengthValidator,
  PasswordValidator,
  UniquenessValidator,
  RegExpValidator,
  AlphaNumericDashUnderscoreValidator,
  IpRangeValidator,
  CidrValidator,
  HostnameValidator
};
