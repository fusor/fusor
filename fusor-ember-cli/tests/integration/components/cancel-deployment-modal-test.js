import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('cancel-deployment-modal', 'Integration | Component | cancel deployment modal', {
  integration: true
});

test('it renders', function(assert) {
  
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });" + EOL + EOL +

  this.render(hbs`{{cancel-deployment-modal}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:" + EOL +
  this.render(hbs`
    {{#cancel-deployment-modal}}
      template block text
    {{/cancel-deployment-modal}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
