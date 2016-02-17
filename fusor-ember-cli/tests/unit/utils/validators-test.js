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
  MacAddressValidator,
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
    assert.ok(presenceValidator.isInvalid(value));
    assert.notOk(presenceValidator.isValid(value));
    assert.equal(presenceValidator.getMessages(value).length, 1);
    assert.equal(presenceValidator.getMessages(value)[0], 'cannot be blank');
  });
});

test('EqualityValidator accepts valid values', function (assert) {
  let equalityValidator = EqualityValidator.create({equals: 'test equals'});
  const value = 'test equals';
  assert.ok(equalityValidator.isValid(value));
  assert.notOk(equalityValidator.isInvalid(value));
  assert.equal(equalityValidator.getMessages(value).length, 0);
});

test('EqualityValidator rejects invalid values', function (assert) {
  let equalityValidator = EqualityValidator.create({equals: 'test equals'});
  const value = 'should fail';
  assert.ok(equalityValidator.isInvalid(value));
  assert.notOk(equalityValidator.isValid(value));
  assert.equal(equalityValidator.getMessages(value).length, 1);
  assert.equal(equalityValidator.getMessages(value)[0], 'does not match');
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
    assert.notOk(lengthValidator.isInvalid(value));
    assert.equal(lengthValidator.getMessages(value).length, 0);
  });
});

test('LengthValidator rejects invalid minimum length', function (assert) {
  let lengthValidator = LengthValidator.create({min: 5});
  const value = 'fail';
  assert.ok(lengthValidator.isInvalid(value));
  assert.notOk(lengthValidator.isValid(value));
  assert.equal(lengthValidator.getMessages(value).length, 1);
  assert.equal(lengthValidator.getMessages(value)[0], 'must be 5 or more characters');
});

test('LengthValidator rejects blank values', function (assert) {
  let lengthValidator = LengthValidator.create({});
  let invalidValues = [
    null,
    undefined,
    ''
  ];

  invalidValues.forEach((value) => {
    assert.ok(lengthValidator.isInvalid(value));
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
    assert.notOk(lengthValidator.isInvalid(value));
    assert.equal(lengthValidator.getMessages(value).length, 0);
  });
});

test('LengthValidator rejects invalid maximum length', function (assert) {
  let lengthValidator = LengthValidator.create({max: 5});
  const value = 'failure';
  assert.ok(lengthValidator.isInvalid(value));
  assert.notOk(lengthValidator.isValid(value));
  assert.equal(lengthValidator.getMessages(value).length, 1);
  assert.equal(lengthValidator.getMessages(value)[0], 'must be 5 characters or less');
});

test('PasswordValidator accepts valid passwords', function (assert) {
  let passwordValidator = PasswordValidator.create({});
  let validValues = [
    'minimum8',
    'specialchars@#$%specialchars'
  ];

  validValues.forEach((value) => {
    assert.ok(passwordValidator.isValid(value));
    assert.notOk(passwordValidator.isInvalid(value));
    assert.equal(passwordValidator.getMessages(value).length, 0);
  });
});

test('PasswordValidator rejects invalid passwords', function (assert) {
  let passwordValidator = PasswordValidator.create({});
  const value = 'shortpw';
  assert.ok(passwordValidator.isInvalid(value));
  assert.notOk(passwordValidator.isValid(value));
  assert.equal(passwordValidator.getMessages(value).length, 1);
  assert.equal(passwordValidator.getMessages(value)[0], 'must be 8 or more characters');
});

test('PasswordValidator rejects blank values', function (assert) {
  let passwordValidator = PasswordValidator.create({});
  let invalidValues = [
    null,
    undefined,
    ''
  ];

  invalidValues.forEach((value) => {
    assert.ok(passwordValidator.isInvalid(value));
    assert.notOk(passwordValidator.isValid(value));
    assert.equal(passwordValidator.getMessages(value).length, 1);
    assert.equal(passwordValidator.getMessages(value)[0], 'cannot be blank');
  });
});

