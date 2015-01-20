import DS from 'ember-data';

export default DS.RESTSerializer.extend({
 extractArray: function(store, type, payload) {
    // 'foreman-experimental-ui@model:setting:'
    var wrapped_payload = {};
    var model_name = type.toString().split(":")[1];
    wrapped_payload[model_name] = $.map(payload['results'], function(v) { return v;  });
    return this._super(store, type, wrapped_payload);
  },
});
