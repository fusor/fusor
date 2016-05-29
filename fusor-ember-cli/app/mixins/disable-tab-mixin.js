import Ember from 'ember';
import ValidatesDeploymentNameMixin from "./validates-deployment-name-mixin";

export default Ember.Mixin.create(ValidatesDeploymentNameMixin, {

  deploymentController: Ember.inject.controller('deployment'),
  applicationController: Ember.inject.controller('application'),
  configureEnvironmentController: Ember.inject.controller('configure-environment'),

  hasName: Ember.computed('model.name', function() {
    return (this.get('model.name.length') > 0);
  }),
  hasNoName: Ember.computed.not('hasName'),

  hasOrganization: Ember.computed('model.organization.id', function() {
    return !!(this.get('model.organization.id'));
  }),
  hasNoOrganization: Ember.computed.not('hasOrganization'),

  isValidDeploymentName: Ember.computed('model.name', 'deploymentNameValidator', function() {
    return this.get('deploymentNameValidator').isValid(this.get('model.name'));
  }),
  hasInvalidDeploymentName: Ember.computed.not('isValidDeploymentName'),

  // disable Next on Lifecycle Environment if no lifecycle environment is selected
  // note: hasNoLifecycleEnvironment and hasNoLifecycleEnvironment is defined in /app/controllers/deployment.js
  //       and app/controllers/deployment-new.js rather than in this mixin
  disableNextOnLifecycleEnvironment: Ember.computed.or('hasNoLifecycleEnvironment', 'model.isSaving'),

  // Satellite Tabs Only
  disableTabDeploymentName: false, // always enable tab for entering deployment name
  disableTabAccessInsights: Ember.computed.alias('satelliteInvalid')

});
