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
    assert.ok($('span#is_cloudforms').find('img').hasClass('disabledImage'));
  });
});

test('Selecting rhev should enable ability to select cloudforms',
  function(assert)
{
  expect(1);
  visit('/deployments/new/start');

  click('.rhci-item #is_rhev');

  andThen(function() {
    let isDisabled = $('span#is_cloudforms')
      .find('img')
      .hasClass('disabledImage');

    assert.notOk(isDisabled);
  });
});

test('Selecting osp should enable ability to select cloudforms',
  function(assert)
{
  expect(1);
  visit('/deployments/new/start');

  click('.rhci-item #is_openstack');

  andThen(function() {
    let isDisabled = $('span#is_cloudforms')
      .find('img')
      .hasClass('disabledImage');

    assert.notOk(isDisabled);
  });
});

test('Selecting rhev and osp should enable ability to select cloudforms',
  function(assert)
{
  expect(1);
  visit('/deployments/new/start');

  click('.rhci-item #is_rhev');
  click('.rhci-item #is_openstack');

  andThen(function() {
    let isDisabled = $('span#is_cloudforms')
      .find('img')
      .hasClass('disabledImage');

    assert.notOk(isDisabled);
  });
});

test('Deselecting a previously active rhev should disable cloudforms',
  function(assert)
{
  expect(2);
  visit('/deployments/new/start');

  click('.rhci-item #is_rhev');

  andThen(function() {
    let isDisabled = $('span#is_cloudforms')
      .find('img')
      .hasClass('disabledImage');

    assert.notOk(isDisabled);
  });

  click('.rhci-item #is_rhev');

  andThen(function() {
    let isDisabled = $('span#is_cloudforms')
      .find('img')
      .hasClass('disabledImage');

    assert.ok(isDisabled);
  });
});
