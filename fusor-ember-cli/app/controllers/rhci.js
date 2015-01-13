import Ember from 'ember';

export default Ember.ObjectController.extend({
  needs: ['application'],

  isUpstream: Ember.computed.alias("controllers.application.isUpstream"),

  isRhev: true,
  isOpenStack: true,
  isCloudForms: true,

  nameRHCI: function() {
    if (this.get('isUpstream')) { return "Fusor"; } else { return "RHCI"; }
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

  imgRhev: function() {
    if (this.get('isUpstream')) { return "assets/ovirt-640-210.png"; } else { return "assets/rhci-rhev-640-210.png"; }
  }.property('isUpstream'),

  imgOpenStack: function() {
    if (this.get('isUpstream')) { return "assets/rdo-640-210.png"; } else { return "assets/rhci-openstack-640-210.png"; }
  }.property('isUpstream'),

  imgCloudForms: function() {
    if (this.get('isUpstream')) { return "assets/manageiq-640-210.png"; } else { return "assets/rhci-cloudforms-640-210.png"; }
  }.property('isUpstream'),

  nameSelectSubscriptions: function() {
    if (this.get('isUpstream')) { return "Select Content Source"; } else { return "Select Subscriptions"; }
  }.property('isUpstream'),

  logoPath: function() {
    if (this.get('isUpstream')) { return "assets/foreman.png"; } else { return "assets/Header-logotype.png"; }
  }.property('isUpstream'),



  disableNext: function () {
    return (!(this.get('isRhev') || this.get('isOpenStack') || this.get('isCloudForms')));
  }.property('isRhev', 'isOpenStack', 'isCloudForms')
});
