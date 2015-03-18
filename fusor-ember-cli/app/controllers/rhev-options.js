import Ember from 'ember';

export default Ember.Controller.extend({

  needs: ['deployment'],

  rhev_engine_admin_password: Ember.computed.alias("controllers.deployment.rhev_engine_admin_password"),
  rhev_database_name: Ember.computed.alias("controllers.deployment.rhev_database_name"),
  rhev_cluster_name: Ember.computed.alias("controllers.deployment.rhev_cluster_name"),
  rhev_storage_name: Ember.computed.alias("controllers.deployment.rhev_storage_name"),
  rhev_cpu_type: Ember.computed.alias("controllers.deployment.rhev_cpu_type"),

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

});

