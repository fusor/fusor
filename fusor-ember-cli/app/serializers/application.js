import DS from 'ember-data';

export default DS.RESTSerializer.extend({
  extractArray: function(store, type, payload) {
    // 'foreman-experimental-ui@model:setting:'
    var wrapped_payload = {};
    var model_name = type.toString().split(":")[1];
    wrapped_payload[model_name] = payload['results'];
    return this._super(store, type, wrapped_payload);
  },
  extractSingle: function(store, type, payload) {
    var wrapped_payload = {};
    var model_name = type.toString().split(":")[1];
    wrapped_payload[model_name] = payload;
    return this._super(store, type, wrapped_payload);
  },
  extractMeta: function(store, type, payload) {
    var metaFields = ['total', 'subtotal', 'page', 'per_page','search'];
    var meta_payload = {};
    metaFields.forEach(function(meta) {
      meta_payload[meta] = payload[meta];
      delete payload[meta];
    });
    meta_payload['sort'] = payload['sort'];
    store.metaForType(type, meta_payload);
  }
});
