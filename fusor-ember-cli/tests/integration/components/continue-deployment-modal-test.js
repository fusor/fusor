import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import startMirage from '../../helpers/start-mirage';

moduleForComponent('continue-deployment-modal', 'Integration | Component | continue deployment modal', {
  integration: true,
  beforeEach() {
    startMirage(this.container);
  },
  afterEach() {
    window.server.shutdown();
  }
});

test('it renders', function(assert) {
  const mockDeployment = server.create('deployment', {name: 'deploy111'});
  this.set('mockDeployment', mockDeployment);

  this.render(hbs`{{continue-deployment-modal deployment=mockDeployment}}`);

  assert.equal(this.$('.modal-title').text().trim(), 'Continue QCI Deployment - deploy111');
});
