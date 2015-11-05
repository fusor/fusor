import Ember from 'ember';

export default Ember.Controller.extend({

  needs: ['deployment'],

  arrayQuantities: Ember.computed.mapBy('model', 'quantity'),
  totalQuantity: Ember.computed.sum('arrayQuantities'),

  upstream_consumer_uuid: Ember.computed.alias("controllers.deployment.upstream_consumer_uuid")

});
