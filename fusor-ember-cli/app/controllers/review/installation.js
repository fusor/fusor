import Ember from 'ember';
import NeedsDeploymentMixin from "../../mixins/needs-deployment-mixin";
import OpenshiftMixin from "../../mixins/openshift-mixin";

export default Ember.Controller.extend(NeedsDeploymentMixin, OpenshiftMixin, {

  rhevController: Ember.inject.controller('rhev'),
  rhevSetupController: Ember.inject.controller('rhev-setup'),
  rhevOptionsController: Ember.inject.controller('rhev-options'),
  selectSubscriptionsController: Ember.inject.controller('subscriptions/select-subscriptions'),
  overcloudController: Ember.inject.controller('openstack/overcloud'),

  isSelfHost: Ember.computed.alias("rhevController.isSelfHost"),
  isDisconnected: Ember.computed.alias("deploymentController.isDisconnected"),
  isNotDisconnected: Ember.computed.not("isDisconnected"),
  cdnUrl: Ember.computed.alias("model.cdn_url"),

  manifestFile: Ember.computed.alias('deploymentController.model.manifest_file'),
  hasManifestFile: Ember.computed.notEmpty('manifestFile'),
  hasNoManifestFile: Ember.computed.not('hasManifestFile'),

  buttonDeployTitle: Ember.computed('isStarted', function() {
    if (this.get('isStarted')) {
      return 'Next';
    } else {
      return 'Deploy';
    }
  }),

  isMissingSubscriptions: Ember.computed('isNotDisconnected',
                                         'hasSubscriptionsToAttach',
                                         'hasSessionPortal',
                                         'hasSubscriptionPools', function() {
                                           return (this.get('isNotDisconnected') && this.get('hasSubscriptionsToAttach') &&
           (!this.get('hasSessionPortal') || !this.get('hasSubscriptionPools')));
                                         }),

  buttonDeployDisabled: Ember.computed(
    'deploymentController.isDisabledReview',
    'isMissingSubscriptions',
    'isDisconnected',
    'hasNoManifestFile',
    'showErrorMessage',
    'showValidationErrors',
    function () {
      return this.get('deploymentController.isDisabledReview') ||
        this.get('isMissingSubscriptions') ||
        (this.get('isDisconnected') && this.get('hasNoManifestFile')) ||
        this.get('showErrorMessage') ||
        this.get('showValidationErrors') > 0;
    }),

  validationWarnings: [],
  showValidationWarnings: Ember.computed('validationWarnings', function () {
    return this.get('validationWarnings.length') > 0;
  }),

  validationErrors: [],
  showValidationErrors: Ember.computed('validationErrors', function () {
    return this.get('validationErrors.length') > 0;
  }),

  foremanTasksURL: null,
  skipContent: Ember.computed.alias("deploymentController.skipContent"),

  showSpinner: false,
  spinnerTextMessage: null,

  isRhevOpen: true,
  isOpenStackOpen: true,
  isCloudFormsOpen: true,
  isSubscriptionsOpen: true,
  isOpenshiftOpen: true,

  engineHostAddressDefault: 'ovirt-hypervisor.rhci.redhat.com',
  hostAddress: Ember.computed.alias("rhevOptionsController.hostAddress"),
  engineHostName: Ember.computed.alias("rhevOptionsController.engineHostName"),

  nameDeployment: Ember.computed.alias("model.name"),
  selectedOrganization: Ember.computed.alias("deploymentController.selectedOrganzation"),
  selectedEnvironment: Ember.computed.alias("deploymentController.selectedEnvironment"),
  rhevSetup: Ember.computed.alias("deploymentController.rhevSetup"),

  isRhev: Ember.computed.alias("deploymentController.isRhev"),
  isOpenStack: Ember.computed.alias("deploymentController.isOpenStack"),
  openStack: Ember.computed.alias("deploymentController.openStack"),
  isOpenShift: Ember.computed.alias("deploymentController.isOpenShift"),
  isCloudForms: Ember.computed.alias("deploymentController.isCloudForms"),
  isSubscriptions: Ember.computed.alias("deploymentController.isSubscriptions"),

  isSelfHosted: Ember.computed.alias("model.rhev_is_self_hosted"),
  selectedHypervisorHosts: Ember.computed.alias("model.discovered_hosts"),

  rhev_engine_host: Ember.computed.alias("model.discovered_host"),
  selectedRhevEngine: Ember.computed.alias("model.discovered_host"),
  isStarted: Ember.computed.alias("model.isStarted"),
  subscriptions: Ember.computed.alias("model.subscriptions"),

  undercloudUrl: Ember.computed('model.openstack_deployment.undercloud_ip_address', function() {
    let ipAddr = this.get('model.openstack_deployment.undercloud_ip_address');
    return ipAddr ? `http://${ipAddr}` : ipAddr;
  }),

  profiles: Ember.computed(
    'model.openstack_deployment.overcloud_compute_flavor',
    'model.openstack_deployment.overcloud_compute_count',
    'model.openstack_deployment.overcloud_controller_flavor',
    'model.openstack_deployment.overcloud_controller_count',
    'model.openstack_deployment.overcloud_ceph_storage_flavor',
    'model.openstack_deployment.overcloud_ceph_storage_count',
    'model.openstack_deployment.overcloud_block_storage_flavor',
    'model.openstack_deployment.overcloud_block_storage_count',
    'model.openstack_deployment.overcloud_object_storage_flavor',
    'model.openstack_deployment.overcloud_object_storage_count',
    function () {
      let profiles = [];

      this.addFlavor(profiles,
        this.get('model.openstack_deployment.overcloud_controller_flavor'),
        this.get('model.openstack_deployment.overcloud_controller_count'),
        'Controller');
      this.addFlavor(profiles,
        this.get('model.openstack_deployment.overcloud_compute_flavor'),
        this.get('model.openstack_deployment.overcloud_compute_count'),
        'Compute');
      this.addFlavor(profiles,
        this.get('model.openstack_deployment.overcloud_ceph_storage_flavor'),
        this.get('model.openstack_deployment.overcloud_ceph_storage_count'),
        'Ceph Storage');
      this.addFlavor(profiles,
        this.get('model.openstack_deployment.overcloud_block_storage_flavor'),
        this.get('model.openstack_deployment.overcloud_block_storage_count'),
        'Block Storage');
      this.addFlavor(profiles,
        this.get('model.openstack_deployment.overcloud_object_storage_flavor'),
        this.get('model.openstack_deployment.overcloud_object_storage_count'),
        'Object Storage');

      return profiles;
    }),

  addFlavor(profiles, flavor, count, name) {
    if (flavor === 'baremetal' || !count) {
      return;
    }

    let profile = profiles.findBy('flavor', flavor);

    if (!profile) {
      profile = Ember.Object.create({flavor: flavor, nodes: []});
      profiles.addObject(profile);
    }

    profile.get('nodes').addObject(Ember.Object.create({name: name, count: count}));
  },

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

  fullOpenshiftSubdomain: Ember.computed(
    'model.openshift_subdomain_name',
    'deploymentController.defaultDomainName',
    function() {
      const subdomainName = this.get('model.openshift_subdomain_name');
      const defaultDomainName = this.get('deploymentController.defaultDomainName');
      return `${subdomainName}.${defaultDomainName}`;
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
          return 'subscriptions.review-subscriptions';
        } else {
          return 'subscriptions.credentials';
        }
      } else {
        if (this.get('isCloudForms')) {
          return 'cloudforms.cfme-configuration';
        } else if (this.get('isOpenShift')) {
          return 'openshift.openshift-configuration';
        } else if (this.get('isOpenStack')) {
          return 'openstack.overcloud';
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

  qtyLabel: Ember.computed('isDisconnected', function() {
    if (this.get('isDisconnected')) {
      return 'Quantity';
    } else {
      return 'Quantity Added';
    }
  }),

  ramNeededGB: Ember.computed('ramNeeded', function() {
    return this.get('ramNeeded') + ' GB';
  }),

  diskNeededGB: Ember.computed('diskNeeded', function() {
    return this.get('diskNeeded') + ' GB';
  }),

  storageSizeGB: Ember.computed('storageSize', function() {
    return this.get('storageSize') + ' GB';
  }),

  closeContinueDeployModal() {
    this.set('openModal', false);
  },

  actions: {
    showContinueDeployModal() {
      this.set('openModal', true);
    },

    onDeployButton() {
      if (this.get('showValidationWarnings')) {
        this.send('showContinueDeployModal');
      } else if (this.get('hasSubscriptionsToAttach')) {
        this.send('attachSubscriptions');
      } else {
        this.send('installDeployment');
      }
    }
  }
});
