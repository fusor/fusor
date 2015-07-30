import Ember from 'ember';

export default Ember.Controller.extend({

  needs: ['deployment', 'review/installation'],

  isRhev: Ember.computed.alias('controllers.deployment.isRhev'),
  isOpenStack: Ember.computed.alias('controllers.deployment.isOpenStack'),
  isCloudForms: Ember.computed.alias('controllers.deployment.isCloudForms'),

  rhevEngineUrl: function() {
    return ('https://' +
            this.get('controllers.review/installation.selectedRhevEngine.name') +
            '/ovirt-engine/');
  }.property('controllers.review/installation.selectedRhevEngine.name'),

  cfmeUrl: function() {
    return ('https://' + this.get('controllers.deployment.model.cfme_address'));
  }.property('controllers.deployment.model.cfme_address')

});