test('UniquenessValidator accepts values not in existingValues', function (assert) {
  let uniquenessValidator = UniquenessValidator.create({existingValues: ['other1', 'other2']});
  const value = 'valid';
  assert.ok(uniquenessValidator.isValid(value));
  assert.equal(uniquenessValidator.getMessages(value).length, 0);
});

test('UniquenessValidator rejects values already in existingValues', function (assert) {
  let uniquenessValidator = UniquenessValidator.create({existingValues: ['reject', 'other2']});
  const value = 'reject';
  assert.notOk(uniquenessValidator.isValid(value));
  assert.equal(uniquenessValidator.getMessages(value).length, 1);
  assert.equal(uniquenessValidator.getMessages(value)[0], 'must be unique');
});

test('RegExpValidator accepts matching values', function (assert) {
  let regExpValidator = RegExpValidator.create({
    regExp: new RegExp(/A/),
    message: 'invalid chars'
  });
  const value = 'A';
  assert.ok(regExpValidator.isValid(value));
  assert.equal(regExpValidator.getMessages(value).length, 0);
});

test('RegExpValidator rejects non-matching values', function (assert) {
  let regExpValidator = RegExpValidator.create({
    regExp: new RegExp(/A/),
    message: 'invalid chars'
  });
  const value = 'F';
  assert.notOk(regExpValidator.isValid(value));
  assert.equal(regExpValidator.getMessages(value).length, 1);
  assert.equal(regExpValidator.getMessages(value)[0], 'invalid chars');
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
    assert.notOk(anduValidator.isInvalid(value));
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
    assert.ok(anduValidator.isInvalid(value));
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
    assert.notOk(ipRangeValidator.isInvalid(value));
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
    assert.ok(ipRangeValidator.isInvalid(value));
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
    assert.notOk(cidrValidator.isInvalid(value));
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
    assert.ok(cidrValidator.isInvalid(value));
    assert.notOk(cidrValidator.isValid(value));
    assert.equal(cidrValidator.getMessages(value).length, 1);
    assert.equal(cidrValidator.getMessages(value)[0], 'invalid CIDR notation');
  });
});

test('MacAddressValidator accepts valid values', function (assert) {
  let macAddressValidator = MacAddressValidator.create({});
  let validValues = [
    '12:AA:B2:9C:d4:ef',
    '12-AA-B2-9C-d4-ef',
    '12:AA-B2:9C-d4:ef'
  ];

  validValues.forEach((value) => {
    assert.ok(macAddressValidator.isValid(value));
    assert.notOk(macAddressValidator.isInvalid(value));
    assert.equal(macAddressValidator.getMessages(value).length, 0);
  });
});

test('MacAddressValidator rejects invalid values', function (assert) {
  let macAddressValidator = MacAddressValidator.create({});
  let invalidValues = [
    '1:AA:B2:9C:d4:ef',
    '12:AA:B2:9C:d:ef',
    '12:AA:B2:9C:d4',
    '12:AA:B2:9C:d4:def',
    '12:AA:B2:9C:D4:FG',
    '12_AA_B2_9C_d4_ef'
  ];
  invalidValues.forEach((value) => {
    assert.ok(macAddressValidator.isInvalid(value));
    assert.notOk(macAddressValidator.isValid(value));
    assert.equal(macAddressValidator.getMessages(value).length, 1);
    assert.equal(macAddressValidator.getMessages(value)[0], 'invalid mac address');
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
    assert.notOk(hostnameValidator.isInvalid(value));
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
    assert.ok(hostnameValidator.isInvalid(value));
    assert.notOk(hostnameValidator.isValid(value));
    assert.equal(hostnameValidator.getMessages(value).length, 1);
    assert.equal(hostnameValidator.getMessages(value)[0], 'invalid hostname');
  });
});
