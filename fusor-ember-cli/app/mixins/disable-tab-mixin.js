import Ember from 'ember';

export default Ember.Mixin.create({

  needs: ['deployment', 'configure-organization', 'configure-environment'],

  hasName: function() {
    return (this.get('model.name.length') > 0);
  }.property('model.name'),
  hasNoName: Ember.computed.not('hasName'),

  hasOrganization: function() {
    return !!(this.get('model.organization.id'));
  }.property('model.organization.id'),
  hasNoOrganization: Ember.computed.not('hasOrganization'),

  // disable All if there is no deployment name
  disableAll: Ember.computed.alias("hasNoName"),

  // disable Next on Deployment Name if there is no deployment name
  disableNextOnDeploymentName: Ember.computed.alias("hasNoName"),

  // disable Next on Configure Organization if no organization is selected
  disableNextOnConfigureOrganization: Ember.computed.or('hasNoOrganization', 'disableAll'),

  // disable Next on Lifecycle Environment if no lifecycle environment is selected
  // note: hasNoLifecycleEnvironment and hasNoLifecycleEnvironment is defined in /app/controllers/deployment.js
  //       and app/controllers/deployment-new.js rather than in this mixin
  disableNextOnLifecycleEnvironment: Ember.computed.or('hasNoLifecycleEnvironment', 'disableAll', 'model.isSaving'),

  // Satellite Tabs Only
  disableTabDeploymentName: false, // always enable tab for entering deployment name
  disableTabConfigureOrganization: Ember.computed.alias('disableNextOnDeploymentName'),
  disableTabLifecycleEnvironment: Ember.computed.alias("disableNextOnConfigureOrganization"),

});
