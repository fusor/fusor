import ApplicationAdapter from './application';

export default ApplicationAdapter.extend({

    // 'overcloud' is harded
    // ex. /fusor/api/openstack/deployments/:id/deployment_plans/overcloud
    urlForFindRecord(id, modelName, snapshot) {
        return '/fusor/api/openstack/deployments/' + id + '/deployment_plans/overcloud';
    }

});
