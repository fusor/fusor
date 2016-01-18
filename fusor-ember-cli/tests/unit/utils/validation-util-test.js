import vu from '../../../utils/validation-util';
import { module, test } from 'qunit';

let validRanges = [
  '192.168.2.0',
  '192.168.2.0/3',
  '192.168.2.0/32',
  '192.168.153.0',
  '192.168.153.0/3',
  '192.168.153.0/32'
];

let invalidRanges = [
  null,
  undefined,
  '192.168.2.2000',
  '192.168.2.257',
  'garbage'
];

let validCIDR = [
  '192.168.153.0/3',
  '192.168.153.0/32'
];

let invalidCIDR = [
  null,
  undefined,
  '192.168.153.0',
  '192.168/32.153.0',
  '192.168/32.153.0/',
  '192.168/32.153.0/255',
  'garbage'
];

let validFullFormat = [
  '192.168.153.0/3',
  '192.168.153.0/32',
  '192.168.153.254/12',
  '192.68.1.0/2',
  '192.068.53.0/1',
  '192.168.153.0/22'
];

let invalidFullFormat = [
  null,
  undefined,
  '192.168.153.0',
  'garbage',
  '192.168/32.153.0/255',
];

let validMgmtAppName = [
  'GoodName',
  'Test_Symbols',
  '_Even.This-Is_Successful-'
];

let invalidMgmtAppName = [
  null,
  undefined,
  'Invalid*Symbols',
  'This$Wont()Work',
  'Garbage()^&'
];

module('Unit | Utility | validation util');

test('validateIpRange accepts valid ranges', function(assert) {
  assert.expect(validRanges.length);
  validRanges.map((val) => assert.ok(vu.validateIpRange(val)));
});

test('validateIpRange rejects bad values', function(assert) {
  assert.expect(invalidRanges.length);
  invalidRanges.map((val) => assert.notOk(vu.validateIpRange(val)));
});

test('validateCIDRFormat accepts valid CIDR notation', function(assert) {
  assert.expect(validCIDR.length);
  validCIDR.map((val) => assert.ok(vu.validateCIDRFormat(val)));
});

test('validateCIDRFormat rejects bad values', function(assert) {
  assert.expect(invalidCIDR.length);
  invalidCIDR.map((val) => assert.notOk(vu.validateCIDRFormat(val)));
});

test('validateIpRangeAndFormat accepts valid fully formatted values', function(assert) {
  assert.expect(validFullFormat.length);
  validFullFormat.map((val) => assert.ok(vu.validateIpRangeAndFormat(val)));
});

test('validateIpRangeAndFormat rejects bad values', function(assert) {
  assert.expect(invalidFullFormat.length);
  invalidFullFormat.map((val) => assert.notOk(vu.validateIpRangeAndFormat(val)));
});

test('validateMgmtAppName accepts valid names', function(assert) {
  assert.expect(validMgmtAppName.length);
  validMgmtAppName.map((val) => assert.ok(vu.validateMgmtAppName(val)));
});

test('validateMgmtAppName rejects invalid names', function(assert) {
  assert.expect(invalidMgmtAppName.length);
  invalidMgmtAppName.map((val) => assert.notOk(vu.validateMgmtAppName(val)));
});

