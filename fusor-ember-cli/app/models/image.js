import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  checksum: DS.attr('string'),
  container_format: DS.attr('string'),
  deleted: DS.attr('boolean'),
  deleted_at: DS.attr('date'),
  disk_format: DS.attr('string'),
  is_public: DS.attr('boolean'),
  min_disk: DS.attr('number'),
  min_ram: DS.attr('number'),
  owner: DS.attr('string'),
  protected: DS.attr('boolean'),
  size: DS.attr('number'),
  status: DS.attr('string'),
  updated_at: DS.attr('date'),
  virtual_size: DS.attr('string')

});
