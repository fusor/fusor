import Ember from 'ember';

export default Ember.Controller.extend({
  storageType: 'NFS',
  isNFS: function() {
    return (this.storageType === 'NFS');
  }.property('storageType'),

  isoDomainPath: '/var/lib/exports/iso',
  isoDomainAcl: '3980292e1905(rw)',
  isoDomainName: 'ISO_DOMAIN',



});
