import Ember from 'ember';

export default Ember.Route.extend({

  setupController: function(controller, model) {
    controller.set('model', model);
    controller.set('rhevHypervisorHostgroupId', 5);
    controller.set('rhevEngineHostgroupId', 2);
    controller.set('ovirtHypervisorHostgroupId', 9);
    controller.set('ovirtEngineHostgroupId', 7);
  },


});
