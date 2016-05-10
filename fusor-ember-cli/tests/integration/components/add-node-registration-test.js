import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('add-node-registration', 'Integration | Component | add node registration', {
  integration: true
});

test('it renders', function(assert) {
  assert.expect(1);
  this.render(hbs`{{add-node-registration}}`);
  assert.equal(this.$('.modal-title').text().trim(), 'Add Node(s) to undefined');
});
