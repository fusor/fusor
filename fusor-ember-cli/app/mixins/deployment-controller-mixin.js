import Ember from 'ember';

export default Ember.Mixin.create({

  applicationController: Ember.inject.controller('application'),
  subscriptionsController: Ember.inject.controller('subscriptions'),
  configureOrganizationController: Ember.inject.controller('configure-organization'),
  configureEnvironmentController: Ember.inject.controller('configure-environment'),
  selectSubscriptionsController: Ember.inject.controller('subscriptions/select-subscriptions'),

  isRhev: Ember.computed.alias("model.deploy_rhev"),
  isOpenStack: Ember.computed.alias("model.deploy_openstack"),
  isCloudForms: Ember.computed.alias("model.deploy_cfme"),
  isOpenShift: Ember.computed.alias("model.deploy_openshift"),

  // default is downstream
  isUpstream: false,
  hideSubscriptions: false,
  isSubscriptions: Ember.computed('isUpstream', 'hideSubscriptions', function () {
    return (!(this.get('hideSubscriptions') && !(this.get('isUpstream'))));
  }),

  // will be overwritten be routes
  isHideWizard: null,

  // declared in controllers, and not in mixin
  // isRhev
  // isOpenStack
  // isCloudForms

  disableNextOnStart: Ember.computed('isRhev', 'isOpenStack', 'isCloudForms', 'isOpenShift', function () {
    return (!(this.get('isRhev') || this.get('isOpenStack') || this.get('isCloudForms') || this.get('isOpenShift')));
  }),

  // names
  nameRHCI: Ember.computed('isUpstream', function() {
    if (this.get('isUpstream')) { return "Fusor"; } else { return "RHCI"; }
  }),

  nameRedHat: Ember.computed('isUpstream', function() {
    if (this.get('isUpstream')) { return ""; } else { return "Red Hat"; }
  }),

  nameSatellite: Ember.computed('isUpstream', function() {
    if (this.get('isUpstream')) { return "Foreman"; } else { return "Satellite"; }
  }),

  nameRhev: Ember.computed('isUpstream', function() {
    if (this.get('isUpstream')) { return "oVirt"; } else { return "RHEV"; }
  }),

  nameOpenStack: Ember.computed('isUpstream', function() {
    if (this.get('isUpstream')) { return "RDO"; } else { return "RHELOSP"; }
  }),

  nameCloudForms: Ember.computed('isUpstream', function() {
    if (this.get('isUpstream')) { return "ManageIQ"; } else { return "CloudForms"; }
  }),

  nameOpenShift: "OpenShift",

  fullnameRhev: Ember.computed('isUpstream', function() {
    if (this.get('isUpstream')) { return "oVirt Project"; } else { return "Red Hat Enterprise Virtualization"; }
  }),

  fullnameOpenStack: Ember.computed('isUpstream', function() {
    if (this.get('isUpstream')) { return "RDO Project"; } else { return "Red Hat Enterprise Linux OpenStack Platform"; }
  }),

  fullnameCloudForms: Ember.computed('isUpstream', function() {
    if (this.get('isUpstream')) { return "ManageIQ"; } else { return "Red Hat Cloud Forms Management Engine"; }
  }),

  fullnameOpenShift: "OpenShift Enterprise by Red Hat",

  // logo
  logoPath: Ember.computed('isUpstream', function() {
    if (this.get('isUpstream')) { return "assets/foreman.png"; } else { return "assets/Header-logotype.png"; }
  }),

  currentStepNumber: null, //set by setupController,

  numberProducts: Ember.computed('isRhev', 'isOpenStack', 'isCloudForms', 'isOpenShift', function() {
    var rhev = this.get('isRhev') ? 1 : 0;
    var osp = this.get('isOpenStack') ? 1 : 0;
    var cfme = this.get('isCloudForms') ? 1 : 0;
    var osh = this.get('isOpenShift') ? 1 : 0;
    return rhev + osp + cfme + osh;
  }),

  // steps
  stepNumberRhev: Ember.computed('isRhev', function() {
    if (this.get('isRhev')) {
      return 2;
    }
  }),

  stepNumberOpenstack: Ember.computed('stepNumberRhev', 'isOpenStack', function() {
    if (this.get('isOpenStack')) {
      if (this.get('stepNumberRhev')) {
        return this.get('stepNumberRhev') + 1;
      } else {
        return 2;
      }
    }
  }),

  stepNumberOpenShift: Ember.computed('stepNumberOpenstack', 'isOpenShift', function() {
    if (this.get('isOpenShift')) {
      if (this.get('stepNumberOpenstack')) {
        return this.get('stepNumberOpenstack') + 1;
      } else if (this.get('stepNumberRhev')) {
        return this.get('stepNumberRhev') + 1;
      } else {
        return 2;
      }
    }
  }),

  stepNumberCloudForms: Ember.computed('stepNumberOpenShift', 'isCloudForms', function() {
    if (this.get('isCloudForms')) {
      if (this.get('stepNumberOpenShift')) {
        return this.get('stepNumberOpenShift') + 1;
      } else if (this.get('stepNumberOpenstack')) {
        return this.get('stepNumberOpenstack') + 1;
      } else if (this.get('stepNumberRhev')) {
        return this.get('stepNumberRhev') + 1;
      } else {
        return 2;
      }
    }
  }),

  stepNumberSubscriptions: Ember.computed('numberProducts', 'isSubscriptions', function() {
    if (this.get('isSubscriptions')) {
      return (this.get('numberProducts') + 2);
    }
  }),

  // calculate temporary without isSubscriptions
  stepNumberReviewTemp: Ember.computed('numberProducts', 'isSubscriptions', function() {
    if (this.get('isSubscriptions')) {
      return (this.get('numberProducts') + 3);
    } else {
      return (this.get('numberProducts') + 2);
    }
  }),

  stepNumberReview: Ember.computed('stepNumberReviewTemp', 'isSubscriptions', function() {
    if (this.get('isSubscriptions')) {
      return this.get('stepNumberReviewTemp');
    } else {
      return (this.get('stepNumberReviewTemp') - 1);
    }
  }),

  step2RouteName: Ember.computed('isRhev', 'isOpenStack', function() {
    if (this.get('isRhev')) {
      return 'rhev';
    } else if (this.get('isOpenStack')) {
      return 'openstack';
    }
  }),

  step3RouteName: Ember.computed(
    'step2RouteName',
    'isOpenStack',
    'isOpenShift',
    'isCloudForms',
    'isSubscriptions',
    function() {
      if (this.get('step2RouteName') === 'rhev') {
        if (this.get('isOpenStack')) {
          return 'openstack';
        } else if (this.get('isOpenShift')) {
          return 'openshift';
        } else if (this.get('isCloudForms')) {
          return 'cloudforms';
        } else if (this.get('isSubscriptions')) {
          return 'subscriptions';
        } else {
          return 'review';
        }
      } else if (this.get('step2RouteName') === 'openstack') {
        if (this.get('isOpenShift')) {
          return 'openshift';
        } else if (this.get('isCloudForms')) {
          return 'cloudforms';
        } else if (this.get('isSubscriptions')) {
          return 'subscriptions';
        } else {
          return 'review';
        }
      }
    }
  )

});
