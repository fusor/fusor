import ApplicationAdapter from './application';

export default ApplicationAdapter.extend({

  urlForQuery(query, modelName) {
    return '/fusor/api/openstack/deployments/' + query['deployment_id'] + '/images';
  }

});
