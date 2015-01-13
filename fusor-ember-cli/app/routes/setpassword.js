import Ember from 'ember';

export default Ember.Route.extend({
  beforeModel: function() {
    if(this.controllerFor('application').get('isPasswordSet')) {
      this.transitionTo('rhci');
    }
  },
  actions: {
    updatePassword: function() {
      this.controllerFor('application').set('isPasswordSet', true);
      this.transitionTo('rhci');
    }
  }

});
