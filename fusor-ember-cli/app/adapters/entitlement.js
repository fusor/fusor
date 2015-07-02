import DS from 'ember-data';

export default DS.ActiveModelAdapter.extend({

    buildURL: function (type, query) {
        // Use consumer UUID to get entitlements
        // GET /customer_portal/consumers/#{CONSUMER['uuid']}/entitlements
        //debugger
        return '/customer_portal/consumers/' + query['uuid'] + '/entitlements';

        // To use http-mock instead of live consumer portal, comment out line above and uncomment below
        // return 'api-mock/entitlements';
    },

    // TODO - docs showed urlForQuery hook, is this later ember-data version???
    // source code says - RestAdapter#findQuery has been deprecated and renamed to `query`./
    findQuery: function(store, type, query) {
      // customization here - add query as a parameter fto buildURL
      return this.ajax(this.buildURL(type, query), 'GET');
    },

});
