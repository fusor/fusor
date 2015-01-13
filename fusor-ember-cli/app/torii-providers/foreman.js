export default Ember.Object.extend({

  // credentials as passed from torii.open
  open: function(credentials){
    return new Ember.RSVP.Promise(function(resolve, reject){
      alert(credentials.username);
      exampleAsyncLogin(
        credentials.username,
        credentials.password,

        // callback function:
        function(error, response) {
          // the promise is resolved with the authorization
          Ember.run.bind(null, resolve, {sessionToken: response.token});
        }
      );
    });
  }

});
