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

          item['qtyAttached'] = 0 //default for loop
          results[0].forEach(function(entitlementItem) {
            if (entitlementItem.pool.id === item.id) {
              item['qtyAttached'] = item['qtyAttached'] + entitlementItem.quantity;
            }
          });
      });
      return Ember.A(results[1]);
    }, function() {
         self.modelFor('subscriptions').set('isAuthenticated')
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

      attachSubscriptions: function() {
        var token = $('meta[name="csrf-token"]').attr('content');
        var sessionPortal = this.modelFor('subscriptions');
        var ownerKey = sessionPortal.get('ownerKey');
        var consumerUUID = sessionPortal.get('consumerUUID');
        var self = this;
        var controller = this.controllerFor('subscriptions/select-subscriptions');
        var subscriptions = this.controllerFor('subscriptions/select-subscriptions').get('model');

        subscriptions.forEach(function(item){
          // default to 0 of
          controller.set('attachingInProgress', true);
          controller.set('showAttachedSuccessMessage', false);

          console.log(item);
          console.log('qtyToAttach is');
          console.log(item.qtyToAttach);
          console.log('pool ID is');
          console.log(item.id);
          console.log('isSelectedSubscription is');
          console.log(item.isSelectedSubscription);

          if (item.isSelectedSubscription) {

            // POST /customer_portal/consumers/#{CONSUMER['uuid']}/entitlements?pool=#{POOL['id']}&quantity=#{QUANTITY}
            var url = '/customer_portal/consumers/' + consumerUUID + "/entitlements?pool=" + item.id + "&quantity=" + item.qtyToAttach;

            return new Ember.RSVP.Promise(function (resolve, reject) {
              Ember.$.ajax({
                  url: url,
                  type: "POST",
                  headers: {
                      "Accept": "application/json",
                      "Content-Type": "application/json",
                      "X-CSRF-Token": token,
                  },

                  success: function(response) {
                    controller.set('attachingInProgress', false);
                    controller.set('showAttachedSuccessMessage', true);
                    console.log('successfully attached ' + item.qtyToAttach + ' subscription for pool ' + item.id);
                  },

                  error: function(response){
                    console.log('error on attachSubscriptions');
                    return self.send('error');
                  }
              });
            });

          }
        });
      },

      error: function(reason, transition) {
        console.log(reason);
        //alert(reason.statusText);
      },
  }

});
