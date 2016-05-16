import DS from 'ember-data';
import Ember from 'ember';

export default DS.ActiveModelAdapter.extend({

  urlForQuery(query, modelName) {
    // Use consumer UUID to get entitlements
    // GET /customer_portal/consumers/#{CONSUMER['uuid']}/entitlements
    return '/customer_portal/consumers/' + query['uuid'] + '/entitlements';
  }

});
