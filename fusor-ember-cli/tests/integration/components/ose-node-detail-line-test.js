import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('ose-node-detail-line', 'Integration | Component | ose node detail line', {
  integration: true
});

test('it renders', function(assert) {
  
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });" + EOL + EOL +

  this.render(hbs`{{ose-node-detail-line}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:" + EOL +
  this.render(hbs`
    {{#ose-node-detail-line}}
      template block text
    {{/ose-node-detail-line}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
