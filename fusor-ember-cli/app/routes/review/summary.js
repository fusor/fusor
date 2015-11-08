import Ember from 'ember';

export default Ember.Route.extend({

  model: function() {
    var deployment_id = this.modelFor('deployment').get('id');
    return this.store.query('deployment', {search: "id = " + deployment_id}).then(function(results) {
        return results.get('firstObject');
    });
  }

});
