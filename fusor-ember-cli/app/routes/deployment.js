import Ember from 'ember';
import DeploymentRouteMixin from "../mixins/deployment-route-mixin";
import request from 'ic-ajax';

export default Ember.Route.extend(DeploymentRouteMixin, {

  model(params) {
    return this.store.findRecord('deployment', params.deployment_id);
  },

  setupController(controller, model) {
    controller.set('model', model);
    controller.set('satelliteTabRouteName', 'satellite.index');
    controller.set('organizationTabRouteName', 'configure-organization');
    controller.set('lifecycleEnvironmentTabRouteName', 'configure-environment');
    controller.set('model.host_naming_scheme', 'Freeform');
    controller.set('confirmRhevRootPassword', model.get('rhev_root_password'));
    controller.set('confirmRhevEngineAdminPassword', model.get('rhev_engine_admin_password'));
    controller.set('confirmCfmeRootPassword', model.get('cfme_root_password'));
    controller.set('confirmCfmeAdminPassword', model.get('cfme_admin_password'));
    controller.set('confirmOvercloudPassword', model.get('openstack_overcloud_password'));

    this.loadOpenStack(controller, model);
    this.loadOpenshiftDefaults(controller, model);
    this.loadCloudFormsDefaults(controller, model);
    // copied from setupController in app/routes/subscriptions/credentials.js
    // to fix bug of Review Tab being disabled on refresh and needing to click
    // on subscriptions to enable it
    // check if org has upstream UUID using Katello V2 API
    var orgID = model.get('organization.id');
    var url = '/katello/api/v2/organizations/' + orgID;
    Ember.$.getJSON(url).then(function(results) {
      if (Ember.isPresent(results.owner_details.upstreamConsumer)) {
        controller.set('organizationUpstreamConsumerUUID', results.owner_details.upstreamConsumer.uuid);
        controller.set('organizationUpstreamConsumerName', results.owner_details.upstreamConsumer.name);
        // if no UUID for deployment, assign it from org UUID
        if (Ember.isBlank(controller.get('model.upstream_consumer_uuid'))) {
          controller.set('model.upstream_consumer_uuid', results.owner_details.upstreamConsumer.uuid);
          controller.set('model.upstream_consumer_name', results.owner_details.upstreamConsumer.name);
        }
      } else {
        controller.set('organizationUpstreamConsumerUUID', null);
        controller.set('organizationUpstreamConsumerName', null);
      }
    });

  },

  loadCloudFormsDefaults(controller, model) {
    // GET from API v2 CFME settings for Foreman/Sat6 - if CFME is selected
    if (model.get('deploy_cfme')) {
      request('api/v2/settings?search=cloudforms').then(function(settings) {
        var results = settings['results'];
        if (!(model.get('cloudforms_vcpu') > 0)) {
          model.set('cloudforms_vcpu', results.findBy('name', 'cloudforms_vcpu').value);
        }
        if (!(model.get('cloudforms_ram') > 0)) {
          model.set('cloudforms_ram', results.findBy('name', 'cloudforms_ram').value);
        }
        if (!(model.get('cloudforms_vm_disk_size') > 0)) {
          model.set('cloudforms_vm_disk_size', results.findBy('name', 'cloudforms_vm_disk_size').value);
        }
        if (!(model.get('cloudforms_db_disk_size') > 0)) {
          model.set('cloudforms_db_disk_size', results.findBy('name', 'cloudforms_db_disk_size').value);
        }
      });
    }
  },

  loadOpenshiftDefaults(controller, model) {
    // GET from API v2 OSE settings for Foreman/Sat6
    if (model.get('deploy_openshift')) {
      request('api/v2/settings?search=openshift').then(function(settings) {
        var results = settings['results'];
        if (!(model.get('openshift_master_vcpu') > 0)) {
          model.set('openshift_master_vcpu', results.findBy('name', 'openshift_master_vcpu').value);
        }
        if (!(model.get('openshift_master_ram') > 0)) {
          model.set('openshift_master_ram', results.findBy('name', 'openshift_master_ram').value);
        }
        if (!(model.get('openshift_master_disk') > 0)) {
          model.set('openshift_master_disk', results.findBy('name', 'openshift_master_disk').value);
        }
        if (!(model.get('openshift_node_vcpu') > 0)) {
          model.set('openshift_node_vcpu', results.findBy('name', 'openshift_node_vcpu').value);
        }
        if (!(model.get('openshift_node_ram') > 0)) {
          model.set('openshift_node_ram', results.findBy('name', 'openshift_node_ram').value);
        }
        if (!(model.get('openshift_node_disk') > 0)) {
          model.set('openshift_node_disk', results.findBy('name', 'openshift_node_disk').value);
        }
      });

      // set default values 1 Master, 1 Worker, 20GB storage for OSE
      if (!(model.get('openshift_number_master_nodes') > 0)) {
        model.set('openshift_number_master_nodes', 1);
      }
      if (!(model.get('openshift_number_worker_nodes') > 0)) {
        model.set('openshift_number_worker_nodes', 1);
      }
      if (!(model.get('openshift_storage_size') > 0)) {
        model.set('openshift_storage_size', 20);
      }

    }
  },

  loadOpenStack(controller, model) {
    var self = this;
    if (model.get('deploy_openstack') && !Ember.isBlank(model.get('openstack_undercloud_password'))) {
      controller.set('isOspLoading', true);
      Ember.RSVP.hash({
        plan: this.store.findRecord('deployment-plan', model.get('id')),
        images: this.store.query('image', {deployment_id: model.get('id')}),
        nodes: this.store.query('node', {deployment_id: model.get('id')}),
        profiles: this.store.query('flavor', {deployment_id: model.get('id')})
      }).then(function (hash) {
          var openStack = Ember.Object.create(hash);
          controller.set('openStack', openStack);
          self.fixBadOpenStackDefaults();

        // for some reason using the binding the computed property blanks it out on the first edit,
        // so we're using an alias which updates the plan on route deactivate on the corresponding page anyway
          controller.set('openStack.externalNetworkInterface', openStack.get('plan.externalNetworkInterface'));
          controller.set('openStack.overcloudPassword', openStack.get('plan.overcloudPassword'));
          controller.set('isOspLoading', false);
        },
        function (error) {
          controller.set('isOspLoading', false);
          console.log('Error retrieving OpenStack data', error);
          return self.send('error', error);
        });
    }
  },

  fixBadOpenStackDefaults() {
    var newParams = [], existingParams = this.get('controller.openStack.plan.parameters');

    if (!existingParams) {
      return;
    }

    existingParams.forEach(function (param) {
      var id = param.get('id'), value = param.get('value');

      if (id === 'Controller-1::NeutronPublicInterface' &&
        (!value || value === 'nic1')) {
        param.set('value', 'nic2');
        newParams.push({name: id, value: 'nic2'});
      }

      if (id === 'Compute-1::NovaComputeLibvirtType' &&
        (!value || value === 'qemu')) {
        param.set('value', 'kvm');
        newParams.push({name: id, value: 'kvm'});
      }
    });

    if (newParams.length > 0) {
      this.send('updateOpenStackPlan', newParams);
    }
  },

  actions: {
    installDeployment() {
      var self = this;
      var deployment = self.modelFor('deployment');
      var token = Ember.$('meta[name="csrf-token"]').attr('content');

      var controller = this.controllerFor('review/installation');

      if(controller.get('modalOpen')) {
          controller.closeContinueDeployModal();
      }

      controller.set('spinnerTextMessage', 'Building task list');
      controller.set('showSpinner', true);

      request({
        url: '/fusor/api/v21/deployments/' + deployment.get('id') + '/deploy',
        type: "PUT",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "X-CSRF-Token": token,
          "Authorization": "Basic " + self.get('session.basicAuthToken')
        }
      }).then(
        function (response) {
          var uuid = response.id;
          console.log('task uuid is ' + uuid);
          deployment.set('foreman_task_uuid', uuid);
          deployment.save().then(
            function () {
              controller.set('showSpinner', false);
              return self.transitionTo('review.progress.overview');
            },
            function () {
              controller.set('showSpinner', false);
              controller.set('errorMsg', 'Error in saving UUID of deployment task.');
              controller.set('showErrorMessage', true);
            });
        },
        function (response) {
          controller.set('showSpinner', false);

          if (response.jqXHR.status === 422 && response.jqXHR.responseJSON && response.jqXHR.responseJSON.errors) {
            // rails is sending back validation errors as a 422 with an errors hash that looks like
            // errors: {field => [error_messages]}
            let validationErrors = [];
            let errors = response.jqXHR.responseJSON.errors;
            let addValidationError = (error) => validationErrors.push(error);

            for (var prop in errors) {
              if (errors.hasOwnProperty(prop)) {
                errors[prop].forEach(addValidationError);
              }
            }
            controller.set('validationErrors', validationErrors);
          } else {
            controller.set('errorMsg', response.jqXHR.responseText);
            controller.set('showErrorMessage', true);
          }
        });
    },

    attachSubscriptions() {
      var self = this;
      var token = Ember.$('meta[name="csrf-token"]').attr('content');
      var sessionPortal = this.modelFor('subscriptions');
      var consumerUUID = sessionPortal.get('consumerUUID');
      var subscriptionPools = this.controllerFor('subscriptions/select-subscriptions').get('subscriptionPools');

      var controller = this.controllerFor('review/installation');

      controller.set('buttonDeployDisabled', true);
      controller.set('spinnerTextMessage', 'Attaching Subscriptions in Red Hat Customer Portal');
      controller.set('showSpinner', true);

      subscriptionPools.forEach(function(item){
        console.log(item);
        console.log('qtyToAttach is');
        console.log(item.get('qtyToAttach'));
        console.log('pool ID is');
        console.log(item.get('id'));
        console.log('isSelectedSubscription is');
        console.log(item.get('isSelectedSubscription'));

        if (item.get('qtyToAttach') > 0) {

          // POST /customer_portal/consumers/#{CONSUMER['uuid']}/entitlements?pool=#{POOL['id']}&quantity=#{QUANTITY}
          var url = '/customer_portal/consumers/' + consumerUUID + "/entitlements?pool=" + item.get('id') + "&quantity=" + item.get('qtyToAttach');
          console.log('POST attach subscriptions using following URL');
          console.log(url);

          request({
              url: url,
              type: "POST",
              headers: {
                  "Accept": "application/json",
                  "Content-Type": "application/json",
                  "X-CSRF-Token": token
              }
              }).then(function(response) {
                  console.log('successfully attached ' + item.qtyToAttach + ' subscription for pool ' + item.id);
                  self.send('installDeployment');
              }, function(error) {
                  console.log('error on attachSubscriptions');
                  return self.send('error');
              }
          );

        }
      });
    },

    saveAndCancelDeployment() {
      return this.send('saveDeployment', 'deployments');
    },

    cancelAndDeleteDeployment() {
      var deployment = this.get('controller.model');
      var self = this;
      deployment.destroyRecord().then(function() {
        return self.transitionTo('deployments');
      });
    },

    error(reason) {
      console.log(reason);
      var controller = this.controllerFor('deployment');

      if (typeof reason === 'string') {
        controller.set('errorMsg', reason);
      } else if (reason && typeof reason === 'object') {
        if (reason.responseJSON && reason.responseJSON.error && reason.responseJSON.error.message) {
          controller.set('errorMsg', reason.responseJSON.error.message);
        } else if (reason.responseText) {
          controller.set('errorMsg', reason.responseText);
        }
      }
    },

    refreshModel() {
      console.log('refreshModelOnDeploymentRoute');
      return this.refresh();
    },

    refreshOpenStack() {
      console.log('refreshOpenStack');
      this.loadOpenStack(this.get('controller'), this.get('controller.model'));
    },

    updateOpenStackPlan(params) {
      console.log('updateOpenStackPlan');
      var deploymentId = this.modelFor('deployment').get('id'),
        token = Ember.$('meta[name="csrf-token"]').attr('content');

      return request({
        url: `/fusor/api/openstack/deployments/${deploymentId}/deployment_plans/overcloud/update_parameters`,
        type: 'PUT',
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "X-CSRF-Token": token
        },
        data: JSON.stringify({ 'parameters': params })
      }).catch(
        function(error) {
          error = error.jqXHR;
          console.log('ERROR updating parameters');
          console.log(error);
        }
      );
    }
  }

});
