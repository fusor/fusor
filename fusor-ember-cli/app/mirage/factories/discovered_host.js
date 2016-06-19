/*
  This is an example factory definition.

  Create more files in this directory to define additional factories.
*/
import Mirage from 'ember-cli-mirage';

export default Mirage.Factory.extend({
  name: function(i) {                  // and functions
    return 'mac' + i + '254000f6568';
  },
  type: 'Host::Discovered',
  ip: function(i) {                  // and functions
    return '192.168.152. ' + i;
  },
  mac: function(i) {                  // and functions
    return i + '2:54:00:0f:65:68';
  },
  cpus: 4,
  memory_human_size: "7.8 GB",
  disks_human_size: "10 GB",
  disk_count: 1,
  subnet_to_s: "default (192.168.152.0/24)",
  is_virtual: true,
  is_managed: false,
  is_discovered: true

});
