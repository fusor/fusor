import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('new-environment-modal', 'Integration | Component | new environment modal', {
  integration: true
});

test('it renders', function(assert) {
  assert.expect(1);
  this.render(hbs`{{new-environment-modal}}`);
  assert.equal(this.$('.modal-title').text().trim(), 'Enter New Environment');
});
