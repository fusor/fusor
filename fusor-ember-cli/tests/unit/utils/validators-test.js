import {
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
} from '../../../utils/validators';


import { module, test } from 'qunit';

module('Unit | Utility | validators');

test('PresenceValidator accepts valid values', function (assert) {
  let presenceValidator = PresenceValidator.create({});
  let validValues = [
    {},
    '\n\t Hello',
    'Hello world',
    [1, 2, 3]
  ];
  validValues.forEach((value) => {
    assert.ok(presenceValidator.isValid(value));
    assert.equal(presenceValidator.getMessages(value).length, 0);
  });
});

test('PresenceValidator rejects invalid values', function (assert) {
  let presenceValidator = PresenceValidator.create({});
  let invalidValues = [
    null,
    undefined,
    '',
    [],
    '\n\t',
    '  '
  ];
  invalidValues.forEach((value) => {
    assert.notOk(presenceValidator.isValid(value));
    assert.equal(presenceValidator.getMessages(value).length, 1);
    assert.equal(presenceValidator.getMessages(value)[0], 'cannot be blank');
  });
});

test('EqualityValidator accepts valid values', function (assert) {
  let equalityValidator = EqualityValidator.create({equals: 'test equals'});
  assert.ok(equalityValidator.isValid('test equals'));
  assert.equal(equalityValidator.getMessages('test equals').length, 0);
});

test('EqualityValidator rejects invalid values', function (assert) {
  let equalityValidator = EqualityValidator.create({equals: 'test equals'});
  assert.notOk(equalityValidator.isValid('should fail'));
  assert.equal(equalityValidator.getMessages('should fail').length, 1);
  assert.equal(equalityValidator.getMessages('should fail')[0], 'does not match');
});

test('LengthValidator accepts valid minimum length', function (assert) {
  let lengthValidator = LengthValidator.create({min: 5});
  let validValues = [
    'test5',
    'test 6',
    'test test test test test test test test test test test test test test'
  ];

  validValues.forEach((value) => {
    assert.ok(lengthValidator.isValid(value));
    assert.equal(lengthValidator.getMessages(value).length, 0);
  });
});

test('LengthValidator rejects invalid minimum length', function (assert) {
  let lengthValidator = LengthValidator.create({min: 5});
  assert.notOk(lengthValidator.isValid('fail'));
  assert.equal(lengthValidator.getMessages('fail').length, 1);
  assert.equal(lengthValidator.getMessages('fail')[0], 'must be 5 or more characters');
});

test('LengthValidator rejects blank values', function (assert) {
  let lengthValidator = LengthValidator.create({});
  let invalidValues = [
    null,
    undefined,
    ''
  ];

  invalidValues.forEach((value) => {
    assert.notOk(lengthValidator.isValid(value));
    assert.equal(lengthValidator.getMessages(value).length, 1);
    assert.equal(lengthValidator.getMessages(value)[0], 'cannot be blank');
  });
});

test('LengthValidator accepts valid maximum length', function (assert) {
  let lengthValidator = LengthValidator.create({max: 6});
  let validValues = [
    'test5',
    'test 6'
  ];

  validValues.forEach((value) => {
    assert.ok(lengthValidator.isValid(value));
    assert.equal(lengthValidator.getMessages(value).length, 0);
  });
});

test('LengthValidator rejects invalid maximum length', function (assert) {
  let lengthValidator = LengthValidator.create({max: 5});
  assert.notOk(lengthValidator.isValid('failure'));
  assert.equal(lengthValidator.getMessages('failure').length, 1);
  assert.equal(lengthValidator.getMessages('failure')[0], 'must be 5 characters or less');
});

test('PasswordValidator accepts valid passwords', function (assert) {
  let passwordValidator = PasswordValidator.create({});
  let validValues = [
    'minimum8',
    'specialchars@#$%specialchars'
  ];

  validValues.forEach((value) => {
    assert.ok(passwordValidator.isValid(value));
    assert.equal(passwordValidator.getMessages(value).length, 0);
  });
});

test('PasswordValidator rejects invalid passwords', function (assert) {
  let passwordValidator = PasswordValidator.create({});
  assert.notOk(passwordValidator.isValid('shortpw'));
  assert.equal(passwordValidator.getMessages('shortpw').length, 1);
  assert.equal(passwordValidator.getMessages('shortpw')[0], 'must be 8 or more characters');
});

test('PasswordValidator rejects blank values', function (assert) {
  let passwordValidator = PasswordValidator.create({});
  let invalidValues = [
    null,
    undefined,
    ''
  ];

  invalidValues.forEach((value) => {
    assert.notOk(passwordValidator.isValid(value));
    assert.equal(passwordValidator.getMessages(value).length, 1);
    assert.equal(passwordValidator.getMessages(value)[0], 'cannot be blank');
  });
});

test('UniquenessValidator accepts values not in existingValues', function (assert) {
  let uniquenessValidator = UniquenessValidator.create({existingValues: ['other1', 'other2']});
  assert.ok(uniquenessValidator.isValid('valid'));
  assert.equal(uniquenessValidator.getMessages('valid').length, 0);
});

