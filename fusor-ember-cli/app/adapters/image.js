import DS from 'ember-data';
import Ember from 'ember';

export default DS.ActiveModelAdapter.extend({

  urlForQuery(query, modelName) {
    return '/fusor/api/openstack/deployments/' + query['deployment_id'] + '/images';
  }

});
