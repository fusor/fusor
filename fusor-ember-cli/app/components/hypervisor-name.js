import Ember from 'ember';

export default Ember.Component.extend({

  namePlusDomain: function() {
    if (this.get("host.is_discovered")) {
      // need to add domain for discovered host to make fqdn
      // TODO - dynamically get domain name of hostgroup Fusor Base if is not example.com
      return (this.get("host.name") + '.example.com');
    } else {
      // name is fqdn for managed host
      return (this.get("host.name"));
    }
  }.property('host'),

});
