import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('edit-global-service-config', 'Integration | Component | edit global service config', {
  integration: true
});

test('it renders', function(assert) {
  assert.expect(1);
  this.render(hbs`{{edit-global-service-config}}`);
  assert.equal(this.$('.modal-title').text().trim(), 'Edit Global Configuration');
});
