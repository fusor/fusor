import ApplicationAdapter from './application';

export default ApplicationAdapter.extend({

    buildURL: function (type, query) {
        console.log('query  ddddddddd ');
        console.log(query);

        return '/fusor/api/openstack/deployments/' + query['deployment_id'] + '/nodes';
    }

});
