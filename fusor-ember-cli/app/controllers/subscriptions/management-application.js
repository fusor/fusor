import Ember from 'ember';

export default Ember.Controller.extend({

  needs: ['subscriptions', 'deployment'],

  sessionPortal: Ember.computed.alias('controllers.subscriptions.model'),
  upstream_consumer_uuid: Ember.computed.alias("controllers.deployment.upstream_consumer_uuid"),
  upstream_consumer_name: Ember.computed.alias("controllers.deployment.upstream_consumer_name"),

  showAlertMessage: false,

  disableNextOnManagementApp: function() {
    return (Ember.isBlank(this.get('upstream_consumer_uuid')));
  }.property('upstream_consumer_uuid'),

  actions: {
    selectManagementApp: function(managementApp) {
      this.set('showAlertMessage', false);
      this.get('sessionPortal').set('consumerUUID', managementApp.uuid);
      this.get('sessionPortal').save();
      this.set('upstream_consumer_uuid', managementApp.uuid);
      this.set('upstream_consumer_name', managementApp.name);
    },

    createSatellite: function() {
      var token = $('meta[name="csrf-token"]').attr('content');
      var newSatelliteName = this.get('newSatelliteName');
      var ownerKey = this.get('sessionPortal').get('ownerKey');
      var self = this;

      //POST /customer_portal/consumers?owner=#{OWNER['key']}, {"name":"#{RHCI_DISTRIBUTOR_NAME}","type":"satellite","facts":{"distributor_version":"sat-6.0","system.certificate_version":"3.2"}}
      var url = ('/customer_portal/consumers?=' + ownerKey);

      return new Ember.RSVP.Promise(function (resolve, reject) {
        Ember.$.ajax({
            url: url,
            type: "POST",
            data: JSON.stringify({name: newSatelliteName,
                                  type: "satellite",
                                  facts: {"distributor_version": "sat-6.0", "system.certificate_version": "3.2"}} ),
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "X-CSRF-Token": token,
            },
            success: function(response) {
              self.get('model').pushObject(response);
              self.get('sessionPortal').set('consumerUUID', response.uuid);
              self.get('sessionPortal').save();
              self.set('showAlertMessage', true);
              console.log(response);
              resolve(response);
            },
            error: function(){
              console.log('error on createSatellite');
              return self.send('error');
            }
        });
      });
    }

  },

});
