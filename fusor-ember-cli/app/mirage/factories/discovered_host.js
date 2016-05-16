/*
  This is an example factory definition.

  Create more files in this directory to define additional factories.
*/
import Mirage from 'ember-cli-mirage';

export default Mirage.Factory.extend({
  name(i) {
    return 'mac' + i + '254000f6568';
  },
  type: 'Host::Discovered',
  ip(i) {
    return '192.168.152. ' + i;
  },
  mac(i) {
    return i + '2:54:00:0f:65:68';
  },
  cpus: 1,
  memory_human_size: "1.96 GB",
  disks_human_size: "10 GB",
  disk_count: 1,
  subnet_to_s: "default (192.168.152.0/24)",
  is_virtual: true,
  is_managed: false,
  is_discovered: true

});
