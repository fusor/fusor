import DS from 'ember-data';

export default DS.ActiveModelAdapter.extend({
    buildURL: function (type, query) {
        alert(this.controllerFor('deployment'));
        var url = '/fusor/api/openstack/deployments/' + query['deployment_id'] + '/underclouds';
        return url;
    },

    // createRecord: function(store, type, snapshot) {
    //   var data = {};
    //   var serializer = store.serializerFor(type.typeKey);

    //   serializer.serializeIntoHash(data, type, snapshot, { includeId: true });

    //   return this.ajax(this.buildURL(type.typeKey, null, snapshot), "POST", { data: data });
    // },


});
