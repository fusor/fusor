/* jslint node: true */
import { test } from 'qunit';
import moduleForAcceptance from '../helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | rhci start');

test('Cloudforms button should be disabled on starting new deployment',
  function(assert)
{
  expect(1);
  visit('/deployments/new/start');

  andThen(function() {
    assert.ok($('span#is_cloudforms').find('input').attr('disabled'));
  });
});

test('Selecting rhev should enable ability to select cloudforms',
  function(assert)
{
  expect(1);
  visit('/deployments/new/start');

  click('span#is_rhev > .product-item-checkbox > .ember-checkbox');

  andThen(function() {
    assert.notOk($('span#is_cloudforms').find('input').attr('disabled'));
  });
});

test('Selecting osp should enable ability to select cloudforms',
  function(assert)
{
  expect(1);
  visit('/deployments/new/start');

  click('span#is_openstack > .product-item-checkbox > .ember-checkbox');

  andThen(function() {
    assert.notOk($('span#is_cloudforms').find('input').attr('disabled'));
  });
});

test('Deselecting a previously active rhev should disable cloudforms',
  function(assert)
{
  expect(2);
  visit('/deployments/new/start');

  click('span#is_rhev > .product-item-checkbox > .ember-checkbox');

  andThen(function() {
    assert.notOk($('span#is_cloudforms').find('input').attr('disabled'));
  });

  click('span#is_rhev > .product-item-checkbox > .ember-checkbox');

  andThen(function() {
    assert.ok($('span#is_cloudforms').find('input').attr('disabled'));
  });
});
