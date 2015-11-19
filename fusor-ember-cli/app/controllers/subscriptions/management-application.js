import Ember from 'ember';
import NeedsDeploymentMixin from "../../mixins/needs-deployment-mixin";
import request from 'ic-ajax';

export default Ember.Controller.extend(NeedsDeploymentMixin, {

  subscriptionsController: Ember.inject.controller('subscriptions'),

  showManagementApplications: true,

  sessionPortal: Ember.computed.alias('subscriptionsController.model'),
  upstreamConsumerUuid: Ember.computed.alias("deploymentController.model.upstream_consumer_uuid"),
  upstreamConsumerName: Ember.computed.alias("deploymentController.model.upstream_consumer_name"),

  showAlertMessage: false,
  showWaitingMessage: false,

  msgWaiting: Ember.computed('newSatelliteName', function() {
    return ('Adding ' + this.get('newSatelliteName') + ' ....');
  }),

  disableNextOnManagementApp: Ember.computed('upstreamConsumerUuid', function() {
    return (Ember.isBlank(this.get('upstreamConsumerUuid')));
  }),

  actions: {
    registerNewSatellite() {
      this.set('openRegisterNewSatelliteModal', true);
    },

    selectManagementApp(managementApp) {
      this.set('showAlertMessage', false);
      this.set('showWaitingMessage', false);
      this.get('sessionPortal').set('consumerUUID', managementApp.get('id'));
      this.get('sessionPortal').save();
      this.set('upstreamConsumerUuid', managementApp.get('id'));
      this.set('upstreamConsumerName', managementApp.get('name'));
      // show selected UUID in url
      return this.transitionTo('subscriptions.management-application.consumer', managementApp.get('id'));
    },

    createSatellite() {
      this.set('showWaitingMessage', true);
      var token = Ember.$('meta[name="csrf-token"]').attr('content');
      var newSatelliteName = this.get('newSatelliteName');
      var ownerKey = this.get('sessionPortal').get('ownerKey');
      var self = this;

      //POST /customer_portal/consumers?owner=#{OWNER['key']}, {"name":"#{RHCI_DISTRIBUTOR_NAME}","type":"satellite","facts":{"distributor_version":"sat-6.0","system.certificate_version":"3.2"}}
      var url = ('/customer_portal/consumers?=' + ownerKey);

      return new Ember.RSVP.Promise(function (resolve, reject) {
        request({
            url: url,
            type: "POST",
            data: JSON.stringify({name: newSatelliteName,
                                  type: "satellite",
                                  facts: {"distributor_version": "sat-6.0", "system.certificate_version": "3.2"}} ),
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "X-CSRF-Token": token
            }
          }).then(function(response) {
                var newMgmtApp = self.store.createRecord('management-application', {name: response.name, entitlementCount: 0, id: response.uuid});
                self.get('model').addObject(newMgmtApp._internalModel);
                self.get('sessionPortal').set('consumerUUID', response.uuid);
                self.get('sessionPortal').save();
                self.set('showAlertMessage', true);
                self.set('showWaitingMessage', false);
                console.log(response);
                resolve(response);
          }, function(error) {
                console.log('error on createSatellite');
                return self.send('error');
          }
        );
      });
    }

  }

});
