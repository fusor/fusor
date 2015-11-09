import Ember from 'ember';

export default Ember.Mixin.create({

  beforeModel() {
    if (this.controllerFor('deployment-new').get('disableNextOnStart')) {
      return this.transitionTo('deployment-new.start');
    }
  }

});
