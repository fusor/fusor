import DS from 'ember-data';

export default DS.RESTSerializer.extend({

    primaryKey: 'uuid',

    // add root node 'management_applications' that customer protal JSON response doesn't return
    extractArray(store, type, payload) {
      payload = { management_applications: payload };
      return this._super(store, type, payload);
    },

    // remove attribute keys in the json response that aren't in the model management application
    normalizeHash: {
      management_applications(hash) {
        delete hash.releaseVer;
        delete hash.type;
        delete hash.owner;
        delete hash.installedProducts;
        delete hash.guestIds;
        delete hash.capabilities;
        return hash;
      }
    }

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
