import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  fullname: DS.attr('string'),
  dns_id: DS.attr('number'),
  total_hosts: DS.attr('number'),
  hostgroups_count: DS.attr('number'),
  created_at: DS.attr('date'),
  updated_at: DS.attr('date'),
  hostgroups: DS.hasMany('hostgroup', {async: true})
});
