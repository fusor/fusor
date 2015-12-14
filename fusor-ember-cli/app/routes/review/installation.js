import Ember from 'ember';
import request from 'ic-ajax';

export default Ember.Route.extend({
  model() {
    return this.modelFor('deployment');
  },

  setupController(controller, model) {
    controller.set('model', model);
    controller.set('showErrorMessage', false);
    if (model.get('deploy_rhev')) {
        this.store.findAll('hostgroup').then(function(results) {
            console.log(results);
            var fusorBaseHostgroup = results.filterBy('name', 'Fusor Base').get('firstObject');
            var fusorBaseDomain = fusorBaseHostgroup.get('domain.name');
            controller.set('engineDomain', fusorBaseDomain);
            controller.set('hypervisorDomain', fusorBaseDomain);
        });
    }
    if (model.get('deploy_openstack')) {
        this.store.findRecord('deployment-plan', model.get('id')).then(function (plan) {
            controller.set('openstackPlan', plan);
        });
        this.store.query('node', {deployment_id: model.get('id')}).then(function (nodes) {
            controller.set('openstackNodes', nodes);
        });
        this.store.query('flavor', {deployment_id: model.get('id')}).then(function (flavors) {
            controller.set('openstackProfiles', flavors);
        });
    }

    if (model.get('is_disconnected')) {
        controller.set('reviewSubscriptions', this.modelFor('subscriptions/review-subscriptions'));
    }

    if (!model.get('isStarted')) {
        var self = this;
        var deployment = self.modelFor('deployment');
        var token = Ember.$('meta[name="csrf-token"]').attr('content');

        controller.set('showSpinner', true);
        controller.set('spinnerTextMessage', "Validating deployment...");

        request({
            url: `/fusor/api/v21/deployments/${model.get('id')}/validate`,
            type: "GET",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "X-CSRF-Token": token
            }
        }).then(function(response) {
            controller.set('showSpinner', false);

            controller.set('showErrorMessage', response.errors.length > 0);
            controller.set('errorMsg', response.errors.join("\n"));

            controller.set('showWarningMessage', response.warnings.length > 0);
            controller.set('warningMsg', response.warnings.join("\n"));
        }, function(response){
            controller.set('showSpinner', false);
            console.log(response);
            var errorMsg = response.responseText;
            controller.set('errorMsg', errorMsg);
        });
    }
  }

});
