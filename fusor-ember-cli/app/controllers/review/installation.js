import Ember from 'ember';
import NeedsDeploymentMixin from "../../mixins/needs-deployment-mixin";

export default Ember.Controller.extend(NeedsDeploymentMixin, {

  rhevController: Ember.inject.controller('rhev'),
  rhevSetupController: Ember.inject.controller('rhev-setup'),
  rhevOptionsController: Ember.inject.controller('rhev-options'),
  selectSubscriptionsController: Ember.inject.controller('subscriptions/select-subscriptions'),

  isSelfHost: Ember.computed.alias("rhevController.isSelfHost"),

  rhevValidated: Ember.computed(
    'model.rhev_engine_admin_password',
    'model.rhev_storage_type',
    'selectedRhevEngine',
    'selectedHypervisorHosts',
    'isSelfHost',
    function() {
      if (this.get('isRhev')) {
        return Ember.isPresent(this.get('model.rhev_engine_admin_password')) &&
               Ember.isPresent(this.get('selectedRhevEngine')) &&
               (this.get('isSelfHost') || Ember.isPresent(this.get('selectedHypervisorHosts'))) &&
               Ember.isPresent(this.get('model.rhev_storage_type'));
      } else {
        return true;
      }
    }
  ),

  cfmeValidated: Ember.computed('model.cfme_install_loc', function() {
    if (this.get('isCloudForms')) {
      return Ember.isPresent(this.get('model.cfme_install_loc'));
    } else {
      return true;
    }
  }),

  buttonDeployTitle: Ember.computed('isStarted', function() {
    if (this.get('isStarted')) {
      return 'Next';
    } else {
      return 'Deploy';
    }
  }),

  buttonDeployDisabled: Ember.computed('rhevValidated', 'cfmeValidated', function() {
    return (!(this.get('rhevValidated')) || !(this.get('cfmeValidated')));
  }),

  showErrorMessage: false,
  errorMsg: null,
  foremanTasksURL: null,
  skipContent: Ember.computed.alias("deploymentController.skipContent"),

  showSpinner: false,
  spinnerTextMessage: null,
  hasSubscriptionsToAttach: Ember.computed.alias("selectSubscriptionsController.hasSubscriptionsToAttach"),

  isRhevOpen: true,
  isOpenStackOpen: true,
  isCloudFormsOpen: true,
  isSubscriptionsOpen: true,

  engineHostAddressDefault: 'ovirt-hypervisor.rhci.redhat.com',
  hostAddress: Ember.computed.alias("rhevOptionsController.hostAddress"),
  engineHostName: Ember.computed.alias("rhevOptionsController.engineHostName"),

  nameDeployment: Ember.computed.alias("model.name"),
  selectedOrganization: Ember.computed.alias("deploymentController.selectedOrganzation"),
  selectedEnvironment: Ember.computed.alias("deploymentController.selectedEnvironment"),
  rhevSetup: Ember.computed.alias("deploymentController.rhevSetup"),

  isRhev: Ember.computed.alias("deploymentController.isRhev"),
  isOpenStack: Ember.computed.alias("deploymentController.isOpenStack"),
  isCloudForms: Ember.computed.alias("deploymentController.isCloudForms"),
  isSubscriptions: Ember.computed.alias("deploymentController.isSubscriptions"),

  isSelfHosted: Ember.computed.alias("model.rhev_is_self_hosted"),
  selectedHypervisorHosts: Ember.computed.alias("model.discovered_hosts"),

  rhev_engine_host: Ember.computed.alias("model.discovered_host"),
  selectedRhevEngine: Ember.computed.alias("model.discovered_host"),
  isStarted: Ember.computed.alias("model.isStarted"),
  subscriptions: Ember.computed.alias("model.subscriptions"),
  undercloudUsername: 'admin',
  undercloudPassword: Ember.computed.alias("model.openstack_undercloud_password"),

  undercloudUrl: Ember.computed('model.openstack_undercloud_ip_addr', function() {
    return ('http://' + this.get('model.openstack_undercloud_ip_addr'));
  }),

  engineNamePlusDomain: Ember.computed(
    'selectedRhevEngine.is_discovered',
    'selectedRhevEngine.name',
    'engineDomain',
    function() {
      if (this.get("selectedRhevEngine.is_discovered")) {
        return (this.get("selectedRhevEngine.name") + '.' + this.get('engineDomain'));
      } else {
        // name is fqdn for managed host
        return (this.get("selectedRhevEngine.name"));
      }
    }
  ),

  nameRHCI: Ember.computed.alias("deploymentController.nameRHCI"),
  nameRhev: Ember.computed.alias("deploymentController.nameRhev"),
  nameOpenStack: Ember.computed.alias("deploymentController.nameOpenStack"),
  nameCloudForms: Ember.computed.alias("deploymentController.nameCloudForms"),
  nameSatellite: Ember.computed.alias("deploymentController.nameSatellite"),

  backRouteNameonReviewInstallation: Ember.computed(
    'isSubscriptions',
    'isRhev',
    'isOpenStack',
    'isCloudForms',
    'model.upstream_consumer_uuid',
    function() {
      if (this.get('isSubscriptions')) {
        if (this.get('model.is_disconnected')) {
          return 'subscriptions.review-subscriptions';
        } else if (Ember.isPresent(this.get('model.upstream_consumer_uuid'))) {
          return 'subscriptions.select-subscriptions';
        } else {
          return 'subscriptions.credentials';
        }
      } else {
        if (this.get('isCloudForms')) {
          return 'cloudforms/cfme-configuration';
        } else if (this.get('isOpenStack')) {
          // TODO
        } else if (this.get('isRhev')) {
          return 'storage';
        }
      }
    }
  ),

  lifecycleEnvironmentName: Ember.computed('model.lifecycle_environment.name', function() {
    var name = this.get('model.lifecycle_environment.name');
    if (name) {
      return name;
    } else {
      return "Default Organization View";
    }
  }),

  deploymentButtonAction: Ember.computed('hasSubscriptionsToAttach', function() {
    if (this.get('hasSubscriptionsToAttach')) {
      return "attachSubscriptions";
    } else {
      return "installDeployment";
    }
  })

});
