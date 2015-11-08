import ApplicationAdapter from './application';

export default ApplicationAdapter.extend({

    buildURL: function (type, query) {
        var url = '/fusor/api/openstack/deployments/' + query['deployment_id'] + '/images';
        return url;
    }

});
