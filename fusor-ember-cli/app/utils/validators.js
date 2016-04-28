import Ember from 'ember';

const Validator = Ember.Object.extend({
  isValid(value) {
    //override me
    return false;
  },

  isInvalid(value) {
    return !this.isValid(value);
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

const AllValidator = Validator.extend({
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

const AnyValidator = Validator.extend({
  isValid(value) {
    let validators = this.get('validators');
    return validators ? validators.any(validator => validator.isValid(value)) : true;
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

    let cleanValue = Ember.typeOf(value) === 'string' ? value.trim() : value;

    if (!this.get('selfIncluded')) {
      return !(existingValues.contains(cleanValue));
    }

    let numFound = 0;
    for (let i = 0; i < existingValues.length; i++) {
      let existingValue = Ember.typeOf(existingValues[i]) === 'string' ? existingValues[i].trim() : existingValues[i];
      if (existingValue === cleanValue) {
        numFound++;
      }
      if (numFound > 1) {
        return false;
      }
    }

    return true;
  }
});

// expects values to be set during construction:
// RegExp regExp;
// String message;
const RegExpValidator = Validator.extend({
  trim: true,

  isValid(value) {
    let trimmedValue = this.get('trim') && Ember.typeOf(value) === 'string' ? value.trim() : value;
    return Ember.isBlank(trimmedValue) || this.get('regExp').test(trimmedValue);
  }
});


const AlphaNumericDashUnderscoreValidator = RegExpValidator.extend({
  regExp: new RegExp(/^[A-Za-z0-9_-]*$/),
  message: "must contain only 'A-Z', 'a-z', '0-9', '_' or '-' characters"
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

const IpAddressValidator = RegExpValidator.extend({
  regExp: new RegExp([
      '^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)',
      '\\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)',
      '\\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)',
      '\\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$'
    ].join(''), ''),
  message: 'invalid ip address'
});

const CidrValidator = RegExpValidator.extend({
  regExp: new RegExp([
    '^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}',
    '([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])',
    '(\/([0-9]|[1-2][0-9]|3[0-2]))$'
  ].join(''), ''),
  message: 'invalid CIDR notation'
});

const MacAddressValidator = RegExpValidator.extend({
  regExp: new RegExp(/^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/),
  message: 'invalid mac address'
});

const HostnameValidator = RegExpValidator.extend({
  regExp: new RegExp(/^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9\-]*[A-Za-z0-9])$/),
  message: 'invalid hostname'
});

const HostAddressValidator = AnyValidator.extend({
  validators: [
    IpAddressValidator.create({}),
    HostnameValidator.create({})
  ],
  message: 'invalid host or ip address'
});

const NoTrailingSlashValidator = Validator.extend({
  message: 'You cannot have a trailing slash',
  isValid(value) {
    return value.slice(-1) !== '/';
  }
});

const LeadingSlashValidator = Validator.extend({
  message: 'You must have a leading slash',
  isValid(value) {
    return value.charAt(0) === '/';
  }
});

const NfsPathValidator = AllValidator.extend({
  validators: [
    LeadingSlashValidator.create({}),
    NoTrailingSlashValidator.create({})
  ]
});

function validateZipper(zipper){
  return zipper
    .map((pair) => pair[0].isValid(pair[1]))
    .reduce((lhs, rhs) => lhs && rhs);
}

export {
  Validator,
  AllValidator,
  AnyValidator,
  PresenceValidator,
  EqualityValidator,
  LengthValidator,
  PasswordValidator,
  UniquenessValidator,
  RegExpValidator,
  AlphaNumericDashUnderscoreValidator,
  IpRangeValidator,
  IpAddressValidator,
  CidrValidator,
  HostAddressValidator,
  MacAddressValidator,
  HostnameValidator,
  NfsPathValidator,
  validateZipper
};
