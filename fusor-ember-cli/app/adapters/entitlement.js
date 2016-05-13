import ApplicationAdapter from './application';

export default ApplicationAdapter.extend({

  urlForQuery(query, modelName) {
    // Use consumer UUID to get entitlements
    // GET /customer_portal/consumers/#{CONSUMER['uuid']}/entitlements
    return '/customer_portal/consumers/' + query['uuid'] + '/entitlements';
  }

});
