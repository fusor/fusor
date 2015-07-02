import ApplicationAdapter from './application';

export default ApplicationAdapter.extend({

    buildURL: function (type, query) {
        // Use consumer UUID to get pools
        // GET /customer_portal/pools?consumer=' + consumerUUID + '&listall=false');
        return '/customer_portal/pools?consumer=' + query['uuid'];

        // To use http-mock instead of live consumer portal, comment out line above and uncomment below
        // return 'api-mock/pools';
    },

    // TODO - docs showed urlForQuery hook, is this later ember-data version???
    // source code says - RestAdapter#findQuery has been deprecated and renamed to `query`./
    findQuery: function(store, type, query) {
      // customization here - add query as a parameter fto buildURL
      return this.ajax(this.buildURL(type, query), 'GET');
    },

});
