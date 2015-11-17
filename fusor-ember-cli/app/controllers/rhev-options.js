import Ember from 'ember';
import NeedsDeploymentMixin from "../mixins/needs-deployment-mixin";

export default Ember.Controller.extend(NeedsDeploymentMixin, {

  rhevRootPassword: Ember.computed.alias("deploymentController.model.rhev_root_password"),
  rhevEngineAdminPassword: Ember.computed.alias("deploymentController.model.rhev_engine_admin_password"),
  rhevDatabaseName: Ember.computed.alias("deploymentController.model.rhev_database_name"),
  rhevClusterName: Ember.computed.alias("deploymentController.model.rhev_cluster_name"),
  rhevCpuType: Ember.computed.alias("deploymentController.model.rhev_cpu_type"),
  rhevIsSelfHosted: Ember.computed.alias("deploymentController.model.rhev_is_self_hosted"),

  cpuTypes: ['Intel Conroe Family', 'Intel Penryn Family', 'Intel Nehalem Family',
             'Intel Westmere Family', 'Intel SandyBridge Family', 'Intel Haswell',
             'AMD Opteron G1', 'AMD Opteron G2', 'AMD Opteron G3', 'AMD Opteron G4',
             'AMD Opteron G5', 'IBM POWER 8'],

  optionsBackRouteName: Ember.computed('rhevIsSelfHosted', function() {
    if (this.get('rhevIsSelfHosted')) {
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

  invalidIsAlphaNumericRhevDatabase: Ember.computed('rhevDatabaseName', function() {
      var rx = new RegExp(/^[A-Za-z0-9_-]+$/);
      if (Ember.isPresent(this.get('rhevDatabaseName'))) {
          return !(this.get('rhevDatabaseName').match(rx));
      }
  }),

  invalidIsAlphaNumericRhevCluster: Ember.computed('rhevClusterName', function() {
      var rx = new RegExp(/^[A-Za-z0-9_-]+$/);
      if (Ember.isPresent(this.get('rhevClusterName'))) {
          return !(this.get('rhevClusterName').match(rx));
      }
  }),

  disableNextRhevOptions: Ember.computed(
    'rhevRootPassword',
    'confirmRhevRootPassword',
    'rhevEngineAdminPassword',
    'confirmRhevEngineAdminPassword',
    'invalidIsAlphaNumericRhevDatabase',
    'invalidIsAlphaNumericRhevCluster',
    function() {
      return (Ember.isBlank(this.get('rhevRootPassword')) ||
              this.get('rhevRootPassword') !== this.get('confirmRhevRootPassword') ||
              Ember.isBlank(this.get('rhevEngineAdminPassword')) ||
              this.get('rhevEngineAdminPassword') !== this.get('confirmRhevEngineAdminPassword') ||
              this.get('rhevRootPassword.length') < 8 ||
              this.get('rhevEngineAdminPassword.length') < 8 ||
              this.get('invalidIsAlphaNumericRhevDatabase') ||
              this.get('invalidIsAlphaNumericRhevCluster')
             );
    }
  ),

  validRhevOptions: Ember.computed.not('disableNextRhevOptions')

});


