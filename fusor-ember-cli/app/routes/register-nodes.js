import Ember from 'ember';

export default Ember.Route.extend({
  myModel: {
    nodes: [],
    profiles: []
  },

  model: function () {
      return this.myModel;
  },

  setupController: function(controller, model) {
    controller.set('model', model);
    controller.set('showAlertMessage', false);
  },

  deactivate: function() {
    return this.send('saveDeployment', null);
  }

});
