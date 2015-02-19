import DS from 'ember-data';

export default DS.ActiveModelAdapter.extend({
    namespace: 'api/v2',

    // headers: function() {
    //   return {
    //     "Accept": "application/json, version=2"
    //     // TODO - Why can't adapter access session?
    //     // Authorization: 'Bearer ' + this.get('session.access_token'),
    //     // Authorization: "Basic " + "YWRtaW46c2VjcmV0"
    //   };
    // }.property("session").volatile()
});
