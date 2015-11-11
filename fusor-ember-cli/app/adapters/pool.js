import ApplicationAdapter from './application';

export default ApplicationAdapter.extend({

    urlForQuery(query, modelName) {
        // Use consumer UUID to get pools
        // GET /customer_portal/pools?consumer=' + consumerUUID + '&listall=false');
        return '/customer_portal/pools?consumer=' + query['uuid'];
    }

});
