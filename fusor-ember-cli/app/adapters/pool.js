import ApplicationAdapter from './application';

export default ApplicationAdapter.extend({

    buildURL: function (type, query) {
        // Use consumer UUID to get pools
        // GET /customer_portal/pools?consumer=' + consumerUUID + '&listall=false');
        return '/customer_portal/pools?consumer=' + query['uuid'];
    }

});
