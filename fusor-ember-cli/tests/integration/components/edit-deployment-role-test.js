import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('edit-deployment-role', 'Integration | Component | edit deployment role', {
  integration: true
});

test('it renders', function(assert) {
  assert.expect(1);
  this.render(hbs`{{edit-deployment-role}}`);
  assert.equal(this.$('.modal-title').text().trim(), 'Edit Deployment Role - undefined');
});