import Ember from 'ember';
import LoginControllerMixin from 'simple-auth/mixins/login-controller-mixin';

export default Ember.ObjectController.extend(LoginControllerMixin, {
  needs: ['application'],
  //authenticator: 'authenticator:foreman',
  authenticator: 'simple-auth-authenticator:oauth2-password-grant',

  identification: null,
  password: null,
  errorMessage: null,

  actions: {

    // authenticate called from LoginControllerMixin,
    authenticate: function() {
      var self = this;
      return this._super().then(function() {
          return self.transitionTo('rhci');
        }, function() {
          return self.set('errorMessage', "Your username or password is incorrect. Please try again.");
      });
    },

    authenticateSession: function(authType) {
      var self = this;
      return this.get('session').authenticate('simple-auth-authenticator:torii', authType+'-oauth2').then(function() {
        console.log(self.get('session.content'));
        return self.transitionToRoute('rhci');
      });
    },

    authenticateWithFacebook: function() {
        var self = this;
        this.get('session').authenticate(
            'simple-auth-authenticator:torii',
            "facebook-oauth2"
        ).then(
            function() {
                var authCode = self.get('session.authorizationCode');
                // Ember.$.ajax({
                //         type: "POST",
                //         url: window.ENV.host + "/facebook/auth.json",
                //         data: JSON.stringify({
                //                 auth_code: authCode
                //         }),
                //         contentType: "application/json; charset=utf-8",
                //         dataType: "json",
                //         success: function(data) {
                //                 // TODO : manage access_token and save it to the session
                //         },
                //         failure: function(errMsg) {
                //                 // TODO : manage error
                //         }
                // });
            },
            function(error) {
                alert('There was an error when trying to sign you in: ' + error);
            }
        );
    }

  }
});
