import ApplicationAdapter from './application';

export default ApplicationAdapter.extend({

    // 'overcloud' is harded
    // ex. /fusor/api/openstack/deployments/:id/deployment_plans/overcloud
    buildURL: function (type, id, snapshot) {
        var url = '/fusor/api/openstack/deployments/' + id + '/deployment_plans/overcloud';
        return url;
    }

});
