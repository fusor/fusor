import Ember from 'ember';
import NeedsDeploymentMixin from "../../mixins/needs-deployment-mixin";

export default Ember.Controller.extend(NeedsDeploymentMixin, {

  needs: ['subscriptions'],

  showManagementApplications: true,

  sessionPortal: Ember.computed.alias('controllers.subscriptions.model'),
  upstreamConsumerUuid: Ember.computed.alias("controllers.deployment.model.upstream_consumer_uuid"),
  upstreamConsumerName: Ember.computed.alias("controllers.deployment.model.upstream_consumer_name"),

  showAlertMessage: false,

  disableNextOnManagementApp: function() {
    return (Ember.isBlank(this.get('upstreamConsumerUuid')));
  }.property('upstreamConsumerUuid'),

  actions: {
    registerNewSatellite: function() {
      this.set('openRegisterNewSatelliteModal', true);
    },

    selectManagementApp: function(managementApp) {
      this.set('showAlertMessage', false);
      this.get('sessionPortal').set('consumerUUID', managementApp.get('id'));
      this.get('sessionPortal').save();
      this.set('upstreamConsumerUuid', managementApp.get('id'));
      this.set('upstreamConsumerName', managementApp.get('name'));
      // show selected UUID in url
      return this.transitionTo('subscriptions.management-application.consumer', managementApp.get('id'));
    },

    createSatellite: function() {
      var token = Ember.$('meta[name="csrf-token"]').attr('content');
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

  }

});
