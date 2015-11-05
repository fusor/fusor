import Ember from 'ember';

export default Ember.Mixin.create({

  tagName: 'tr',

  classNameBindings: ['bgColor'],

  bgColor: function () {
    if (this.get('isChecked')) {
      return 'white-on-blue';
    }
  }.property('isChecked'),

  cssHostHostId: function () {
    return ('host_' + this.get('host.id'));
  }.property('host.id'),

  cssIdHostId: function () {
    return ('id_' + this.get('host.id'));
  }.property('host.id'),

  selectedIds: function () {
    if (this.get('model')) {
      return this.get('model').getEach("id");
    }
  }.property('model.[]'),

  actions: {
    saveHostname: function() {
      var host = this.get('host');
      var self = this;
      var token = Ember.$('meta[name="csrf-token"]').attr('content');

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
