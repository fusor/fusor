import Ember from 'ember';

export default Ember.Route.extend({

  deactivate() {
    return this.send('saveDeployment', null);
  }

});
