import Ember from 'ember';

export default Ember.Controller.extend({

  needs: ['deployment'],

  rhev_storage_type: Ember.computed.alias("controllers.deployment.rhev_storage_type"),
  rhev_storage_address: Ember.computed.alias("controllers.deployment.rhev_storage_address"),
  rhev_share_path: Ember.computed.alias("controllers.deployment.rhev_share_path"),

  isNFS: function() {
    return (this.get('rhev_storage_type') === 'NFS');
  }.property('rhev_storage_type'),

});
