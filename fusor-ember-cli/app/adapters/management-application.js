import DS from 'ember-data';

export default DS.ActiveModelAdapter.extend({

    buildURL: function (type, query) {
        // Use owner key to get consumers (subscription application manangers)
        // GET /customer_portal/owners/#{OWNER['key']}/consumers?type=satellite
        return '/customer_portal/owners/' + query['owner_key'] + '/consumers?type=satellite';

        // To use http-mock instead of live consumer portal, comment out line above and uncomment below
        // return 'api-mock/consumers';
    },

    // TODO - docs showed urlForQuery hook, is this later ember-data version???
    // source code says - RestAdapter#findQuery has been deprecated and renamed to `query`./
    findQuery: function(store, type, query) {
      // customization here - add query as a parameter fto buildURL
      return this.ajax(this.buildURL(type, query), 'GET');
    },

});
