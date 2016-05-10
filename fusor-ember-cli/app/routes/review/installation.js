import Ember from 'ember';
import request from 'ic-ajax';

export default Ember.Route.extend({

  beforeModel() {
    // Ensure the models have been persisted so that we're validating/syncing up to date data.
    return this.modelFor('deployment').save();
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

    if (model.get('is_disconnected')) {
        controller.set('reviewSubscriptions', this.modelFor('subscriptions/review-subscriptions'));
    } else {
        var reviewSubscriptions = model.get('subscriptions').filter(function(sub) {
            return ((sub.get('quantity_to_add') > 0) && sub.get('source') == 'added');
        });
        controller.set('reviewSubscriptions', reviewSubscriptions);
        controller.set('hasSubscriptionsToAttach', reviewSubscriptions.get('length') > 0);
        controller.set('hasSessionPortal', Ember.isPresent(this.modelFor('subscriptions')));
        controller.set('hasSubscriptionPools', Ember.isPresent(this.controllerFor('subscriptions/select-subscriptions').get('subscriptionPools')));
    }

    controller.set('validationErrors', []);
    controller.set('validationWarnings', []);
    controller.set('showSpinner', true);

    if (!model.get('isStarted')) {
      // the PUT request from saveDeployment was firing too late and the server was syncing/validating stale data.
      // the model.save ensures the server has the most recent version of deployment before proceeding.
      this.validate()
        .then(() => this.syncOpenStack())
        .catch(error => {
          console.log('error', error);
          controller.set('errorMsg', error.jqXHR.responseText);
          controller.set('showErrorMessage', true);
        })
        .finally(() => {
          controller.set('showSpinner', false);
        });
    }
  },

  validate() {
    let controller = this.get('controller');
    let deploymentId = this.get('controller.model.id');
    let token = Ember.$('meta[name="csrf-token"]').attr('content');
    let validationErrors = controller.get('validationErrors');

    controller.set('spinnerTextMessage', "Validating deployment...");

    return request({
      url: `/fusor/api/v21/deployments/${deploymentId}/validate`,
      type: "GET",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "X-CSRF-Token": token
      },
      data: {}
    }).then(response => {
      controller.set('validationErrors', response.validation.errors);
      controller.set('validationWarnings', response.validation.warnings);
    });
  },

  syncOpenStack() {
    let controller = this.get('controller');
    let deployment = this.get('controller.model');
    let token = Ember.$('meta[name="csrf-token"]').attr('content');

    if (!deployment.get('deploy_openstack')) {
      return Ember.RSVP.Promise.resolve('no sync needed');
    }

    controller.set('spinnerTextMessage', "Syncing OpenStack...");

    return request({
      url: `/fusor/api/v21/deployments/${deployment.get('id')}/sync_openstack`,
      type: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "X-CSRF-Token": token
      }
    });
  }
});
