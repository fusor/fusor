import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('error-modal', 'Integration | Component | error modal', {
  integration: true
});

test('it renders', function(assert) {
  this.render(hbs`{{error-modal}}`);

  assert.equal(this.$('.modal-title').text().trim(), 'Error Occurred');
});
