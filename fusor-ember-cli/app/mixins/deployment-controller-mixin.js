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

  // route names will be overwrriten by active hook in routes/deployment.js
  // and routes/deployment-new.js and routes/start.js and routes/deployment-new/start.js
  satelliteTabRouteName: null,
  organizationTabRouteName: null,
  lifecycleEnvironmentTabRouteName: null,

  disableNextOnStart: Ember.computed('isRhev', 'isOpenStack', 'isCloudForms', function () {
    return (!(this.get('isRhev') || this.get('isOpenStack') || this.get('isCloudForms')));
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

  fullnameRhev: Ember.computed('isUpstream', function() {
    if (this.get('isUpstream')) { return "oVirt Project"; } else { return "Red Hat Enterprise Virtualization"; }
  }),

  fullnameOpenStack: Ember.computed('isUpstream', function() {
    if (this.get('isUpstream')) { return "RDO Project"; } else { return "Red Hat Enterprise Linux OpenStack Platform"; }
  }),

  fullnameCloudForms: Ember.computed('isUpstream', function() {
    if (this.get('isUpstream')) { return "ManageIQ"; } else { return "Red Hat Cloud Forms Management Engine"; }
  }),

  // logo
  logoPath: Ember.computed('isUpstream', function() {
    if (this.get('isUpstream')) { return "assets/foreman.png"; } else { return "assets/Header-logotype.png"; }
  }),

  currentStepNumber: null, //set by setupController,

  // steps
  stepNumberRhev: 2,

  stepNumberOpenstack: Ember.computed('isRhev', function() {
    if (this.get('isRhev')) {
      return 3;
    } else {
      return 2;
    }
  }),

  stepNumberCloudForms: Ember.computed('isRhev', 'isOpenStack', function() {
    if (this.get('isRhev') && this.get('isOpenStack')) {
      return 4;
    } else if (this.get('isRhev') || this.get('isOpenStack'))  {
      return 3;
    } else {
      return 2;
    }
  }),

  stepNumberSubscriptions: Ember.computed('isRhev', 'isOpenStack', 'isCloudForms', function() {
    if (this.get('isRhev') && this.get('isOpenStack') && this.get('isCloudForms')) {
      return 5;
    } else if ((this.get('isRhev') && this.get('isOpenStack')) || (this.get('isRhev') && this.get('isCloudForms')) ||  (this.get('isOpenStack') && this.get('isCloudForms')))  {
      return 4;
    } else if (this.get('isRhev') || this.get('isOpenStack') || this.get('isCloudForms')) {
      return 3;
    } else {
      return 2;
    }
  }),

  // calculate temporary without isSubscriptions
  stepNumberReviewTemp: Ember.computed('isRhev', 'isOpenStack', 'isCloudForms', function() {
    if (this.get('isRhev') && this.get('isOpenStack') && this.get('isCloudForms')) {
      return 6;
    } else if ((this.get('isRhev') && this.get('isOpenStack')) || (this.get('isRhev') && this.get('isCloudForms')) ||  (this.get('isOpenStack') && this.get('isCloudForms')))  {
      return 5;
    } else if (this.get('isRhev') || this.get('isOpenStack') || this.get('isCloudForms')) {
      return 4;
    } else {
      return 3;
    }
  }),

  stepNumberReview: Ember.computed('stepNumberReviewTemp', 'isSubscriptions', function() {
    if (this.get('isSubscriptions')) {
      return this.get('stepNumberReviewTemp');
    } else {
      return (this.get('stepNumberReviewTemp') - 1);
    }
  }),

  step2RouteName: Ember.computed('isRhev', 'isOpenStack', 'isCloudForms', function() {
    if (this.get('isRhev')) {
      return 'rhev';
    } else if (this.get('isOpenStack')) {
      return 'openstack';
    } else if (this.get('isCloudForms')) {
      return 'cloudforms';
    }
  }),

  step3RouteName: Ember.computed(
    'step2RouteName',
    'isOpenStack',
    'isCloudForms',
    'isSubscriptions',
    function() {
      if (this.get('step2RouteName') === 'rhev') {
        if (this.get('isOpenStack')) {
          return 'openstack';
        } else if (this.get('isCloudForms')) {
          return 'cloudforms';
        } else if (this.get('isSubscriptions')) {
          return 'subscriptions';
        } else {
          return 'review';
        }
      } else if (this.get('step2RouteName') === 'openstack') {
        if (this.get('isCloudForms')) {
          return 'cloudforms';
        } else if (this.get('isSubscriptions')) {
          return 'subscriptions';
        } else {
          return 'review';
        }
      } else if (this.get('step2RouteName') === 'cloudforms') {
        if (this.get('isSubscriptions')) {
          return 'subscriptions';
        } else {
          return 'review';
        }
      }
    }
  )

});
