import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('tr-subscription-manifest', 'Integration | Component | tr subscription manifest', {
  integration: true
});

test('it renders', function(assert) {
  assert.expect(2);

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{tr-subscription-manifest}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#tr-subscription-manifest}}
      template block text
    {{/tr-subscription-manifest}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
