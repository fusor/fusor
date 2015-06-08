import Ember from 'ember';

export default Ember.Controller.extend({

  needs: ['deployment'],

  rhev_root_password: Ember.computed.alias("controllers.deployment.rhev_root_password"),
  rhev_engine_admin_password: Ember.computed.alias("controllers.deployment.rhev_engine_admin_password"),
  rhev_database_name: Ember.computed.alias("controllers.deployment.rhev_database_name"),
  rhev_cluster_name: Ember.computed.alias("controllers.deployment.rhev_cluster_name"),
  rhev_cpu_type: Ember.computed.alias("controllers.deployment.rhev_cpu_type"),
  rhev_is_self_hosted: Ember.computed.alias("controllers.deployment.rhev_is_self_hosted"),

  optionsBackRouteName: function() {
    if (this.get('rhev_is_self_hosted')) {
      return 'engine.discovered-host';
    } else {
      return 'hypervisor.discovered-host';
    }
  }.property('rhev_is_self_hosted'),

  applicationModes: ['Both', 'Virt', 'Gluster'],
  engineLocation: ['Local', 'Remote'],
  dbSetup: ['Automatic', 'Manual'],
  yesNo: ['Yes', 'No'],
  applicationModes2: [
       {
          id: 1,
          name: 'Both',
       },
       {
          id: 2,
          name: 'Virt',
       },
       {
          id: 3,
          name: 'Gluster',
       }
  ],

  disableNextRhevOptions: function() {
    return (Ember.isBlank(this.get('rhev_root_password')) ||
            Ember.isBlank(this.get('rhev_engine_admin_password')) ||
            this.get('rhev_root_password.length') < 8 ||
            this.get('rhev_engine_admin_password.length') < 8
           );
  }.property('rhev_root_password', 'rhev_engine_admin_password'),

  validRhevOptions: Ember.computed.not('disableNextRhevOptions'),

});


