import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('naming-scheme-modal', 'Integration | Component | naming scheme modal', {
  integration: true
});

test('it renders', function(assert) {
  this.render(hbs`{{naming-scheme-modal}}`);
  assert.equal(this.$('.modal-title').text().trim(), 'Edit Naming Scheme');
});
