import Ember from 'ember';
import NeedsDeploymentMixin from "../../mixins/needs-deployment-mixin";

export default Ember.Controller.extend(NeedsDeploymentMixin, {

  needs: ['application', 'satellite', 'configure-organization',
          'configure-environment', 'rhev-setup', 'rhev', 'hypervisor', 'hypervisor/discovered-host',
          'engine/discovered-host', 'storage',
          'rhev-options', 'where-install',
          'review', 'subscriptions/select-subscriptions'],

  isSelfHost: Ember.computed.alias("controllers.rhev.isSelfHost"),

  rhevValidated: function() {
    if (this.get('isRhev')) {
      return Ember.isPresent(this.get('model.rhev_engine_admin_password')) &&
             Ember.isPresent(this.get('selectedRhevEngine')) &&
             (this.get('isSelfHost') || Ember.isPresent(this.get('selectedHypervisorHosts'))) &&
             Ember.isPresent(this.get('model.rhev_storage_type'));
    } else {
      return true;
    }
  }.property('model.rhev_engine_admin_password', 'model.rhev_storage_type',
             'selectedRhevEngine', 'selectedHypervisorHosts', 'isSelfHost'),

  cfmeValidated: function() {
    if (this.get('isCloudForms')) {
      return Ember.isPresent(this.get('model.cfme_install_loc'));
    } else {
      return true;
    }
  }.property('model.cfme_install_loc'),

  buttonDeployTitle: function() {
    if (this.get('isStarted')) {
      return 'Next';
    } else {
      return 'Deploy';
    }
  }.property('isStarted'),

  buttonDeployDisabled: function() {
    return (!(this.get('rhevValidated')) || !(this.get('cfmeValidated')));
  }.property('rhevValidated', 'cfmeValidated'),

  showErrorMessage: false,
  errorMsg: null,
  foremanTasksURL: null,
  skipContent: Ember.computed.alias("controllers.deployment.skipContent"),

  showSpinner: false,
  spinnerTextMessage: null,
  hasSubscriptionsToAttach: Ember.computed.alias("controllers.subscriptions/select-subscriptions.hasSubscriptionsToAttach"),

  isRhevOpen: true,
  isOpenStackOpen: true,
  isCloudFormsOpen: true,
  isSubscriptionsOpen: true,

  engineHostAddressDefault: 'ovirt-hypervisor.rhci.redhat.com',
  hostAddress: Ember.computed.alias("controllers.rhev-options.hostAddress"),
  engineHostName: Ember.computed.alias("controllers.rhev-options.engineHostName"),

  nameDeployment: Ember.computed.alias("model.name"),
  selectedOrganization: Ember.computed.alias("controllers.deployment.selectedOrganzation"),
  selectedEnvironment: Ember.computed.alias("controllers.deployment.selectedEnvironment"),
  rhevSetup: Ember.computed.alias("controllers.deployment.rhevSetup"),

  isRhev: Ember.computed.alias("controllers.deployment.isRhev"),
  isOpenStack: Ember.computed.alias("controllers.deployment.isOpenStack"),
  isCloudForms: Ember.computed.alias("controllers.deployment.isCloudForms"),
  isSubscriptions: Ember.computed.alias("controllers.deployment.isSubscriptions"),

  isSelfHosted: Ember.computed.alias("model.rhev_is_self_hosted"),
  selectedHypervisorHosts: Ember.computed.alias("model.discovered_hosts"),

  rhev_engine_host: Ember.computed.alias("model.discovered_host"),
  selectedRhevEngine: Ember.computed.alias("model.discovered_host"),
  isStarted: Ember.computed.alias("model.isStarted"),
  subscriptions: Ember.computed.alias("model.subscriptions"),
  undercloudUsername: 'admin',
  undercloudPassword: Ember.computed.alias("model.openstack_undercloud_password"),

  undercloudUrl: function() {
    return ('http://' + this.get('model.openstack_undercloud_ip_addr'));
  }.property('model.openstack_undercloud_ip_addr'),

  engineNamePlusDomain: function() {
    if (this.get("selectedRhevEngine.is_discovered")) {
      return (this.get("selectedRhevEngine.name") + '.' + this.get('engineDomain'));
    } else {
      // name is fqdn for managed host
      return (this.get("selectedRhevEngine.name"));
    }
  }.property('selectedRhevEngine.is_discovered', 'selectedRhevEngine.name', 'engineDomain'),

  nameRHCI: Ember.computed.alias("controllers.deployment.nameRHCI"),
  nameRhev: Ember.computed.alias("controllers.deployment.nameRhev"),
  nameOpenStack: Ember.computed.alias("controllers.deployment.nameOpenStack"),
  nameCloudForms: Ember.computed.alias("controllers.deployment.nameCloudForms"),
  nameSatellite: Ember.computed.alias("controllers.deployment.nameSatellite"),

  backRouteNameonReviewInstallation: function() {
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
  }.property('isSubscriptions', 'isRhev', 'isOpenStack', 'isCloudForms', 'model.upstream_consumer_uuid'),

  lifecycleEnvironmentName: function() {
    var name = this.get('model.lifecycle_environment.name');
    if (name) {
      return name;
    } else {
      return "Default Organization View";
    }
  }.property('model.lifecycle_environment.name'),

  deploymentButtonAction: function() {
    if (this.get('hasSubscriptionsToAttach')) {
      return "attachSubscriptions";
    } else {
      return "installDeployment";
    }
  }.property('hasSubscriptionsToAttach')

});
