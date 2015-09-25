import DS from 'ember-data';

export default DS.ActiveModelAdapter.extend({
    buildURL: function (type, query) {
      var url = '/fusor/api/openstack/deployments/' + query['deployment_id'] + '/flavors';
      return url;
    },

    findQuery: function(store, type, query) {
      // customization here - add query as a parameter fto buildURL
      return this.ajax(this.buildURL(type, query), 'GET');
    }

});
