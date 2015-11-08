import ApplicationAdapter from './application';

export default ApplicationAdapter.extend({

    buildURL: function (type, query) {
        // Use consumer UUID to get entitlements
        // GET /customer_portal/consumers/#{CONSUMER['uuid']}/entitlements
        return '/customer_portal/consumers/' + query['uuid'] + '/entitlements';
    }

});
