import Ember from 'ember';
import NeedsDeploymentMixin from "../../mixins/needs-deployment-mixin";
import { EqualityValidator, PasswordValidator } from '../../utils/validators';

export default Ember.Controller.extend(NeedsDeploymentMixin, {

  cfmeRootPassword: Ember.computed.alias("deploymentController.model.cfme_root_password"),
  cfmeAdminPassword: Ember.computed.alias("deploymentController.model.cfme_admin_password"),
  cfmeDbPassword: Ember.computed.alias("deploymentController.model.cfme_db_password"),
  confirmCfmeRootPassword: Ember.computed.alias("deploymentController.confirmCfmeRootPassword"),
  confirmCfmeAdminPassword: Ember.computed.alias("deploymentController.confirmCfmeAdminPassword"),
  confirmCfmeDbPassword: Ember.computed.alias("deploymentController.confirmCfmeDbPassword"),

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

  confirmCfmeDbPasswordValidator: Ember.computed('cfmeDbPassword', function() {
    return EqualityValidator.create({equals: this.get('cfmeDbPassword')});
  }),

  hasCFRootPassword: Ember.computed('cfmeRootPassword', function() {
    return this.get('passwordValidator').isValid(this.get('cfmeRootPassword'));
  }),
  hasNoCFRootPassword: Ember.computed.not("hasCFRootPassword"),

  hasCFAdminPassword: Ember.computed('cfmeAdminPassword', function() {
    return this.get('passwordValidator').isValid(this.get('cfmeAdminPassword'));
  }),
  hasNoCFAdminPassword: Ember.computed.not("hasCFAdminPassword"),

  hasCFDbPassword: Ember.computed('cfmeDbPassword', function() {
    return this.get('passwordValidator').isValid(this.get('cfmeDbPassword'));
  }),
  hasNoCFDbPassword: Ember.computed.not("hasCFDbPassword"),

  isValidCfmeConfiguration: Ember.computed(
    'cfmeRootPassword',
    'confirmCfmeRootPassword',
    'cfmeAdminPassword',
    'confirmCfmeAdminPassword',
    'cfmeDbPassword',
    'confirmCfmeDbPassword',
    function () {
      return this.get('hasCFRootPassword') &&
             this.get('hasCFAdminPassword') &&
             this.get('cfmeRootPassword') === this.get('confirmCfmeRootPassword') &&
             this.get('cfmeAdminPassword') === this.get('confirmCfmeAdminPassword') &&
             this.get('cfmeDbPassword') === this.get('confirmCfmeDbPassword');
    }
  ),

  disableNextCfmeConfiguration: Ember.computed.not("isValidCfmeConfiguration")

});
