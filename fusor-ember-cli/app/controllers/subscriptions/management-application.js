import Ember from 'ember';
import NeedsDeploymentMixin from "../../mixins/needs-deployment-mixin";
import request from 'ic-ajax';
import ValidationUtil from '../../utils/validation-util';

export default Ember.Controller.extend(NeedsDeploymentMixin, {
  subscriptionsController: Ember.inject.controller('subscriptions'),

  showManagementApplications: true,
  sessionPortal: Ember.computed.alias('subscriptionsController.model'),

  msgWaiting: Ember.computed('newSatelliteName', function() {
    return ('Adding ' + this.get('newSatelliteName') + ' ....');
  }),

  isValidMgmtAppName: Ember.computed('newSatelliteName', function(){
    return ValidationUtil.validateMgmtAppName(this.get('newSatelliteName'));
  }),
  isInvalidMgmtAppName: Ember.computed.not('isValidMgmtAppName'),

  disableNextOnManagementApp: Ember.computed('upstreamConsumerUuid', function() {
    return (Ember.isBlank(this.get('upstreamConsumerUuid')));
  }),

  actions: {
    registerNewSatellite() {
      this.set('showErrorMessage', false);
      this.set('openModal', true);
    },

    selectManagementApp(managementApp) {
      this.set('showAlertMessage', false);
      this.set('showWaitingMessage', false);
      this.set('showErrorMessage', false);
      this.get('sessionPortal').set('consumerUUID', managementApp.get('id'));
      this.get('sessionPortal').save();
      this.set('upstreamConsumerUuid', managementApp.get('id'));
      this.set('upstreamConsumerName', managementApp.get('name'));
      // show selected UUID in url
      return this.transitionTo('subscriptions.management-application.consumer', managementApp.get('id'));
    },

    createSatellite(newSatelliteName) {
      this.set('showAlertMessage', false);
      this.set('showErrorMessage', false);
      this.set('showWaitingMessage', true);
      this.set('newSatelliteName', newSatelliteName);

      var token = Ember.$('meta[name="csrf-token"]').attr('content');
      var errorMsg = this.get('errorMsg');
      var ownerKey = this.get('sessionPortal').get('ownerKey');

      //POST /customer_portal/consumers?owner=#{OWNER['key']}, {"name":"#{RHCI_DISTRIBUTOR_NAME}","type":"satellite","facts":{"distributor_version":"sat-6.0","system.certificate_version":"3.2"}}
      var url = ('/customer_portal/consumers?=' + ownerKey);

      if (this.get('isInvalidMgmtAppName')) {
        this.set('showWaitingMessage', false);
        this.set('showErrorMessage', true);
        this.set('errorMsg', 'Invalid application name, should contain alphanumeric characters with no whitespace.');
      } else {
        request({
          url: url,
          type: "POST",
          data: JSON.stringify({
            name: newSatelliteName,
            type: "satellite",
            facts: {
              "distributor_version": "sat-6.2",
              "system.certificate_version": "3.2"
            }
          }),
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "X-CSRF-Token": token
          }
        }).then(response => {
          var newMgmtApp = this.store.createRecord(
            'management-application',
            {
              name: response.name,
              entitlementCount: 0,
              id: response.uuid
            }
          );

          this.get('model').addObject(newMgmtApp._internalModel);
          this.get('sessionPortal').set('consumerUUID', response.uuid);
          this.get('sessionPortal').save();
          this.set('upstreamConsumerUuid', response.uuid);
          this.set('upstreamConsumerName', response.name);
          this.set('showAlertMessage', true);
          this.set('showWaitingMessage', false);
        }).catch(error => {
          let errorMsg = newSatelliteName + ' failed to be added. ';
          if (error && error.jqXHR && error.jqXHR.responseJSON && error.jqXHR.responseJSON.displayMessage) {
            errorMsg += error.jqXHR.responseJSON.displayMessage;
          }

          this.set('showErrorMessage', true);
          this.set('showWaitingMessage', false);
          this.set('errorMsg', errorMsg);
          this.send('error');
        });
      }
    }
  }
});
