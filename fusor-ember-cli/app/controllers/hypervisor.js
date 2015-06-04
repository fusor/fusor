import Ember from 'ember';

export default Ember.Controller.extend({
  needs: ['rhev', 'deployment'],

  host_naming_scheme: Ember.computed.alias("controllers.deployment.host_naming_scheme"),
  custom_preprend_name: Ember.computed.alias("controllers.deployment.custom_preprend_name"),

  namingOptions: ['Freeform', 'MAC address', 'hypervisorN', 'Custom scheme'],

  isFreeform: function() {
    return (this.get('host_naming_scheme') === 'Freeform');
  }.property('host_naming_scheme'),

  isMac: function() {
    return (this.get('host_naming_scheme') === 'MAC address');
  }.property('host_naming_scheme'),

  isCustomScheme: function() {
    return (this.get('host_naming_scheme') === 'Custom scheme');
  }.property('host_naming_scheme'),

  isHypervisorN: function() {
    return (this.get('host_naming_scheme') === 'hypervisorN');
  }.property('host_naming_scheme'),



});
