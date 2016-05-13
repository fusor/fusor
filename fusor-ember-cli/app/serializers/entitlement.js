import DS from 'ember-data';

export default DS.RESTSerializer.extend({

  // add root node 'entitlements' that customer protal JSON response doesn't return
  extractArray(store, type, payload) {
    payload = { entitlements: payload };
    return this._super(store, type, payload);
  },

  // remove attribute keys in the json response that aren't in the model management application
  normalizeHash: {
    entitlements(hash) {
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
      return hash;
    }
  }

});
