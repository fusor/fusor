import Ember from 'ember';

export default Ember.Route.extend({

  model: function() {
    // Use UUID from consumer (management application) to get subscriptions
    // GET /customer_portal/consumers/#{CONSUMER['uuid']}/entitlements
    var self = this;
    var consumerUUID        = this.modelFor('subscriptions').get('consumerUUID');
    var urlEntitlements     = ('/customer_portal/consumers/' + consumerUUID + '/entitlements');
    var urlAllPools         = ('/customer_portal/pools?consumer=' + consumerUUID + '&listall=false');
    var entitlementsResults = $.getJSON(urlEntitlements);
    var allPoolsResults     = $.getJSON(urlAllPools);

    return Ember.RSVP.Promise.all([entitlementsResults, allPoolsResults]).then(function(results) {
      console.log(results[0]);
      console.log(results[1]);
      self.modelFor('subscriptions').set('isAuthenticated', true); // in case go to this route from URL
      results[1].forEach(function(item){

          item['qtyTotal'] = item.quantity;
          item['qtyAvailable'] = item.quantity - item.consumed;
          item['qtyAvailableOfTotal'] = item['qtyAvailable'] + ' of ' + item['qtyTotal'];

          item['qtyAttached'] = 0; //default for loop
          results[0].forEach(function(entitlementItem) {
            if (entitlementItem.pool.id === item.id) {
              item['qtyAttached'] = item['qtyAttached'] + entitlementItem.quantity;
            }
          });
      });
      return Ember.A(results[1]);
    }, function() {
         self.modelFor('subscriptions').set('isAuthenticated');
         self.modelFor('subscriptions').save().then(function() {
           self.controllerFor('subscriptions.credentials').setProperties({
                                                               'showErrorMessage': true,
                                                               'errorMsg': 'You are not currently logged in. Please log in below.'
                                                             });
           return self.transitionTo('subscriptions.credentials');
         });
    });
  },

  actions: {
      error: function(reason) {
        console.log(reason);
        alert(reason.statusText);
      },
  }

});
