import Ember from 'ember';
import NeedsDeploymentMixin from "../mixins/needs-deployment-mixin";

export default Ember.Controller.extend(NeedsDeploymentMixin, {

  rhev_root_password: Ember.computed.alias("deploymentController.model.rhev_root_password"),
  rhev_engine_admin_password: Ember.computed.alias("deploymentController.model.rhev_engine_admin_password"),
  rhev_database_name: Ember.computed.alias("deploymentController.model.rhev_database_name"),
  rhev_cluster_name: Ember.computed.alias("deploymentController.model.rhev_cluster_name"),
  rhev_cpu_type: Ember.computed.alias("deploymentController.model.rhev_cpu_type"),
  rhev_is_self_hosted: Ember.computed.alias("deploymentController.model.rhev_is_self_hosted"),

  cpuTypes: ['Intel Conroe Family', 'Intel Penryn Family', 'Intel Nehalem Family',
             'Intel Westmere Family', 'Intel SandyBridge Family', 'Intel Haswell',
             'AMD Opteron G1', 'AMD Opteron G2', 'AMD Opteron G3', 'AMD Opteron G4',
             'AMD Opteron G5', 'IBM POWER 8'],

  optionsBackRouteName: Ember.computed('rhev_is_self_hosted', function() {
    if (this.get('rhev_is_self_hosted')) {
      return 'engine.discovered-host';
    } else {
      return 'hypervisor.discovered-host';
    }
  }),

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

  invalidIsAlphaNumericRhevDatabase: Ember.computed('rhev_database_name', function() {
      var rx = new RegExp(/^[A-Za-z0-9_-]+$/);
      if (Ember.isPresent(this.get('rhev_database_name'))) {
          return !(this.get('rhev_database_name').match(rx));
      }
  }),

  invalidIsAlphaNumericRhevCluster: Ember.computed('rhev_cluster_name', function() {
      var rx = new RegExp(/^[A-Za-z0-9_-]+$/);
      if (Ember.isPresent(this.get('rhev_cluster_name'))) {
          return !(this.get('rhev_cluster_name').match(rx));
      }
  }),

  disableNextRhevOptions: Ember.computed(
    'rhev_root_password',
    'rhev_engine_admin_password',
    'invalidIsAlphaNumericRhevDatabase',
    'invalidIsAlphaNumericRhevCluster',
    function() {
      return (Ember.isBlank(this.get('rhev_root_password')) ||
              Ember.isBlank(this.get('rhev_engine_admin_password')) ||
              this.get('rhev_root_password.length') < 8 ||
              this.get('rhev_engine_admin_password.length') < 8 ||
              this.get('invalidIsAlphaNumericRhevDatabase') ||
              this.get('invalidIsAlphaNumericRhevCluster')
             );
    }
  ),

  validRhevOptions: Ember.computed.not('disableNextRhevOptions')

});


