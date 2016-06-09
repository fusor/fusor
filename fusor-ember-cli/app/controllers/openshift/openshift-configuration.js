import Ember from 'ember';
import NeedsDeploymentMixin from "../../mixins/needs-deployment-mixin";
import {
  RequiredPasswordValidator,
  EqualityValidator,
  validateZipper
} from '../../utils/validators';

export default Ember.Controller.extend(NeedsDeploymentMixin, {

  openshiftController: Ember.inject.controller('openshift'),

  isCloudForms: Ember.computed.alias("deploymentController.isCloudForms"),
  isSubscriptions: Ember.computed.alias("deploymentController.isSubscriptions"),

  nextRouteNameAfterOpenshift: Ember.computed(
    'isCloudForms',
    'isSubscriptions',
    function() {
      if (this.get('isCloudForms')) {
        return 'cloudforms';
      } else if (this.get('isSubscriptions')) {
        return 'subscriptions';
      } else {
        return 'review';
      }
    }
  ),

  isValidOpenshiftConfiguration: Ember.computed.alias('openshiftController.isValidOpenshiftConfiguration'),
  isInvalidOpenshiftConfiguration: Ember.computed.alias('openshiftController.isInvalidOpenshiftConfiguration'),

  storageNameValidator: Ember.computed.alias('openshiftController.storageNameValidator'),
  storageHostValidator: Ember.computed.alias('openshiftController.storageHostValidator'),
  exportPathValidator: Ember.computed.alias('openshiftController.exportPathValidator'),
  usernameValidator: Ember.computed.alias('openshiftController.usernameValidator'),
  subdomainValidator: Ember.computed.alias('openshiftController.subdomainValidator'),

  userpassword: Ember.computed.alias('model.openshift_user_password'),
  passwordValidator: RequiredPasswordValidator.create({}),

  confirmUserPasswordValidator: Ember.computed('userpassword', function() {
    return EqualityValidator.create({equals: this.get('userpassword')});
  }),

  isPasswordValid: Ember.computed('userpassword', 'confirmUserPassword', function() {
    return validateZipper([
      [this.get('passwordValidator'), this.get('userpassword')],
      [this.get('confirmUserPasswordValidator'), this.get('confirmUserPassword')]
    ]);
  }),
  isInvalidPassword: Ember.computed.not('isPasswordValid'),

  isNFS: Ember.computed('model.openshift_storage_type', function() {
    return (this.get('model.openshift_storage_type') === 'NFS');
  }),

  isGluster: Ember.computed('model.openshift_storage_type', function() {
    return (this.get('model.openshift_storage_type') === 'GFS');
  }),

  postTextDomainName: Ember.computed('domainName', function() {
    return "." + this.get('domainName');
  }),

  disableNextOpenshiftConfig: Ember.computed(
    'isInvalidOpenshiftConfiguration',
    'isInvalidPassword',
    function () {
      return this.get('isInvalidOpenshiftConfiguration') || this.get('isInvalidPassword');
    }
  )
});
