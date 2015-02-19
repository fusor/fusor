import Ember from 'ember';
import LoginControllerMixin from 'simple-auth/mixins/login-controller-mixin';

export default Ember.ObjectController.extend(LoginControllerMixin, {
  needs: ['application'],

  identification: null,
  password: null,
  errorMessage: null,

  authType: 'Basic',
  sessionAuthType: Ember.computed.alias("session.authType"),

  authenticator: function() {
    if (this.get('isOauth')) {
      return 'simple-auth-authenticator:oauth2-password-grant';
    } else {
      return 'authenticator:foreman';
    }
  }.property('isOauth'),

  isOauth: function() {
    return (this.get('authType') == 'oAuth') || (this.get('sessionAuthType') == 'oAuth')
  }.property('authType', 'sessionAuthType'),

  actions: {

    authenticate: function() {
      var self = this;
      if (this.get('authType') == 'Basic') {
          return this._super().then(function() {
              var adapter = self.store.adapterFor('ApplicationAdapter');
              adapter.set('headers', { Authorization: 'Basic ' + self.get('session.basicAuthToken') });
              return self.transitionTo('rhci');
          }, function () {
                return self.set('errorMessage', "Your username or password is incorrect. Please try again.");
          });

      } else {

          return this._super().then(function() {

              var adapter = self.store.adapterFor('ApplicationAdapter');
              // add token to adapter header
              adapter.set('headers', { Authorization: 'Bearer ' + self.get('session.access_token') });

              // add user to local storage session
              self.store.find('user', self.get('identification')).then(function(response) {
                self.get('session').set('authType', 'oAuth');
                self.get('session').set('currentUser', response);
                console.log('SESSION');
                console.log(self.get('session'));
                console.log(self.get('session.authType'));
                console.log(self.get('session.basicAuthToken'));
                return self.transitionTo('rhci');
              },
                function(response){
                  alert('error oAuth')
                }
              );

            }, function() {
                  return self.set('errorMessage', "Your username or password is incorrect. Please try again.");
          });
      }

    },

    // getCurrentUser: function
    // // authenticate called from LoginControllerMixin,
    authenticateOauth: function() {
      var pw = this.get('password')
      var self = this;
      return this._super().then(function() {

          var adapter = self.store.adapterFor('ApplicationAdapter');
          if (self.get('authType') == 'Basic') {
            self.get('session').set('basicAuthToken', btoa(self.get('identification') + ':' + pw));
            pw = null;
            adapter.set('headers', { Authorization: 'Basic ' + self.get('session.basicAuthToken') });
          } else {
            // add token to adapter header
            adapter.set('headers', { Authorization: 'Bearer ' + self.get('session.access_token') });
          }

          // add user to local storage session
          self.store.find('user', self.get('identification')).then(function(response) {
            self.get('session').set('currentUser', response);
            return self.transitionTo('rhci');
          },
            function(response){
              alert('error')
            }
          );


        }, function() {
              return self.set('errorMessage', "Your username or password is incorrect. Please try again.");
      });
    },

    authenticateSession: function(authType) {
      var self = this;
      return this.get('session').authenticate('simple-auth-authenticator:torii', authType+'-oauth2').then(function() {
        console.log(self.get('session.content'));
        var authCode = self.get('session.content.authorizationCode');
        //alert(authCode);
        Ember.$.ajax({
                type: "POST",
                url: "https://github.com/login/oauth/access_token",
                data: {
                        code: authCode,
                        client_id: '985e267c717e3f873120',
                        client_secret: '4855e5732487423f328f0c4ecfd57464aee2ee7b',
                        redirect_uri: 'http://development.fusor-ember-cli.divshot.io'
                },
                headers: {
                  "Access-Control-Allow-Origin": "*",
                  "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE",
                  "Access-Control-Allow-Credentials": true
                },
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function(data) {
                        // TODO : manage access_token and save it to the session
                        return alert(data);
                },
                failure: function(errMsg) {
                        // TODO : manage error
                       return alert('failure');
                       return alert(errMsg);
                }
        });

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
