import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('continue-deployment-modal', 'Integration | Component | continue deployment modal', {
  integration: true
});

test('it renders', function(assert) {
  assert.expect(2);

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{continue-deployment-modal}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#continue-deployment-modal}}
      template block text
    {{/continue-deployment-modal}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
