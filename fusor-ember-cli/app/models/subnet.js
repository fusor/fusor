import DS from 'ember-data';

export default DS.Model.extend({
  network: DS.attr('string'),
  mask: DS.attr('string'),
  priority: DS.attr('number'),
  name: DS.attr('string'),
  vlanid: DS.attr('string'),
  created_at: DS.attr('date'),
  updated_at: DS.attr('date'),
  dhcp_id: DS.attr('number'),
  tftp_id: DS.attr('number'),
  from: DS.attr('string'),
  to: DS.attr('string'),
  gateway: DS.attr('string'),
  dns_primary: DS.attr('string'),
  dns_secondary: DS.attr('string'),
  dns_id: DS.attr('number'),
  sort_network_id: DS.attr('number'),
  boot_mode: DS.attr('string'),
  ipam: DS.attr('string'),
  trafficTypes: DS.hasMany('trafficType', { async: true }),
  organization: DS.belongsTo('organization')
});
