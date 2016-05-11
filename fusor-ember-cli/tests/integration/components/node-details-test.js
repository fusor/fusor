import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('node-details', 'Integration | Component | node details', {
  integration: true
});

test('it renders', function(assert) {
  
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });" + EOL + EOL +

  this.render(hbs`{{node-details}}`);

  let contents = this.$('.env-summary-title').text();
  assert.ok(contents.indexOf('Node Details') >= 0);
});
