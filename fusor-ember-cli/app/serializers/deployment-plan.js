import DS from 'ember-data';

export default DS.RESTSerializer.extend(DS.EmbeddedRecordsMixin, {
  primaryKey: 'name',
  attrs: {
    parameters: { embedded: 'always' },
    roles: { embedded: 'always' }
  }
});
