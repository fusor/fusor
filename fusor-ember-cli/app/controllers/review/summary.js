import Ember from 'ember';
import NeedsDeploymentMixin from "../../mixins/needs-deployment-mixin";

export default Ember.Controller.extend(NeedsDeploymentMixin, {

  isRhev: Ember.computed.alias('deploymentController.isRhev'),
  isOpenStack: Ember.computed.alias('deploymentController.isOpenStack'),
  isCloudForms: Ember.computed.alias('deploymentController.isCloudForms'),

  isRhevOpen: true,
  isOpenStackOpen: true,
  isCloudFormsOpen: true,

  undercloudUsername: 'admin',
  undercloudPassword: Ember.computed.alias("model.openstack_undercloud_password"),

  undercloudUrl: Ember.computed('model.openstack_undercloud_ip_addr', function() {
    return ('http://' + this.get('model.openstack_undercloud_ip_addr'));
  }),

  overcloudUsername: 'admin',
  overcloudPassword: Ember.computed.alias("model.openstack_overcloud_password"),

  overcloudUrl: Ember.computed('model.openstack_overcloud_hostname', function() {
    return ('http://' + this.get('model.openstack_overcloud_hostname') + '/dashboard/admin');
  }),

  selectedRhevEngine: Ember.computed.alias("deploymentController.model.discovered_host"),

  // TODO - make mixin, same method as installation
  engineNamePlusDomain: Ember.computed('selectedRhevEngine', function() {
    if (this.get("selectedRhevEngine.is_discovered")) {
      // need to add domain for discovered host to make fqdn
      // TODO - dynamically get domain name of hostgroup Fusor Base if is not example.com
      return (this.get("selectedRhevEngine.name") + '.example.com');
    } else {
      // name is fqdn for managed host
      return (this.get("selectedRhevEngine.name"));
    }
  }),

  rhevEngineUrl: Ember.computed('selectedRhevEngine', function() {
    return ('https://' + this.get('selectedRhevEngine.name') + '/ovirt-engine/');
  }),

  cfmeUrl: Ember.computed('model.cfme_hostname', function() {
    return ('https://' + this.get('model.cfme_hostname'));
  }),

  cfmeUrlSelfService: Ember.computed('cfmeUrl', function() {
    return (this.get('cfmeUrl') + '/self_service');
  }),
});
