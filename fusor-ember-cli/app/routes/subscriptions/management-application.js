import Ember from 'ember';

export default Ember.Route.extend({

  model: function() {
    var self = this;
    var sessionPortal = this.modelFor('subscriptions');
    var ownerKey = sessionPortal.get('ownerKey');
    // Use owner key to get consumers (subscription application manangers)
    // GET /customer_portal/owners/#{OWNER['key']}/consumers?type=satellite
    var url = ('/customer_portal/owners/' + ownerKey + '/consumers?type=satellite');

    return $.getJSON(url).then(function(results) {
        sessionPortal.set('isAuthenticated', true); // in case go to this route from URL
        sessionPortal.save()
      return results;
      }, function() {
         sessionPortal.set('isAuthenticated',false);
         sessionPortal.save().then(function() {
            self.controllerFor('subscriptions.credentials').setProperties({
                                                               'showErrorMessage': true,
                                                               'errorMsg': 'You are not currently logged in. Please log in below.'
                                                             })
            return self.transitionTo('subscriptions.credentials');
         });
      }
    );

  },

  setupController: function(controller, model) {
    controller.set('model', model);
    controller.set('sessionPortal', this.modelFor('subscriptions'))
  },

  actions: {
      error: function(reason, transition) {
        // bubble up this error event:
        return true;
      }
  }


});
