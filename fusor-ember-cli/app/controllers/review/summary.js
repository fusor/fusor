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

  overcloudUrlIP: Ember.computed('model.openstack_deployment.overcloud_hostname', function() {
    return ('http://' + this.get('model.openstack_deployment.overcloud_address') + '/dashboard/admin');
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

  cfmeUrl: Ember.computed('model.cfme_hostname', function() {
    return ('https://' + this.get('model.cfme_hostname'));
  }),
  cfmeUrlIP: Ember.computed('model.cfme_address', function() {
    return ('https://' + this.get('model.cfme_address'));
  }),

  cfmeUrlSelfService: Ember.computed('cfmeUrl', function() {
    return (this.get('cfmeUrl') + '/self_service');
  }),
  cfmeUrlSelfServiceIP: Ember.computed('cfmeUrlIP', function() {
    return (this.get('cfmeUrlIP') + '/self_service');
  })

});
