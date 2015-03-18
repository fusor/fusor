import Ember from 'ember';

export default Ember.Route.extend({

  deactivate: function() {
    var deployment = this.modelFor('deployment');
    deployment.save().then(function() {
      return console.log('saved deployment successfully');
    });
  },

});
