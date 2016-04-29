import Humanize from '../../../utils/humanize';

import { module, test } from 'qunit';

module('Unit | Utility | humanize');

test('should convert raw GB to humanized GB', function (assert) {
  assert.equal(Humanize.rawToHuman(1073741824), '1 GB');
  assert.equal(Humanize.rawToHuman(1000000000), '953.67 MB');
});

test('should convert humanized GB label to raw bytes', function (assert) {
  assert.equal(Humanize.humanToRaw('1 GB'), 1073741824);
  assert.equal(Humanize.humanToRaw('15.7 GB'), 16857746636);
  assert.equal(Humanize.humanToRaw('1.0 MB'), 1048576);
  assert.equal(Humanize.humanToRaw('1.0 KB'), 1024);
  assert.equal(Humanize.humanToRaw('500 B'), 500);
});

test('should convert humanized TB label to raw bytes', function (assert) {
  assert.equal(Humanize.humanToRaw('1 TB'), 1099511627776);
  assert.equal(Humanize.humanToRaw('10 TB'), 10995116277760);
  assert.equal(Humanize.humanToRaw('10.44 TB'), 11478901393981);
  assert.equal(Humanize.humanToRaw('200.44 TB'), 220386110671421);
});

test('should convert raw TB to human', function (assert) {
  assert.equal(Humanize.rawToHuman(1099511627776), '1 TB');
  assert.equal(Humanize.rawToHuman(10995116277760), '10 TB');
  assert.equal(Humanize.rawToHuman(11478901393981), '10.44 TB');
  assert.equal(Humanize.rawToHuman(220386110671421),'200.44 TB');
});

test('0 raw to human should return "0 B"', function (assert) {
  assert.equal(Humanize.rawToHuman(0), '0 B');
});
