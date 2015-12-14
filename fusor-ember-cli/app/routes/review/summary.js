import Ember from 'ember';

export default Ember.Route.extend({

  model() {
    var deployment_id = this.modelFor('deployment').get('id');
    return this.store.findRecord('deployment', deployment_id);
  }

});
