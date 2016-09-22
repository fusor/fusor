import Ember from 'ember';

import NeedsDeploymentMixin from "../../mixins/needs-deployment-mixin";
import PaginationControllerMixin from "../../mixins/pagination-controller-mixin";
import FilterSortHostsMixin from "../../mixins/filter-sort-hosts-mixin";

import {
  AllValidator,
  PresenceValidator,
  LengthValidator,
  RegExpValidator,
  HostnameValidator
} from '../../utils/validators';

export default Ember.Controller.extend(NeedsDeploymentMixin, PaginationControllerMixin,  FilterSortHostsMixin, {

  sortRoute: "hypervisor.discovered-host",

  deployments: Ember.computed.alias('applicationController.model'),
  deployment: Ember.computed.alias("deploymentController.model"),
  selectedRhevEngine: Ember.computed.alias("deploymentController.model.discovered_host"),


  hostNamingScheme: Ember.computed.alias("deploymentController.model.host_naming_scheme"),
  customPreprendName: Ember.computed.alias("deploymentController.model.custom_preprend_name"),

  namingOptions: ['Freeform', 'MAC address', 'hypervisorN', 'Custom scheme'],

  isFreeform: Ember.computed('hostNamingScheme', function() {
    return (this.get('hostNamingScheme') === 'Freeform');
  }),

  isMac: Ember.computed('hostNamingScheme', function() {
    return (this.get('hostNamingScheme') === 'MAC address');
  }),

  isCustomScheme: Ember.computed('hostNamingScheme', function() {
    return (this.get('hostNamingScheme') === 'Custom scheme');
  }),

  isHypervisorN: Ember.computed('hostNamingScheme', function() {
    return (this.get('hostNamingScheme') === 'hypervisorN');
  }),

  availableHosts: Ember.computed('deployingHosts', 'allDiscoveredHosts.[]', 'hypervisorModelIds.[]', function() {
    let allDiscoveredHosts = this.get('allDiscoveredHosts');

    if (Ember.isEmpty(allDiscoveredHosts)) {
      return [];
    }

    let deployingHosts = this.get('deployingHosts');

    return allDiscoveredHosts.filter(host => {
      let hostId = host.get('id');
      let isDeploying = deployingHosts.any(deployingHost => deployingHost.get('id') === hostId);

      return !isDeploying;
    });
  }),

  hypervisorModelIds: Ember.computed('model.[]', 'selectedRhevEngine', function() {
    if (this.get('model')) {
      var allIds = this.get('model').getEach('id');
      return allIds.removeObject(this.get('selectedRhevEngine').get('id'));
    } else {
      return [];
    }
  }),

  cntSelectedHypervisorHosts: Ember.computed.alias('hypervisorModelIds.length'),

  hostInflection: Ember.computed('cntSelectedHypervisorHosts', function() {
    return this.get('cntSelectedHypervisorHosts') === 1 ? 'host' : 'hosts';
  }),

  isAllChecked: Ember.computed('availableHosts.[]', 'cntSelectedHypervisorHosts', function() {
    return (this.get('cntSelectedHypervisorHosts') === this.get('availableHosts.length'));
  }),

  hypervisorBackRouteName: Ember.computed('rhevIsSelfHosted', function() {
    if (this.get('rhevIsSelfHosted')) {
      return 'rhev-setup';
    } else {
      return 'engine.discovered-host';
    }
  }),

  engineHostnameValidator: AllValidator.create({
    validators: [
      PresenceValidator.create({}),
      HostnameValidator.create({})
    ]
  }),

  hostnameValidity: Ember.Object.create({
    updated: Date.now(),
    state: Ember.Object.create()
  }),
  disableNextOnHypervisor: Ember.computed(
    'hypervisorModelIds',
    'hostnameValidity.updated',
    'rhevIsSelfHosted',
    'deployment.rhev_self_hosted_engine_hostname',
    'engineHostNameValidator',
    function() {
      if(this.get('hypervisorModelIds').get('length') === 0) {
        return true;
      }

      if (this.get('rhevIsSelfHosted') &&
          this.get('engineHostnameValidator').isInvalid(this.get('deployment.rhev_self_hosted_engine_hostname'))) {
        return true;
      }

      let vState = this.get('hostnameValidity').get('state');
      let trackedHostIds = Object.keys(vState);
      return trackedHostIds.length === 0 ||
        !trackedHostIds
          .filter((hostId) => this.get('hypervisorModelIds').contains(hostId))
          .map((k) => vState.get(k))
          .reduce((previousAreTrue, currentValue) => previousAreTrue && currentValue, true);
    }
  ),

  customPrefixValidator: AllValidator.create({
    validators: [
      PresenceValidator.create({}),
      LengthValidator.create({max: 40}),
      RegExpValidator.create({
        regExp: new RegExp(/^(([a-z0-9]|[a-z0-9][a-z0-9\-]*[a-z0-9])\.)*([a-z0-9]|[a-z0-9][a-z0-9\-]*)$/),
        message: 'Custom prefixes must begin with "a-z" or "0-9" and contain only "a-z", "0-9", "." or "-" characters.'
      })
    ]
  }),

  actions: {

    setCheckAll() {
      this.get('model').setObjects([]);
      this.get('model').addObjects(this.get('availableHosts'));
    },

    setUncheckAll() {
      this.get('model').setObjects([]);
    },

    openNamingSchemeModal() {
      this.set('openModalNamingScheme', true);
    },

    cancelNamingScheme() {
      this.get('deploymentController.model').rollbackAttributes();
    },

    saveNamingScheme() {
      this.get('deploymentController.model').save();
    },

    setIfHostnameInvalid(isInvalid, hostId) {
      this.get('hostnameValidity').get('state').set(hostId, !isInvalid);
      this.get('hostnameValidity').set('updated', Date.now());
    },
    setSelectValue(fieldName, selectionValue) {
      this.get('deploymentController').set(fieldName, selectionValue);
    }
  }
});
