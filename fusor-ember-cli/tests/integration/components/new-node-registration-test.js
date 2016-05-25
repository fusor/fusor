import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('new-node-registration', 'Integration | Component | new node registration', {
  integration: true
});

test('it renders', function(assert) {
  assert.expect(1);
  this.render(hbs`{{new-node-registration isStep1=true}}`);
  assert.equal(this.$('.modal-title').text().trim(), 'Register Nodes');
});
