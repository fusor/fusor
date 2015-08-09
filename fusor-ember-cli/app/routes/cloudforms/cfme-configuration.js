import Ember from 'ember';

export default Ember.Route.extend({

  deactivate: function() {
    return this.send('saveDeployment', null);
  }

});
