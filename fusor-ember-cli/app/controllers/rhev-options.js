import Ember from 'ember';
import NeedsDeploymentMixin from "../mixins/needs-deployment-mixin";
import { EqualityValidator, PasswordValidator, AlphaNumericDashUnderscoreValidator } from '../utils/validators';

export default Ember.Controller.extend(NeedsDeploymentMixin, {

  rhevRootPassword: Ember.computed.alias("deploymentController.model.rhev_root_password"),
  rhevEngineAdminPassword: Ember.computed.alias("deploymentController.model.rhev_engine_admin_password"),
  rhevDatabaseName: Ember.computed.alias("deploymentController.model.rhev_database_name"),
  rhevClusterName: Ember.computed.alias("deploymentController.model.rhev_cluster_name"),
  rhevCpuType: Ember.computed.alias("deploymentController.model.rhev_cpu_type"),
  rhevIsSelfHosted: Ember.computed.alias("deploymentController.model.rhev_is_self_hosted"),
  confirmRhevRootPassword: Ember.computed.alias("deploymentController.confirmRhevRootPassword"),
  confirmRhevEngineAdminPassword: Ember.computed.alias("deploymentController.confirmRhevEngineAdminPassword"),

  cpuTypes: ['Intel Conroe Family', 'Intel Penryn Family', 'Intel Nehalem Family',
             'Intel Westmere Family', 'Intel SandyBridge Family', 'Intel Haswell',
             'AMD Opteron G1', 'AMD Opteron G2', 'AMD Opteron G3', 'AMD Opteron G4',
             'AMD Opteron G5', 'IBM POWER 8'],

  passwordValidator: PasswordValidator.create({}),

  confirmRhevRootPasswordValidator: Ember.computed('rhevRootPassword', function() {
    return EqualityValidator.create({equals: this.get('rhevRootPassword')});
  }),

  confirmRhevEngineAdminPasswordValidator: Ember.computed('rhevEngineAdminPassword', function() {
    return EqualityValidator.create({equals: this.get('rhevEngineAdminPassword')});
  }),

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
          name: 'Both'
       },
       {
          id: 2,
          name: 'Virt'
       },
       {
          id: 3,
          name: 'Gluster'
       }
  ],

  computerNameValidator: AlphaNumericDashUnderscoreValidator.create({}),

  isDirtyRhevDatabaseName: Ember.computed('rhevDatabaseName', function() {
      var changedAttrs = this.get('deploymentController.model').changedAttributes();
      return Ember.isPresent(changedAttrs['rhev_database_name']);
  }),

  isDirtyRhevClusterName: Ember.computed('rhevClusterName', function() {
      var changedAttrs = this.get('deploymentController.model').changedAttributes();
      return Ember.isPresent(changedAttrs['rhev_cluster_name']);
  }),
  isNotDirtyRhevClusterName: Ember.computed.not('isDirtyRhevClusterName'),

  isClusterNeedRenaming: false,

  showMsgToChangeCluster: Ember.observer('rhevClusterName', 'rhevDatabaseName', function() {
    if ((this.get('isDirtyRhevDatabaseName') &&
        this.get('rhevClusterName') &&
        this.get('isNotDirtyRhevClusterName')) ||
        (this.get('rhevDatabaseName') !== 'Default') &&
        this.get('rhevClusterName') === 'Default') {
            return this.set('isClusterNeedRenaming', true);
    }
  }),

  removeMsgToChangeCluster: Ember.observer('rhevClusterName', function() {
    if (this.get('rhevClusterName.length') > 0 && this.get('isDirtyRhevClusterName')) {
        return this.set('isClusterNeedRenaming', false);
    }
  }),

  validRhevOptions: Ember.computed(
    'rhevRootPassword',
    'confirmRhevRootPassword',
    'confirmRhevRootPasswordValidator',
    'rhevEngineAdminPassword',
    'confirmRhevEngineAdminPassword',
    'confirmRhevEngineAdminPasswordValidator',
    'rhevDatabaseName',
    'rhevClusterName',
    'isClusterNeedRenaming',
    function () {
      return this.get('passwordValidator').isValid(this.get('rhevRootPassword')) &&
        this.get('passwordValidator').isValid(this.get('rhevEngineAdminPassword')) &&
        this.get('confirmRhevRootPasswordValidator').isValid(this.get('confirmRhevRootPassword')) &&
        this.get('confirmRhevEngineAdminPasswordValidator').isValid(this.get('confirmRhevEngineAdminPassword')) &&
        this.get('computerNameValidator').isValid(this.get('rhevDatabaseName')) &&
        this.get('computerNameValidator').isValid(this.get('rhevClusterName')) &&
        !this.get('isClusterNeedRenaming');
    }),

  disableNextRhevOptions: Ember.computed.not('validRhevOptions')
});


