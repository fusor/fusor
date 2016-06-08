import Ember from 'ember';
import request from 'ic-ajax';

export default Ember.Route.extend({

  model() {
    // Verify isAuthenticated: true is accurate, since Satellite session may have changed
    const sessionPortal =  this.modelFor('subscriptions').sessionPortal;
    const cachedIsAuthenticated = sessionPortal.get('isAuthenticated');

    if (cachedIsAuthenticated) {
      return this.confirmAuthenticated(sessionPortal)
        .then((isAuthenticated) => {
          if(isAuthenticated) {
            return sessionPortal;
          } else {
            sessionPortal.set('isAuthenticated', false);
            return sessionPortal.save();
          }
        });
    } else {
      return Ember.RSVP.resolve(sessionPortal);
    }
  },

  setupController(controller, model) {
    controller.set('model', model);
    controller.set('showErrorMessage', false);
  },

  deactivate() {
    this.send('saveDeployment', null);
  },

  actions: {
    error() {
      // bubble up this error event:
      return true;
    },

    loginPortal() {
      var self = this;
      var controller = this.controllerFor('subscriptions/credentials');
      var identification = controller.get('model.identification');
      var password = controller.get('password');
      var token = Ember.$('meta[name="csrf-token"]').attr('content');

      controller.set('nextButtonTitle', "Logging in ...");
      controller.set('disableCredentialsNext', true);

      request({
        url: '/customer_portal/login/',
        type: "POST",
        data: JSON.stringify({username: identification, password: password}),
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "X-CSRF-Token": token
        }
      }).then(function(response) {
        //show always be {} empty successful 200 response
        self.send('saveCredentials');
      }, function(error) {
        controller.set('nextButtonTitle', "Next");
        controller.set('disableCredentialsNext', false);
        self.send('error');
      });
    },

    logoutPortal() {
      var self = this;
      var token = Ember.$('meta[name="csrf-token"]').attr('content');

      return new Ember.RSVP.Promise(function (resolve, reject) {
        request({
          url: '/customer_portal/logout/',
          type: "POST",
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "X-CSRF-Token": token
          }
        }).then(function(response) {
          //show always be {} empty successful 200 response
          const sessionPortal = self.modelFor('subscriptions').sessionPortal;
          sessionPortal.setProperties({
            'isAuthenticated': false,
            'identification': null,
            'ownerKey': null,
            'consumerUUID': null
          });

          sessionPortal.save();
        }, function(error) {
          self.send('error');
        });
      });

    },

    saveCredentials() {
      var self = this;
      var controller = this.controllerFor('subscriptions/credentials');
      var identification = controller.get('model.identification');
      var sessionPortal = this.modelFor('subscriptions').sessionPortal;
      if (sessionPortal) {
        sessionPortal.set('identification', identification);
      } else {
        sessionPortal = self.store.createRecord('session-portal', {identification: identification});
      }
      sessionPortal.save().then(function(result) {
        controller.set('showErrorMessage',false);
        self.send('authenticatePortal');
      }, function(response) {
        controller.set('nextButtonTitle', "Next");
        controller.set('disableCredentialsNext', false);
        self.send('error');
      });
    },

    authenticatePortal() {
      var controller = this.controllerFor('subscriptions/credentials');
      var identification = controller.get('model.identification');
      var token = Ember.$('meta[name="csrf-token"]').attr('content');
      var self = this;
      var url = '/customer_portal/users/' + identification + "/owners";

      return new Ember.RSVP.Promise(function (resolve, reject) {
        request({
          url: url,
          type: "GET",
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "X-CSRF-Token": token
          }
        }).then(function(response) {
          var ownerKey = response[0]['key'];
          var sessionPortal = self.modelFor('subscriptions').sessionPortal;
          sessionPortal.set('ownerKey', ownerKey);
          sessionPortal.set('isAuthenticated', true);
          sessionPortal.save().then(function(result) {
            controller.set('nextButtonTitle', "Next");
            controller.set('disableCredentialsNext', false);
            self.transitionTo('subscriptions.management-application');
          }, function(response) {
            controller.set('nextButtonTitle', "Next");
            controller.set('disableCredentialsNext', false);
          });
        }, function(response) {
          controller.set('nextButtonTitle', "Next");
          controller.set('disableCredentialsNext', false);
          controller.setProperties({
            'showErrorMessage': true,
            'errorMsg': 'Your username or password is incorrect. Please try again.'
          });
        });
      });
    },

    redirectToManagementApplication() {
      this.transitionTo('subscriptions.management-application');
    }
  },

  confirmAuthenticated(sessionPortal) {
    return new Ember.RSVP.Promise((resolve, reject) => {
      const urlVerify =
        `/customer_portal/users/${sessionPortal.get('identification')}/owners`;

      Ember.$.getJSON(urlVerify).then(
        () => resolve(true), () => resolve(false));
    });
  }
});
