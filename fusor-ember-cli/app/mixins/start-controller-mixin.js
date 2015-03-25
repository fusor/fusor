import Ember from 'ember';

export default Ember.Mixin.create({

  isUpstream: false,

  // declared in controllers, and not in mixin
  // isRhev
  // isOpenStack
  // isCloudForms

  // route of Next button. It will be overwrriten by active hook in routes/start.js and routes/deployment-new/start.js
  satelliteTabRouteName: null,

  // disable Next button if none selected
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

  // images
  imgRhev: function() {
    if (this.get('isUpstream')) { return "/assets/r/ovirt-640-210.png"; } else { return "/assets/r/rhci-rhev-640-210.png"; }
  }.property('isUpstream'),

  imgOpenStack: function() {
    if (this.get('isUpstream')) { return "/assets/r/rdo-640-210.png"; } else { return "/assets/r/rhci-openstack-640-210.png"; }
  }.property('isUpstream'),

  imgCloudForms: function() {
    if (this.get('isUpstream')) { return "/assets/r/manageiq-640-210.png"; } else { return "/assets/r/rhci-cloudforms-640-210.png"; }
  }.property('isUpstream'),


});
