import Ember from 'ember';

export default Ember.Route.extend({

  model: function(params) {
    return this.store.find('consumer', params.uuid);
  },

  serialize: function(model) {
    // this will make the URL `/consumers/:uuid`
    return { consumer_slug: model.get('uuid') };
  }

});
