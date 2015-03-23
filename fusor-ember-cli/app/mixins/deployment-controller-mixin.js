import Ember from 'ember';

export default Ember.Mixin.create({

  needs: ['application', 'subscriptions',
          'configure-organization', 'configure-environment',
          'subscriptions/select-subscriptions'],

  isRhev: Ember.computed.alias("deploy_rhev"),
  isOpenStack: Ember.computed.alias("deploy_openstack"),
  isCloudForms: Ember.computed.alias("deploy_cfme"),

  // default is downstream
  isUpstream: false,

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

  // nameSelectSubscriptions: function() {
  //   if (this.get('isUpstream')) { return "Select Content Source"; } else { return "Select Subscriptions"; }
  // }.property('isUpstream'),

  disableNextOnStart: function () {
    return (!(this.get('isRhev') || this.get('isOpenStack') || this.get('isCloudForms')));
  }.property('isRhev', 'isOpenStack', 'isCloudForms'),


  // names
  nameRHCI: function() {
    if (this.get('isUpstream')) { return "Fusor"; } else { return "RHCI"; }
  }.property('isUpstream'),

  nameRedHat: function() {
    if (this.get('isUpstream')) { return ""; } else { return "Red Hat"; }
  }.property('isUpstream'),

  nameSatellite: function() {
    if (this.get('isUpstream')) { return "Foreman"; } else { return "Satellite"; }
  }.property('isUpstream'),

  nameRhev: function() {
    if (this.get('isUpstream')) { return "oVirt"; } else { return "RHEV"; }
  }.property('isUpstream'),

  nameOpenStack: function() {
    if (this.get('isUpstream')) { return "RDO"; } else { return "RHELOSP"; }
  }.property('isUpstream'),

  nameCloudForms: function() {
    if (this.get('isUpstream')) { return "ManageIQ"; } else { return "CloudForms"; }
  }.property('isUpstream'),

  // logo
  logoPath: function() {
    if (this.get('isUpstream')) { return "assets/foreman.png"; } else { return "assets/Header-logotype.png"; }
  }.property('isUpstream'),

  // steps
  stepNumberRhev: 2,

  stepNumberOpenstack: function() {
    if (this.get('isRhev')) {
      return '3';
    } else {
      return '2';
    }
  }.property('isRhev'),

  stepNumberCloudForms: function() {
    if (this.get('isRhev') && this.get('isOpenStack')) {
      return '4';
    } else if (this.get('isRhev') || this.get('isOpenStack'))  {
      return '3';
    } else {
      return '2';
    }
  }.property('isRhev', 'isOpenStack'),

  stepNumberSubscriptions: function() {
    if (this.get('isRhev') && this.get('isOpenStack') && this.get('isCloudForms')) {
      return '5';
    } else if ((this.get('isRhev') && this.get('isOpenStack')) || (this.get('isRhev') && this.get('isCloudForms')) ||  (this.get('isOpenStack') && this.get('isCloudForms')))  {
      return '4';
    } else if (this.get('isRhev') || this.get('isOpenStack') || this.get('isCloudForms')) {
      return '3';
    } else {
      return '2';
    }
  }.property('isRhev', 'isOpenStack', 'isCloudForms'),

  stepNumberReview: function() {
    if (this.get('isRhev') && this.get('isOpenStack') && this.get('isCloudForms')) {
      return '6';
    } else if ((this.get('isRhev') && this.get('isOpenStack')) || (this.get('isRhev') && this.get('isCloudForms')) ||  (this.get('isOpenStack') && this.get('isCloudForms')))  {
      return '5';
    } else if (this.get('isRhev') || this.get('isOpenStack') || this.get('isCloudForms')) {
      return '4';
    } else {
      return '3';
    }
  }.property('isRhev', 'isOpenStack', 'isCloudForms'),

  step2RouteName: function() {
    if (this.get('isRhev')) {
      return 'rhev';
    } else if (this.get('isOpenStack')) {
      return 'openstack';
    } else if (this.get('isCloudForms')) {
      return 'cloudforms';
    }
  }.property('isRhev', 'isOpenStack', 'isCloudForms'),

});
