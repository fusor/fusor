import DS from 'ember-data';

export default DS.ActiveModelAdapter.extend({
    namespace: 'api/v2',
    host: 'http://localhost:3000'

    // TODO - Why can't adapter access session?
    // headers: function() {
    //     alert(this.get('session.access_token'));
    //   return {
    //     "Accept": "application/json",
    //     "Authorization": 'Bearer ' + this.get('session.access_token'),
    // //    //  Authorization: "Basic " + "YWRtaW46c2VjcmV0"
    //   };
    // }.property("session").volatile()
});
