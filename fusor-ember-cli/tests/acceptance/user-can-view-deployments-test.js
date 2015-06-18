import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from 'fusor-ember-cli/tests/helpers/start-app';

var application;

module('Acceptance | user can view deployments', {
  beforeEach: function() {
    application = startApp();
  },

  afterEach: function() {
    Ember.run(application, 'destroy');
  }
});

test('visiting /user-can-view-deployments', function(assert) {
  visit('/deployments');

  andThen(function() {
    assert.equal(currentURL(), '/deployments');
  });
});
