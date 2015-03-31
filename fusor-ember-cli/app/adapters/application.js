import DS from 'ember-data';

var token = $('meta[name="csrf-token"]').attr('content');
export default DS.ActiveModelAdapter.extend({
    namespace: 'api/v21',
    headers: {
        "X-CSRF-Token": token
    }
});
