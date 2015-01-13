import Ember from 'ember';

export default Ember.Controller.extend({

  needs: ['subscriptions', 'rhci', 'application'],

  isUpstream: Ember.computed.alias("controllers.application.isUpstream"),
  disableNext: Ember.computed.alias("controllers.subscriptions.disableNext"),
  disableTabProgress: true,

  disableTabInstallation: function() {
    return (this.get('disableNext') && (!(this.get('isUpstream'))));
  }.property('disableNext', 'isUpstream'),

  nameSelectSubscriptions: Ember.computed.alias("controllers.rhci.nameSelectSubscriptions"),

});
