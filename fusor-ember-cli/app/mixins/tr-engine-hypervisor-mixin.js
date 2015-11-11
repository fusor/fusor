import Ember from 'ember';

export default Ember.Mixin.create({

  tagName: 'tr',

  classNameBindings: ['bgColor'],

  bgColor: Ember.computed('isChecked', function () {
    if (this.get('isChecked')) {
      return 'white-on-blue';
    }
  }),

  cssHostHostId: Ember.computed('host.id', function () {
    return ('host_' + this.get('host.id'));
  }),

  cssIdHostId: Ember.computed('host.id', function () {
    return ('id_' + this.get('host.id'));
  }),

  selectedIds: Ember.computed('model.[]', function () {
    if (this.get('model')) {
      return this.get('model').getEach("id");
    }
  }),

  actions: {
    saveHostname() {
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
            success(response) {
              resolve(response);
            },

            error(response) {
              reject(response);
            }
        });
      });
    }
  }

});
