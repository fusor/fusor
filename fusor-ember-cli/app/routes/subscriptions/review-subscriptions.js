import Ember from 'ember';

export default Ember.Route.extend({

  model() {
    // GET /fusor/subscriptions?source=imported&deployment_id=ID_OF_DEPLOYMENT
    var deploymentId = this.modelFor('deployment').get('id');
    if (this.modelFor('deployment').get('is_disconnected')) {
        return this.store.query('subscription', {deployment_id: deploymentId, source: 'imported'});
    } else {
        return this.store.query('subscription', {deployment_id: deploymentId, source: 'added'}).then(function(results) {
            return results.filter(function(sub) {
                return sub.get('qtySumAttached') > 0;
            });
        });
    }
  }

});
