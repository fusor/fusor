import Ember from 'ember';

export default Ember.Route.extend({

  model() {
    // GET /fusor/subscriptions?source=imported&deployment_id=ID_OF_DEPLOYMENT
    var deploymentId = this.modelFor('deployment').get('id');
    return this.store.query('subscription', {deployment_id: deploymentId, source: 'imported'});
  }

});
