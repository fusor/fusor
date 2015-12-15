import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('host-type-icon', 'Integration | Component | host type icon', {
  integration: true
});

test('it show vm-icon-16 image if isVM is true', function(assert) {
  this.render(hbs`{{host-type-icon isVM=true}}`);
  assert.equal(this.$('img').attr('src'), '/assets/r/vm-icon-16.png');
});

test('it show pficon-screen icon if isVM is false', function(assert) {
  this.render(hbs`{{host-type-icon isVM=false}}`);
  assert.ok(this.$('span.pficon-screen'));
});
