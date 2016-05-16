import DS from 'ember-data';
import Ember from 'ember';

export default DS.ActiveModelAdapter.extend({

  urlForQuery(query, modelName) {
    // Use consumer UUID to get pools
    // GET /customer_portal/pools?consumer=' + consumerUUID + '&listall=false');
    return "/customer_portal/pools?consumer=" + query["uuid"] + "&listall=false";
  }

});
