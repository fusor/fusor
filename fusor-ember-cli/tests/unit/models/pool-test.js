import { moduleForModel, test } from 'ember-qunit';

moduleForModel('pool', 'Unit | Model | pool', {
  // Specify the other units that are required for this test.
  needs: []
});

test('it exists', function(assert) {
  var model = this.subject();
  // var store = this.store();
  assert.ok(!!model);
});

test('qtyAvailable is calculated corrected', function(assert){
  var model = this.subject();
  Ember.run(function() {
    model.set('quantity', 10);
    model.set('consumed', 3);
  });
  assert.equal(model.get('qtyAvailable'), 7);
});

test('qtyAvailableOfTotal is Unlimited if qtyAvailable returns -1', function(assert){
  var model = this.subject();
  Ember.run(function() {
    model.set('quantity', 0);
    model.set('consumed', 1);
  });
  assert.equal(model.get('qtyAvailable'), -1);
  assert.equal(model.get('qtyAvailableOfTotal'), "Unlimited");
});

test('qtyAvailableOfTotal is correctly outputed', function(assert){
  var model = this.subject();
  Ember.run(function() {
    model.set('quantity', 100);
    model.set('consumed', 55);
  });
  assert.equal(model.get('qtyAvailableOfTotal'), "45 of 100");
});
