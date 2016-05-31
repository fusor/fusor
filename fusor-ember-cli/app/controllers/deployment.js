import Ember from 'ember';
import DeploymentControllerMixin from "../mixins/deployment-controller-mixin";
import DisableTabMixin from "../mixins/disable-tab-mixin";

export default Ember.Controller.extend(DeploymentControllerMixin, DisableTabMixin, {

  deploymentsController: Ember.inject.controller('deployments'),
  deploymentSatelliteIndex: Ember.inject.controller('satellite/index'),
  configureEnvironmentController: Ember.inject.controller('configure-environment'),
  rhevController: Ember.inject.controller('rhev'),
  openstackController: Ember.inject.controller('openstack'),
  openshiftController: Ember.inject.controller('openshift'),
  cloudformsController: Ember.inject.controller('cloudforms'),
  credentialsController: Ember.inject.controller('subscriptions/credentials'),
  selectSubscriptionsController: Ember.inject.controller('subscriptions/select-subscriptions'),

  routeNameSatellite: 'satellite',

  useDefaultOrgViewForEnv: Ember.computed.alias("configureEnvironmentController.useDefaultOrgViewForEnv"),

  isOpenModal: Ember.computed.alias("deploymentsController.isOpenModal"),
  deploymentInModal: Ember.computed.alias("deploymentsController.deploymentInModal"),

  validRhev: Ember.computed.alias("rhevController.validRhev"),
  validOpenStack: Ember.computed.alias("openstackController.validOpenStack"),
  validOpenshift: Ember.computed.alias("openshiftController.validOpenshift"),
  validCloudforms: Ember.computed.alias("cloudformsController.validCloudforms"),
  disableNextOnSelectSubscriptions: Ember.computed.alias("selectSubscriptionsController.disableNextOnSelectSubscriptions"),
  isDisconnected: Ember.computed.alias("model.is_disconnected"),

  isDisabledRhev: Ember.computed.alias("satelliteInvalid"),

  isDisabledOpenstack: Ember.computed("satelliteInvalid", 'isRhev', 'validRhev', function() {
    return (this.get('satelliteInvalid') ||
            (this.get('isRhev') && !(this.get('validRhev')))
           );
  }),

  isDisabledOpenShift: Ember.computed(
    "satelliteInvalid",
    'isRhev',
    'isOpenStack',
    'validRhev',
    'validOpenStack',
    function() {
      return (this.get('satelliteInvalid') ||
              (this.get('isRhev') && !(this.get('validRhev'))) ||
              (this.get('isOpenStack') && !(this.get('validOpenStack')))
              );
    }
  ),

  isDisabledCloudForms: Ember.computed(
    "satelliteInvalid",
    'isRhev',
    'isOpenStack',
    'isOpenShift',
    'validRhev',
    'validOpenStack',
    'validOpenshift',
    function() {
      return (this.get('satelliteInvalid') ||
              (this.get('isRhev') && !(this.get('validRhev'))) ||
              (this.get('isOpenStack') && !(this.get('validOpenStack'))) ||
              (this.get('isOpenShift') && !(this.get('validOpenshift')))
              );
    }
  ),

  isDisabledSubscriptions: Ember.computed(
    "satelliteInvalid",
    'isRhev',
    'isOpenStack',
    'isOpenShift',
    'validRhev',
    'validOpenStack',
    'validOpenshift',
    'isCloudForms',
    'validCloudforms',
    function() {
      return (this.get('satelliteInvalid') ||
              (this.get('isRhev') && !(this.get('validRhev'))) ||
              (this.get('isOpenStack') && !(this.get('validOpenStack'))) ||
              (this.get('isOpenShift') && !(this.get('validOpenshift'))) ||
              (this.get('isCloudForms') && !(this.get('validCloudforms')))
             );
    }
  ),

  hasSubscriptionUUID: Ember.computed(
    'organizationUpstreamConsumerUUID',
    'model.upstream_consumer_uuid',
    function() {
      return (Ember.isPresent(this.get('organizationUpstreamConsumerUUID')) ||
              Ember.isPresent(this.get('model.upstream_consumer_uuid'))
             );
    }
  ),

  isDisabledReview: Ember.computed(
    'isDisconnected',
    'isDisabledSubscriptions',
    'hasSubscriptionUUID',
    'disableNextOnSelectSubscriptions',
    function() {
      return (!this.get('isDisconnected') && (this.get('isDisabledSubscriptions') || !this.get("hasSubscriptionUUID") || this.get('disableNextOnSelectSubscriptions')));
    }
  ),

  hasLifecycleEnvironment: Ember.computed('model.lifecycle_environment', 'useDefaultOrgViewForEnv', function() {
    return (!!(this.get('model.lifecycle_environment.id')) || this.get('useDefaultOrgViewForEnv'));
  }),
  hasNoLifecycleEnvironment: Ember.computed.not('hasLifecycleEnvironment'),

  isValidCommonPassword: Ember.computed.alias("deploymentSatelliteIndex.isValidCommonPassword"),

  isValidNameAndPassword: Ember.computed('isValidDeploymentName', 'isValidCommonPassword',
    function() {
      return (this.get('isValidDeploymentName') && this.get('isValidCommonPassword'));
    }
  ),

  hasInvalidNameOrPassword: Ember.computed.not('isValidNameAndPassword'),
  disableTabLifecycleEnvironment: Ember.computed.not('isValidNameAndPassword'),

  satelliteInvalid: Ember.computed.or('hasNoName',
                                      'hasInvalidNameOrPassword',
                                      'hasNoOrganization',
                                      'hasNoLifecycleEnvironment'),

  skipContent: false,

  numSubscriptionsRequired: Ember.computed(
    'isRhev',
    'isOpenStack',
    'isCloudForms',
    'model.discovered_hosts.[]',
    function() {
      var num = 0;
      if (this.get('isRhev')) {
        num = num + 1 + this.get('model.discovered_hosts.length'); // 1 is for engine
      }
      if (this.get('isCloudForms')) {
        num = num + 1;
      }
      return num;
    }
  ),

  managementApplicationName: Ember.computed(
    'model.upstream_consumer_name',
    'credentialsController.organizationUpstreamConsumerName',
    function() {
      if (Ember.isPresent(this.get('model.upstream_consumer_name'))) {
        return this.get('model.upstream_consumer_name');
      } else {
        return this.get('credentialsController.organizationUpstreamConsumerName');
      }
    }
  ),

  hasEngine: Ember.computed('model.discovered_host.id', function() {
    return Ember.isPresent(this.get("model.discovered_host.id"));
  }),
  hasNoEngine: Ember.computed.not('hasEngine'),

  cntHypervisors: Ember.computed('model.discovered_hosts.[]', function() {
    return this.get('model.discovered_hosts.length');
  }),

  hasHypervisors: Ember.computed('cntHypervisors', function() {
    return (this.get('cntHypervisors') > 0);
  }),
  hasNoHypervisors: Ember.computed.not('hasHypervisors'),

  isStarted: Ember.computed('model.foreman_task_uuid', function() {
    return !!(this.get('model.foreman_task_uuid'));
  }),
  isNotStarted: Ember.computed.not('isStarted'),

  isFinished: Ember.computed('model.progress', function() {
    return (this.get('model.progress') === '1');
  }),
  isNotFinished: Ember.computed.not('isFinished'),

  cntSubscriptions: Ember.computed('model.subscriptions.[]', function() {
    return this.get('model.subscriptions.length');
  }),

  enableAccessInsights: Ember.computed('model.enable_access_insights', function() {
    if (this.get('model.enable_access_insights')) {
      return 'Enabled';
    } else {
      return 'Disabled';
    }
  }),

  hasSubscriptions: Ember.computed('cntSubscriptions', function() {
    return (this.get('cntSubscriptions') > 0);
  }),
  hasNoSubscriptions: Ember.computed.not('hasSubscriptions')
});
