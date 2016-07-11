import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('column-name', 'Integration | Component | column name', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });" + EOL + EOL +

  this.render(hbs`{{column-name name='Environment'
                                col_name="lifecycle_environment"
                                sort_by="lifecycle_environment"
                                dir="DESC"}}`);

  assert.equal(this.$().text().trim(), '▼ Environment');

});
