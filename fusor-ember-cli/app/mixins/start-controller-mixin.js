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
  disableNextOnStart: Ember.computed('isRhev', 'isOpenStack', 'isCloudForms', 'isOpenShift', function () {
    return (!(this.get('isRhev') || this.get('isOpenStack') || this.get('isCloudForms') || this.get('isOpenShift')));
  }),

  // names
  nameRHCI: Ember.computed('isUpstream', function() {
    if (this.get('isUpstream')) { return "Fusor"; } else { return "QCI"; }
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
    if (this.get('isUpstream')) { return "RDO"; } else { return "RHOSP"; }
  }),

  nameCloudForms: Ember.computed('isUpstream', function() {
    if (this.get('isUpstream')) { return "ManageIQ"; } else { return "CloudForms"; }
  }),

  nameOpenShift: "OpenShift",

  // TODO DRY names mixins
  fullnameRhev: Ember.computed('isUpstream', function() {
    if (this.get('isUpstream')) { return "oVirt Project"; } else { return "Red Hat Enterprise Virtualization"; }
  }),

  fullnameOpenStack: Ember.computed('isUpstream', function() {
    if (this.get('isUpstream')) { return "RDO Project"; } else { return "Red Hat OpenStack Platform"; }
  }),

  fullnameCloudForms: Ember.computed('isUpstream', function() {
    if (this.get('isUpstream')) { return "ManageIQ"; } else { return "Red Hat CloudForms"; }
  }),

  fullnameOpenShift: "OpenShift Enterprise by Red Hat",

});