test('UniquenessValidator rejects values already in existingValues', function (assert) {
  let uniquenessValidator = UniquenessValidator.create({existingValues: ['reject', 'other2']});
  assert.notOk(uniquenessValidator.isValid('reject'));
  assert.equal(uniquenessValidator.getMessages('reject').length, 1);
  assert.equal(uniquenessValidator.getMessages('reject')[0], 'must be unique');
});

test('RegExpValidator accepts matching values', function (assert) {
  let regExpValidator = RegExpValidator.create({
    regExp: new RegExp(/A/),
    message: 'invalid chars'
  });
  assert.ok(regExpValidator.isValid('A'));
  assert.equal(regExpValidator.getMessages('A').length, 0);
});

test('RegExpValidator rejects non-matching values', function (assert) {
  let regExpValidator = RegExpValidator.create({
    regExp: new RegExp(/A/),
    message: 'invalid chars'
  });
  assert.notOk(regExpValidator.isValid('F'));
  assert.equal(regExpValidator.getMessages('F').length, 1);
  assert.equal(regExpValidator.getMessages('F')[0], 'invalid chars');
});

test('AlphaNumericDashUnderscoreValidator accepts valid values', function (assert) {
  let anduValidator = AlphaNumericDashUnderscoreValidator.create({});
  let validValues = [
      'UpperAndLowerCase',
      'Underscores_are_ok',
      'Dashes-are-ok',
      'Upper-Lower_and_Dashes-and_Underscores'
    ];

  validValues.forEach((value) => {
    assert.ok(anduValidator.isValid(value));
    assert.equal(anduValidator.getMessages(value).length, 0);
  });
});

test('AlphaNumericDashUnderscoreValidator rejects invalid values', function (assert) {
  let anduValidator = AlphaNumericDashUnderscoreValidator.create({});
  let invalidValues = [
    'BadSymbol!',
    'BadSymbol#',
    'BadSymbol^',
    'Spaces NotAllowed'
  ];
  invalidValues.forEach((value) => {
    assert.notOk(anduValidator.isValid(value));
    assert.equal(anduValidator.getMessages(value).length, 1);
    assert.equal(anduValidator.getMessages(value)[0], "must contain only 'A-Z', 'a-z', '0-9', '_' or '-' characters");
  });
});

test('IpRangeValidator accepts valid values', function (assert) {
  let ipRangeValidator = IpRangeValidator.create({});
  let validValues = [
    '192.168.2.0',
    '192.168.2.0/3',
    '192.168.2.0/32',
    '192.168.153.0',
    '192.168.153.0/3',
    '192.168.153.0/32'
  ];

  validValues.forEach((value) => {
    assert.ok(ipRangeValidator.isValid(value));
    assert.equal(ipRangeValidator.getMessages(value).length, 0);
  });
});

test('IpRangeValidator rejects invalid values', function (assert) {
  let ipRangeValidator = IpRangeValidator.create({});
  let invalidValues = [
    null,
    undefined,
    '192.168.2.2000',
    '192.168.2.257',
    'garbage'
  ];
  invalidValues.forEach((value) => {
    assert.notOk(ipRangeValidator.isValid(value));
    assert.equal(ipRangeValidator.getMessages(value).length, 1);
    assert.equal(ipRangeValidator.getMessages(value)[0], 'invalid network range');
  });
});

test('CidrValidator accepts valid values', function (assert) {
  let cidrValidator = CidrValidator.create({});
  let validValues = [
    '192.168.153.0/3',
    '192.168.153.0/32',
    '192.168.153.254/12',
    '192.68.1.0/2',
    '192.068.53.0/1',
    '192.168.153.0/22'
  ];

  validValues.forEach((value) => {
    assert.ok(cidrValidator.isValid(value));
    assert.equal(cidrValidator.getMessages(value).length, 0);
  });
});


test('CidrValidator rejects invalid values', function (assert) {
  let cidrValidator = CidrValidator.create({});
  let invalidValues = [
    null,
    undefined,
    '192.168.2.2000',
    '192.168.2.257',
    'garbage',
    '192.168.153.0',
    '192.168.153.0/255'
  ];
  invalidValues.forEach((value) => {
    assert.notOk(cidrValidator.isValid(value));
    assert.equal(cidrValidator.getMessages(value).length, 1);
    assert.equal(cidrValidator.getMessages(value)[0], 'invalid CIDR notation');
  });
});

test('HostnameValidator accepts valid values', function (assert) {
  let hostnameValidator = HostnameValidator.create({});
  let validValues = [
    'ValidHostName',
    'Valid-Host-Name'
  ];

  validValues.forEach((value) => {
    assert.ok(hostnameValidator.isValid(value));
    assert.equal(hostnameValidator.getMessages(value).length, 0);
  });
});

test('HostnameValidator rejects invalid values', function (assert) {
  let hostnameValidator = HostnameValidator.create({});
  let invalidValues = [
    'spaces invalid',
    'underscores_are_invalid',
    'special%chars',
    '.startsWithPeriod'
  ];
  invalidValues.forEach((value) => {
    assert.notOk(hostnameValidator.isValid(value));
    assert.equal(hostnameValidator.getMessages(value).length, 1);
    assert.equal(hostnameValidator.getMessages(value)[0], 'invalid hostname');
  });
});
