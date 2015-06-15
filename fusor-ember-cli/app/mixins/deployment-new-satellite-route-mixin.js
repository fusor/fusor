import Ember from 'ember';

export default Ember.Mixin.create({

  beforeModel: function() {
    // commented this out in 'develop' branch since it cause conflict in redirecting to config-environment
    // if (this.controllerFor('deployment-new').get('disableNextOnStart')) {
    //   return this.transitionTo('deployment-new.start');
    // }
  },

});
