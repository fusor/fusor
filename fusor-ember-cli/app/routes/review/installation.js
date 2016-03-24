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

    this.loadOpenStack(controller, model);

    if (!model.get('isStarted')) {
        var self = this;
        var deployment = self.modelFor('deployment');
        var token = Ember.$('meta[name="csrf-token"]').attr('content');

        var validationErrors = controller.get('validationErrors');

        controller.set('validationErrors', []);
        controller.set('validationWarnings', []);

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
        }).then(function (response) {
          controller.set('showSpinner', false);
          controller.set('validationErrors', response.validation.errors);
          controller.set('validationWarnings', response.validation.warnings);
        }, function(error){
          console.log('error', error);
          controller.set('showSpinner', false);
          controller.set('errorMsg', error.jqXHR.responseText);
          controller.set('showErrorMessage', true);
        });
    }
  },

  loadOpenStack(controller, model) {
    if (model.get('deploy_openstack') && !Ember.isBlank(model.get('openstack_undercloud_password'))) {
      controller.set('isOspLoading', true);
      Ember.RSVP.hash({
        plan: this.store.findRecord('deployment-plan', model.get('id')),
        nodes: this.store.query('node', {deployment_id: model.get('id')}),
        profiles: this.store.query('flavor', {deployment_id: model.get('id')})
      }).then(
        (hash) => {
          let openStack = Ember.Object.create(hash);
          controller.set('openStack', openStack);
          controller.set('isOspLoading', false);
        },
        (error) => {
          controller.set('isOspLoading', false);
          console.log('Error retrieving OpenStack data', error);
          return this.send('error', error);
        });
    }
  }

});
