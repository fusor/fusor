import Ember from 'ember';
import NeedsDeploymentMixin from "../../mixins/needs-deployment-mixin";

export default Ember.Controller.extend(NeedsDeploymentMixin, {

  isRhev: Ember.computed.alias('deploymentController.isRhev'),
  isOpenStack: Ember.computed.alias('deploymentController.isOpenStack'),
  isOpenShift: Ember.computed.alias('deploymentController.isOpenShift'),
  isCloudForms: Ember.computed.alias('deploymentController.isCloudForms'),

  isRhevOpen: true,
  isOpenStackOpen: true,
  isCloudFormsOpen: true,
  isOpenShiftOpen: true,

  undercloudUsername: 'admin',
  undercloudPassword: Ember.computed.alias("model.openstack_deployment.undercloud_admin_password"),

  overcloudUsername: 'admin',
  overcloudPassword: Ember.computed.alias("model.openstack_deployment.overcloud_password"),

  overcloudUrl: Ember.computed('model.openstack_deployment.overcloud_hostname', function() {
    return ('https://' + this.get('model.openstack_deployment.overcloud_hostname') + '/dashboard/admin');
  }),

  selectedRhevEngine: Ember.computed.alias('model.discovered_host'),
  deploymentLabel: Ember.computed.alias('deploymentController.model.label'),

  exampleAppUrl: Ember.computed('deploymentController.defaultDomainName', function() {
    const domainName = this.get('deploymentController.defaultDomainName');
    const subdomainName = this.get('model.openshift_subdomain_name');

    return `http://hello-openshift.${subdomainName}.${domainName}`;
  }),

  rhevEngineUrl: Ember.computed('selectedRhevEngine.name', 'selectedRhevEngine.domain_name', function() {
    // The cached version of the model for selectedRhevEngine  has a stale name without the domain name,
    // but is of type Host::Managed, so we can't tell if it needs to add the domain based on Discovered/Managed.
    // We just add in the domain if we can't find it in the name.
    let domainName = this.get('selectedRhevEngine.domain_name');
    let engineName = this.get('selectedRhevEngine.name');

    if (engineName && domainName && engineName.toLowerCase().indexOf(domainName.toLowerCase()) < 0) {
      engineName = `${engineName}.${domainName}`;
    }

    return ('https://' + engineName + '/ovirt-engine/');
  }),

  rhevEngineUrlIP: Ember.computed('selectedRhevEngine.ip', function() {
    return ('https://' + this.get('selectedRhevEngine.ip') + '/ovirt-engine/');
  }),

  multipleCfme: Ember.computed.alias('model.multipleCfme'),

  primaryCfmeUrl: Ember.computed('model.primaryCfmeHostname', function() {
    return ('https://' + this.get('model.primaryCfmeHostname'));
  }),

  primaryCfmeUrlSelfService: Ember.computed('primaryCfmeUrl', function() {
    return (this.get('primaryCfmeUrl') + '/self_service');
  }),

  workerCfmeUrl: Ember.computed('model.workerCfmeHostname', function() {
    return ('https://' + this.get('model.workerCfmeHostname'));
  }),

  workerCfmeUrlSelfService: Ember.computed('workerCfmeUrl', function() {
    return (this.get('workerCfmeUrl') + '/self_service');
  })
});
