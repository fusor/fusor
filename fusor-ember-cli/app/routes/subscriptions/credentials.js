import Ember from 'ember';

export default Ember.Route.extend({

  setupController: function(controller, model) {
    controller.set('model', model);

    var sessionPortal = this.modelFor('subscriptions');
    var upstream_consumer_uuid = this.modelFor('deployment').get('upstream_consumer_uuid');
    // check if org has upstream UUID using Katello V2 API
    var orgID = this.modelFor('deployment').get('organization.id')
    var url = '/katello/api/v2/organizations/' + orgID;
    $.getJSON(url).then(function(results) {
        controller.set('organizationUpstreamConsumerUUID', results.owner_details.upstreamConsumer.uuid);
        controller.set('organizationUpstreamConsumerName', results.owner_details.upstreamConsumer.name);
        // if (Ember.isBlank(upstream_consumer_uuid)) {
        //   controller.set('upstream_consumer_uuid', results.owner_details.upstreamConsumer.uuid)
        //   controller.set('upstream_consumer_name', results.owner_details.upstreamConsumer.name)
        // }
    });
  },

  actions: {
    error: function(reason, transition) {
      // bubble up this error event:
      return true;
    },

    loginPortal: function() {
      var self = this;
      var controller = this.controllerFor('subscriptions/credentials')
      var identification = controller.get('identification');
      var password = controller.get('password');
      var token = $('meta[name="csrf-token"]').attr('content');

      return new Ember.RSVP.Promise(function (resolve, reject) {
        Ember.$.ajax({
            url: '/customer_portal/login/',
            type: "POST",
            data: JSON.stringify({username: identification, password: password}),
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "X-CSRF-Token": token,
            },
            success: function(response) {
              //show always be {} empty successful 200 response
              self.send('saveCredentials');
            },
            error: function(response){
              console.log('error on loginPortal');
              return self.send('error');
            }
        });
      });
    },

    logoutPortal: function() {
      var self = this;
      var controller = this.controllerFor('subscriptions/credentials')
      var token = $('meta[name="csrf-token"]').attr('content');

      return new Ember.RSVP.Promise(function (resolve, reject) {
        Ember.$.ajax({
            url: '/customer_portal/logout/',
            type: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "X-CSRF-Token": token,
            },
            success: function(response) {
              //show always be {} empty successful 200 response
              self.modelFor('subscriptions').setProperties({'isAuthenticated': false,
                                               'identification': null,
                                               'ownerKey': null,
                                               'consumerUUID': null});
              self.modelFor('subscriptions').save();
            },
            error: function(response){
              console.log('error on loginPortal');
              return self.send('error');
            }
        });
      });
    },
    saveCredentials: function() {
      var self = this;
      var controller = this.controllerFor('subscriptions/credentials')
      var identification = controller.get('identification');
      var sessionPortal = this.modelFor('subscriptions');
      if (sessionPortal) {
        sessionPortal.set('identification', identification)
      } else {
        var sessionPortal = self.store.createRecord('session-portal', {identification: identification});
      }
      sessionPortal.save().then(function(result) {
          console.log('saved session-portal')
          controller.set('showErrorMessage',false)
          return self.send('authenticatePortal');
      }, function(response) {
          console.log('error saving session-portal');
          return self.send('error');
      });
    },

    authenticatePortal: function() {

      var controller = this.controllerFor('subscriptions/credentials')
      var identification = controller.get('identification');
      var password = controller.get('password');
      var token = $('meta[name="csrf-token"]').attr('content');
      var self = this;
      var url = '/customer_portal/users/' + identification + "/owners";

      return new Ember.RSVP.Promise(function (resolve, reject) {
        Ember.$.ajax({
            url: url,
            type: "GET",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "X-CSRF-Token": token,
            },

            success: function(response) {
              var ownerKey = response[0]['key'];
              console.log('owner key is ' + ownerKey);
              var sessionPortal = self.modelFor('subscriptions');
              sessionPortal.set('ownerKey', ownerKey);
              sessionPortal.set('isAuthenticated', true);
              sessionPortal.save().then(function(result) {
                  console.log('saved ownerKey in session-portal')
                  return self.transitionTo('subscriptions.management-application');
              }, function(response) {
                  console.log('error saving ownerKey session-portal');
              });
            },

            error: function(response){
                console.log('error on authenticatePortal');
                controller.setProperties({'showErrorMessage': true,
                                          'errorMsg': 'Your username or password is incorrect. Please try again.'
                                          })
            }
        });
      });

    }

  }
});

