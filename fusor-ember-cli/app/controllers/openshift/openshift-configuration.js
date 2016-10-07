import Ember from 'ember';
import NeedsDeploymentMixin from '../../mixins/needs-deployment-mixin';
import ValidatesMounts from '../../mixins/validates-mounts';
import {
  RequiredPasswordValidator,
  EqualityValidator,
  validateZipper
} from '../../utils/validators';

export default Ember.Controller.extend(NeedsDeploymentMixin, ValidatesMounts, {

  loadingSpinnerText: 'Trying to mount registry...',

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

  userPassword: Ember.computed.alias('model.openshift_user_password'),
  passwordValidator: RequiredPasswordValidator.create({}),

  confirmUserPasswordValidator: Ember.computed('userPassword', function() {
    return EqualityValidator.create({equals: this.get('userPassword')});
  }),

  isPasswordValid: Ember.computed('userPassword', 'confirmUserPassword', function() {
    return validateZipper([
      [this.get('passwordValidator'), this.get('userPassword')],
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
  ),

  actions: {
    testStorageMount() {
      const deployment = this.get('deploymentController.model');
      deployment.trimFieldsForSave();
      this.set('errorMsg', null);

      const params = {
        path: deployment.get('openshift_export_path'),
        address: deployment.get('openshift_storage_host'),
        type: deployment.get('openshift_storage_type')
      };

      this.set('showLoadingSpinner', true);
      this.fetchMountValidation(this.get('deploymentId'), params).then(result => {
        this.set('showLoadingSpinner', false);
        const { mounted } = result;
        if(mounted) {
          this.set('errorMsg', null);
          this.transitionToRoute(this.get('nextRouteNameAfterOpenshift'));
        } else {
          this.set(
            'errorMsg',
            'Failed to mount specified registry'
          );
        }
      }).catch(err => {
        this.set('showLoadingSpinner', false);
        this.set(
          'errorMsg',
          'Error occurred while attempting to validate registry mount'
        );
      });
    }
  }
});
