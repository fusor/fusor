import Ember from 'ember';

export default Ember.Component.extend({

  namePlusDomain: Ember.computed('host', 'hypervisorDomain', function() {
    if (this.get("host.is_discovered")) {
      return (this.get("host.name") + "." + this.get('hypervisorDomain'));
    } else {
      // name is fqdn for managed host
      return (this.get("host.name"));
    }
  })

});
