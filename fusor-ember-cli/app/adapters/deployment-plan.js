import DS from 'ember-data';

var token = Ember.$('meta[name="csrf-token"]').attr('content');
export default DS.ActiveModelAdapter.extend({
    headers: {
        "X-CSRF-Token": token
    },

    // 'overcloud' is harded
    // ex. /fusor/api/openstack/deployments/:id/deployment_plans/overcloud
    buildURL: function (type, id, snapshot) {
        var url = '/fusor/api/openstack/deployments/' + id + '/deployment_plans/overcloud';
        return url;
    }
});
