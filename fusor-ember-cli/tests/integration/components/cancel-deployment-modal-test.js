import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('cancel-deployment-modal', 'Integration | Component | cancel deployment modal', {
  integration: true
});

test('it renders', function(assert) {
  this.render(hbs`{{cancel-deployment-modal}}`);
  assert.equal(this.$('.modal-title').text().trim(), 'Cancel QCI Deployment');
});
