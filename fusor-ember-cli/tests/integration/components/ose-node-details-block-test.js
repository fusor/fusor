import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('ose-node-details-block', 'Integration | Component | ose node details block', {
  integration: true
});

test('it renders', function(assert) {
  
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });" + EOL + EOL +

  this.render(hbs`{{ose-node-details-block}}`);

  let contents = this.$('.ose-node-details-block').text();
  assert.ok(contents.indexOf('vCPU') >= 0);
  assert.ok(contents.indexOf('RAM') >= 0);
  assert.ok(contents.indexOf('Disk') >= 0);
});
