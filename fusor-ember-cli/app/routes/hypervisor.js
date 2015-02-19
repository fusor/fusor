import Ember from 'ember';

export default Ember.Route.extend({
  beforeModel: function() {
    // UNCOMMENT THIS WHEN CONNECTING TO BACKEND
    //this.transitionTo('hypervisor.discovered-host');
  }
});
