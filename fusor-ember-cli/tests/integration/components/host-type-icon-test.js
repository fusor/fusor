import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('host-type-icon', 'Integration | Component | host type icon', {
  integration: true
});

test('it shows vm-icon-16 image and hides pficon-screen if isVM is true', function(assert) {
  this.render(hbs`{{host-type-icon isVM=true}}`);
  assert.equal(this.$('img').attr('src'), '/assets/r/vm-icon-16.png');
  assert.notOk(this.$('span.pficon-screen')[0]);
});

test('it shows vm-icon-16 image and hides pficon-screen if isVM is true and isInverted is false', function(assert) {
  this.render(hbs`{{host-type-icon isVM=true isInverted=false}}`);
  assert.equal(this.$('img').attr('src'), '/assets/r/vm-icon-16.png');
  assert.notOk(this.$('span.pficon-screen')[0]);
});

test('it shows vm-icon-inverted-16 image and hides pficon-screen if isVM is true and isInverted is true', function(assert) {
  this.render(hbs`{{host-type-icon isVM=true isInverted=true}}`);
  assert.equal(this.$('img').attr('src'), '/assets/r/vm-icon-inverted-16.png');
  assert.notOk(this.$('span.pficon-screen')[0]);
});

test('it shows pficon-screen icon and hides images if isVM is false', function(assert) {
  this.render(hbs`{{host-type-icon isVM=false}}`);
  assert.ok(this.$('span.pficon-screen')[0]);
  assert.notOk(this.$('img').attr('src'));
});
