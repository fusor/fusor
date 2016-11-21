import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('ose-node-details', 'Integration | Component | ose node details', {
  integration: true
});

test('it renders', function(assert) {
  
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });" + EOL + EOL +

  this.render(hbs`{{ose-node-details title='test title'}}`);

  let contents = this.$('.ose-node-details-title').text();
  assert.ok(contents.indexOf('test title') >= 0);
});
