import DS from 'ember-data';

export default DS.JSONSerializer.extend({

  // remove attribute keys in the json response that aren't in the model management application
  normalize(modelClass, hash) {
    delete hash.consumer;
    delete hash.certificates;
    // move attributes within the 'pool' node to main level
    hash.poolId = hash.pool.id;
    hash.poolType = hash.pool.type;
    hash.poolQuantity = hash.pool.quantity;
    hash.subscriptionId = hash.pool.subscriptionId;
    hash.activeSubscription = hash.pool.activeSubscription;
    hash.contractNumber = hash.pool.contractNumber;
    hash.accountNumber = hash.pool.accountNumber;
    hash.consumed = hash.pool.consumed;
    hash.exported = hash.pool.exported;
    hash.consumed = hash.pool.consumed;
    hash.productName = hash.pool.productName;
    delete hash.pool;
    return this._super(modelClass, hash);
  }

});
