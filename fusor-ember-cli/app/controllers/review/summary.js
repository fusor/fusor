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
  undercloudPassword: Ember.computed.alias("model.openstack_undercloud_password"),

  undercloudUrl: Ember.computed('model.openstack_undercloud_hostname', function() {
    return ('http://' + this.get('model.openstack_undercloud_hostname'));
  }),
  undercloudUrlIP: Ember.computed('model.openstack_undercloud_ip_addr', function() {
    return ('http://' + this.get('model.openstack_undercloud_ip_addr'));
  }),

  overcloudUsername: 'admin',
  overcloudPassword: Ember.computed.alias("model.openstack_overcloud_password"),

  overcloudUrl: Ember.computed('model.openstack_overcloud_hostname', function() {
    return ('http://' + this.get('model.openstack_overcloud_hostname') + '/dashboard/admin');
  }),
  overcloudUrlIP: Ember.computed('model.openstack_overcloud_hostname', function() {
    return ('http://' + this.get('model.openstack_overcloud_address') + '/dashboard/admin');
  }),

  selectedRhevEngine: Ember.computed.alias("deploymentController.model.discovered_host"),
  deploymentLabel: Ember.computed.alias('deploymentController.model.label'),

  exampleAppUrl: Ember.computed('deploymentController.defaultDomainName', function() {
    const domainName = this.get('deploymentController.defaultDomainName');
    const subdomainName = this.get('model.openshift_subdomain_name');

    return `http://hello-openshift.${subdomainName}.${domainName}`;
  }),

  rhevEngineUrl: Ember.computed('selectedRhevEngine', function() {
    return ('https://' + this.get('selectedRhevEngine.name') + '/ovirt-engine/');
  }),
  rhevEngineUrlIP: Ember.computed('selectedRhevEngine', function() {
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
