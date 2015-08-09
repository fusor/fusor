import Ember from 'ember';

export default Ember.Controller.extend({
  needs: ['deployment'],
  stepNumberOpenstack: Ember.computed.alias("controllers.deployment.stepNumberOpenstack")
});
