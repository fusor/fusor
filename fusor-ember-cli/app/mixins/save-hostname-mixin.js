import Ember from 'ember';

export default Ember.Mixin.create({

  actions: {
    saveHostname: function() {
      var host = this.get('host');
      console.log(host);
      var self = this;
      var token = $('meta[name="csrf-token"]').attr('content');

      return new Ember.RSVP.Promise(function (resolve, reject) {
        Ember.$.ajax({
            url: '/api/v21/discovered_hosts/' + host.get('id') + '/rename',
            type: "PUT",
            data: JSON.stringify({'discovered_host': { 'name': host.get('name') } }),
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "X-CSRF-Token": token,
                "Authorization": "Basic " + self.get('session.basicAuthToken')
            },
            success: function(response) {
              resolve(response);
            },

            error: function(response){
              reject(response);
            }
        });
      });
    }
  }

});
