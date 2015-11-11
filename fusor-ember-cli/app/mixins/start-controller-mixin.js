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

  // images
  imgRhev: Ember.computed('isUpstream', function() {
    if (this.get('isUpstream')) { return "/assets/r/ovirt-640-210.png"; } else { return "/assets/r/rhci-rhev-640-210.png"; }
  }),

  imgOpenStack: Ember.computed('isUpstream', function() {
    if (this.get('isUpstream')) { return "/assets/r/rdo-640-210.png"; } else { return "/assets/r/rhci-openstack-640-210.png"; }
  }),

  imgCloudForms: Ember.computed('isUpstream', function() {
    if (this.get('isUpstream')) { return "/assets/r/manageiq-640-210.png"; } else { return "/assets/r/rhci-cloudforms-640-210.png"; }
  })

});
