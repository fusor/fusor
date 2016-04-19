import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('ose-summary-needed-available', 'Integration | Component | ose summary needed available', {
  integration: true
});

test('it renders', function(assert) {
  
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });" + EOL + EOL +

  this.render(hbs`{{ose-summary-needed-available}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:" + EOL +
  this.render(hbs`
    {{#ose-summary-needed-available}}
      template block text
    {{/ose-summary-needed-available}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
