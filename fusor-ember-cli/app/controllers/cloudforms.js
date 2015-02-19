import Ember from 'ember';

export default Ember.Controller.extend({
  needs: ['deployment'],
  stepNumberCloudForms: Ember.computed.alias("controllers.deployment.stepNumberCloudForms"),

});
