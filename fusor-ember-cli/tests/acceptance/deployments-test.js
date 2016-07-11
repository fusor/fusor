import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from 'fusor-ember-cli/tests/helpers/start-app';
var application;

module('Acceptance | deployments', {
  beforeEach: function() {
    application = startApp();
  },

  afterEach: function() {
    Ember.run(application, 'destroy');
  }
});

test('visiting /deployments', function(assert) {
    visit('/deployments');

    andThen(function() {
        assert.equal(currentURL(), '/deployments');
    });
});

test('user should see all elements on deployments page', function(assert) {

    var org = server.create('organization');
    var env = server.create('lifecycle_environment');
    server.createList('deployment', 10, {organization_id: org.id, lifecycle_environment_id: env.id});

    visit('/deployments');

    andThen(function() {
        assert.equal(currentURL(), '/deployments');
        assert.equal(find('h1').text(), 'Deployments');
        assert.equal($.trim(find('.new-deployment-button').text()),
                     'New Deployment');
        assert.equal($.trim(find('.form-group button').text()),
                     'Search');
        assert.equal($.trim(find('.filter-deployments input').attr('placeholder')),
                     'Filter ...');
        assert.equal($.trim(find('table.deployments-table > thead > tr > th:nth-child(1)').text()),
                     'Name');
        assert.equal($.trim(find('table.deployments-table > thead > tr > th:nth-child(2)').text()),
                     'Environment');
        assert.equal($.trim(find('table.deployments-table > thead > tr > th:nth-child(3)').text()),
                     'Organization');
        assert.equal($.trim(find('table.deployments-table > thead > tr > th:nth-child(4)').text()),
                     'Status');
        assert.equal(find('tr.deployment-row').length, 10);
        assert.equal($.trim(find('.displaying-entries').text()), 'Displaying entries 1 - 20 of 107 in total');
    });
});

test('user clicks on New Deployment button', function(assert) {
    var org = server.create('organization');
    var env = server.create('lifecycle_environment');

    visit('/deployments');
    click('.new-deployment-button a');

    andThen(function() {
        assert.equal('/deployments/new/start', currentURL());
    });
});

test('deployment name, org, env names are correct', function(assert) {
    var org = server.create('organization');
    var env = server.create('lifecycle_environment');
    server.createList('deployment', 1, {organization_id: org.id, lifecycle_environment_id: env.id});

    visit('/deployments');

    andThen(function() {
        assert.equal(find('tr.deployment-row').length, 1);

        var deployment_name = find('tr.deployment-row:first-child > td:nth-child(1) > a');
        var env_name        = find('tr.deployment-row:first-child > td:nth-child(2)');
        var org_name        = find('tr.deployment-row:first-child > td:nth-child(3)');
        assert.equal($.trim(deployment_name.text()), 'deployment_number_0');
        assert.equal($.trim(env_name.text()), 'env 0');
        assert.equal($.trim(org_name.text()), 'org 0');
    });
});

test('user can filter list of deployments', function(assert) {
    var org = server.create('organization');
    var env = server.create('lifecycle_environment');
    server.createList('deployment', 11, {organization_id: org.id, lifecycle_environment_id: env.id});

    visit('/deployments');

    fillIn('input.filter-input', '1');
    andThen(function() {
        var deployments = find('tr.deployment-row');
        assert.equal(deployments.length, 2);  // deployment name 1 and 10
    });

    fillIn('input.filter-input', '7');
    andThen(function() {
        var deployments = find('tr.deployment-row');
        assert.equal(deployments.length, 1);  // deployment name 7 only
    });

    fillIn('input.filter-input', 'deploy');
    andThen(function() {
        var deployments = find('tr.deployment-row');
        assert.equal(deployments.length, 11); // all 11
    });
});
