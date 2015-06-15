import DS from 'ember-data';

export default DS.ActiveModelAdapter.extend({
    primaryKey: 'uuid',
    namespace: 'fusor/api/openstack',
});
