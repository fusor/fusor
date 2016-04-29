import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('new-satellite-modal', 'Integration | Component | new satellite modal', {
  integration: true
});

test('it renders', function(assert) {
  this.render(hbs`{{new-satellite-modal}}`);
  assert.equal(this.$('.modal-title').text().trim(), 'New Subscription Management Application');
});
