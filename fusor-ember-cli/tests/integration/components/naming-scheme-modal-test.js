import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('naming-scheme-modal', 'Integration | Component | naming scheme modal', {
  integration: true
});

test('it renders', function(assert) {
  
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });" + EOL + EOL +

  this.render(hbs`{{naming-scheme-modal}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:" + EOL +
  this.render(hbs`
    {{#naming-scheme-modal}}
      template block text
    {{/naming-scheme-modal}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
