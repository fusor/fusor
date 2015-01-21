// app/authenticators/custom.js
import Base from 'simple-auth/authenticators/base';
import ApplicationAdapter from 'fusor-ember-cli/adapters/application';

export default Base.extend({

  // Check session if you refresh browser (F5)
  restore: function(options) {
    console.log('OPTIONS');
    console.log(options);

    var self = this;
    return new Ember.RSVP.Promise(function (resolve, reject) {
      Ember.$.ajax({
          url: '/api/v2/users/' + options.loginUsername,
          headers: {
              "Authorization": "Basic " + options.basicAuthToken
          },
          success: function(response) {
            resolve({currentUser: response,
                     loginUsername: response.login,
                     basicAuthToken: options.basicAuthToken,
                     authType: 'Basic'});
          },

          error: function(response){
            reject(response);
          }
      });
    });
  },

  authenticate: function(credentials) {
        var self = this;
        return new Ember.RSVP.Promise(function (resolve, reject) {
          Ember.$.ajax({
              url: '/api/v2/users/' + credentials.identification,
              headers: {
                  "Authorization": "Basic " + btoa(credentials.identification + ':' + credentials.password)
              },
              success: function(response) {
                resolve({currentUser: response,
                         loginUsername: response.login,
                         basicAuthToken: btoa(credentials.identification + ':' + credentials.password),
                         authType: 'Basic'});
              },
              error: function(response){
                reject(response);
              }
          });
        });
  },

  invalidate: function(options) {
    return this._super(options);
  }
});
