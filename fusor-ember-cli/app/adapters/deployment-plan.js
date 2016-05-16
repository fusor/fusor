import DS from 'ember-data';
import Ember from 'ember';

export default DS.ActiveModelAdapter.extend({

  // 'overcloud' is hard coded
  // ex. /fusor/api/openstack/deployments/:id/deployment_plans/overcloud
  urlForFindRecord(id, modelName, snapshot) {
    return '/fusor/api/openstack/deployments/' + id + '/deployment_plans/overcloud';
  },

  shouldReloadRecord: function (store, snapshot) {
    return true;
  },

  // using queryrecord because findRecord won't stop caching
  urlForQueryRecord(query, modelName) {
    if (query.deployment_id) {
      return `/fusor/api/openstack/deployments/${query.deployment_id}/deployment_plans/overcloud`;
    }
    return this._super(query, modelName);
  }
});
