import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('abandon-deployment-modal', 'Integration | Component | abandon deployment modal', {
  integration: true
});

test('it renders', function(assert) {
  
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });" + EOL + EOL +

  this.render(hbs`{{abandon-deployment-modal}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:" + EOL +
  this.render(hbs`
    {{#abandon-deployment-modal}}
      template block text
    {{/abandon-deployment-modal}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
