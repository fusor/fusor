import DS from 'ember-data';

export default DS.RESTSerializer.extend(DS.EmbeddedRecordsMixin, {
    primaryKey: 'name',
    attrs: {
	roles: { embedded: 'always' }
    }
});
