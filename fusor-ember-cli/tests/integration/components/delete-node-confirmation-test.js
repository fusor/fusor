import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('delete-node-confirmation', 'Integration | Component | delete node confirmation', {
  integration: true
});

test('it renders', function(assert) {
  assert.expect(1);
  this.render(hbs`{{delete-node-confirmation}}`);
  assert.equal(this.$('.modal-title').text().trim(), 'Delete Node undefined');
});
