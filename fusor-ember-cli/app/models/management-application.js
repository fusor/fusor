import DS from 'ember-data';

export default DS.Model.extend({
  // uuid is not listed here since serializer defines it as primaryKey so it's retreived as id
  name: DS.attr('string'),
  releaseVer: DS.attr('string'),
  username: DS.attr('string'),
  entitlementStatus: DS.attr('string'),
  serviceLevel: DS.attr('string'),
  environment: DS.attr('string'),
  entitlementCount: DS.attr('number'),
  lastCheckin: DS.attr('date'),
  canActivate: DS.attr('boolean'),
  hypervisorId: DS.attr('string'),
  autoheal: DS.attr('boolean'),
  href: DS.attr('string'),
  created: DS.attr('date'),
  updated: DS.attr('date')

});

// These objects are in the JSON response but removed in the serializer
// and not saved in the store
//
// "releaseVer": {
//     "releaseVer": null
// },
// "type": {
//     "id": "9",
//     "label": "satellite",
//     "manifest": true
// },
// "owner": {
//     "id": "8a85f9814a192108014a1adef5826b38",
//     "key": "7473998",
//     "displayName": "7473998",
//     "href": "/owners/7473998"
// },
// "installedProducts": [],
// "guestIds": [],
// "capabilities": [],
