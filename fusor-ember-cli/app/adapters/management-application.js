import ApplicationAdapter from './application';

export default ApplicationAdapter.extend({

    buildURL: function (type, query) {
        // Use owner key to get consumers (subscription application manangers)
        // GET /customer_portal/owners/#{OWNER['key']}/consumers?type=satellite
        return '/customer_portal/owners/' + query['owner_key'] + '/consumers?type=satellite';
    }

});
