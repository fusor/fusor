import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('pagination-footer', 'Integration | Component | pagination footer', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });" + EOL + EOL +

  this.render(hbs`{{pagination-footer routeName='deployments'
                                      totalCnt=25
                                      pageNumber=1
                                      totalPages=2
                                      pageRange=[1,2]}}`);

  assert.equal(this.$('.displaying-entries').text().trim(), 'Displaying entries 1 - 20 of 25 in total');

});
