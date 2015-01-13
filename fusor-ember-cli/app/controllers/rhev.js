import Ember from 'ember';

export default Ember.Controller.extend({
  needs: ['application', 'rhev-setup', 'side-menu'],

  rhevSetup: Ember.computed.alias("controllers.rhev-setup.rhevSetup"),

  isSelfHost: function() {
    return (this.get('rhevSetup') === 'selfhost');
  }.property('rhevSetup'),

  hypervisorTabName: function() {
    if (this.get('isSelfHost')) {
      return 'Hypervisor / Engine';
    } else {
      return 'Hypervisor';
    }
  }.property('isSelfHost'),

});
