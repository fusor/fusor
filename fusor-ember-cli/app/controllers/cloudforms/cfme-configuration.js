import Ember from 'ember';
import NeedsDeploymentMixin from "../../mixins/needs-deployment-mixin";
import { EqualityValidator, PasswordValidator } from '../../utils/validators';

export default Ember.Controller.extend(NeedsDeploymentMixin, {

  cfmeRootPassword: Ember.computed.alias("deploymentController.model.cfme_root_password"),
  cfmeAdminPassword: Ember.computed.alias("deploymentController.model.cfme_admin_password"),
  confirmCfmeRootPassword: Ember.computed.alias("deploymentController.confirmCfmeRootPassword"),
  confirmCfmeAdminPassword: Ember.computed.alias("deploymentController.confirmCfmeAdminPassword"),

  isSubscriptions: Ember.computed.alias("deploymentController.isSubscriptions"),

  nextRouteNameAfterCFME: Ember.computed('isSubscriptions', function () {
    if (this.get('isSubscriptions')) {
      return 'subscriptions';
    } else {
      return 'review';
    }
  }),

  passwordValidator: PasswordValidator.create({}),

  confirmCfmeRootPasswordValidator: Ember.computed('cfmeRootPassword', function() {
    return EqualityValidator.create({equals: this.get('cfmeRootPassword')});
  }),

  confirmCfmeAdminPasswordValidator: Ember.computed('cfmeAdminPassword', function() {
    return EqualityValidator.create({equals: this.get('cfmeAdminPassword')});
  }),

  hasCFRootPassword: Ember.computed('cfmeRootPassword', function() {
    return this.get('passwordValidator').isValid(this.get('cfmeRootPassword'));
  }),
  hasNoCFRootPassword: Ember.computed.not("hasCFRootPassword"),

  hasCFAdminPassword: Ember.computed('cfmeAdminPassword', function() {
    return this.get('passwordValidator').isValid(this.get('cfmeAdminPassword'));
  }),
  hasNoCFAdminPassword: Ember.computed.not("hasCFAdminPassword"),

  isValidCfmeConfiguration: Ember.computed(
    'cfmeRootPassword',
    'confirmCfmeRootPassword',
    'cfmeAdminPassword',
    'confirmCfmeAdminPassword',
    function () {
      return this.get('hasCFRootPassword') &&
             this.get('hasCFAdminPassword') &&
             this.get('cfmeRootPassword') === this.get('confirmCfmeRootPassword') &&
             this.get('cfmeAdminPassword') === this.get('confirmCfmeAdminPassword');
    }
  ),

  disableNextCfmeConfiguration: Ember.computed.not("isValidCfmeConfiguration")

});
