import Ember from 'ember';

export default Ember.Route.extend({

  model: function () {
    return this.modelFor('deployment');
  },

  deactivate: function() {
    return this.send('saveDeployment', null);
  }

});
