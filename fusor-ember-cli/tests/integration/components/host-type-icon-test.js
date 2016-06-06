import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('host-type-icon', 'Integration | Component | host type icon', {
  integration: true
});

test('it shows pficon-screen icon if isVM is false', function(assert) {
  this.render(hbs`{{host-type-icon isVM=false}}`);
  assert.ok(this.$('span.pficon-screen')[0]);
  assert.notOk(this.$('span.pficon-virtual-machine')[0]);
});

test('it shows pficon-virtual-machine icon if isVM is true', function(assert) {
  this.render(hbs`{{host-type-icon isVM=true}}`);
  assert.notOk(this.$('span.pficon-screen')[0]);
  assert.ok(this.$('span.pficon-virtual-machine')[0]);
});
