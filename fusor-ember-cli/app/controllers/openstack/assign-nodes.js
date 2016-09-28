import Ember from 'ember';
import DeploymentControllerMixin from "../../mixins/deployment-controller-mixin";
import NeedsDeploymentMixin from "../../mixins/needs-deployment-mixin";

const Role = Ember.Object.extend({
  isAssigned() {
    return Ember.isPresent(this.get('flavor')) && this.get('flavor') !== 'baremetal';
  }
});

const AssignNodesController =  Ember.Controller.extend(DeploymentControllerMixin, NeedsDeploymentMixin, {

  deployment: Ember.computed.alias("deploymentController.model"),
  deploymentId: Ember.computed.alias("deployment.id"),
  openstackDeployment: Ember.computed.alias("model"),
  isCloudForms: Ember.computed.alias("deploymentController.isCloudForms"),

  globalPlanParameters: [],

  roles: [
    Role.create({
      name: 'Compute',
      label: 'Compute',
      parameterPrefixes: ['Nova', 'Compute', 'OvercloudCompute'],
      countParameterName: 'ComputeCount',
      flavorParameterName: 'OvercloudComputeFlavor',
      imageParameterName: 'NovaImage',
      flavorDeploymentAttributeName: 'overcloud_compute_flavor',
      countDeploymentAttributeName: 'overcloud_compute_count',
      roleType: 'compute',
      parameters: [],
      advancedParameters: []
    }),
    Role.create({
      name: 'Controller',
      label: 'Controller',
      parameterPrefixes: ['Controller', 'Control', 'OvercloudControl'],
      countParameterName: 'ControllerCount',
      flavorParameterName: 'OvercloudControlFlavor',
      imageParameterName: 'controllerImage',
      flavorDeploymentAttributeName: 'overcloud_controller_flavor',
      countDeploymentAttributeName: 'overcloud_controller_count',
      roleType: 'controller',
      parameters: [],
      advancedParameters: []
    }),
    Role.create({
      name: 'BlockStorage',
      label: 'Block Storage',
      parameterPrefixes: ['Cinder', 'BlockStorage', 'OvercloudBlockStorage'],
      countParameterName: 'BlockStorageCount',
      flavorParameterName: 'OvercloudBlockStorageFlavor',
      imageParameterName: 'BlockStorageImage',
      flavorDeploymentAttributeName: 'overcloud_block_storage_flavor',
      countDeploymentAttributeName: 'overcloud_block_storage_count',
      roleType: 'block-storage',
      parameters: [],
      advancedParameters: []
    }),
    Role.create({
      name: 'ObjectStorage',
      label: 'Object Storage',
      parameterPrefixes: ['Swift', 'OvercloudSwift', 'ObjectStorage', 'OvercloudObjectStorage'],
      countParameterName: 'ObjectStorageCount',
      flavorParameterName: 'OvercloudSwiftStorageFlavor',
      imageParameterName: 'SwiftStorageImage',
      flavorDeploymentAttributeName: 'overcloud_object_storage_flavor',
      countDeploymentAttributeName: 'overcloud_object_storage_count',
      roleType: 'object-storage',
      parameters: [],
      advancedParameters: []
    })
  ],

  unassignedRoles: Ember.computed('roles.@each.flavor', function () {
    return this.get('roles').filter(role => !role.isAssigned());
  }),

  assignedRoles: Ember.computed('roles.@each.flavor', function () {
    return this.get('roles').filter(role => role.isAssigned());
  }),

  allRolesAssigned: Ember.computed('unassignedRoles.[]', function () {
    return this.get('unassignedRoles.length') === 0;
  }),

  notAllRolesAssigned: Ember.computed.not('allRolesAssigned'),

  numProfiles: Ember.computed('profiles.[]', function () {
    return this.get('profiles.length');
  }),

  nodeCount: Ember.computed('nodes.[]', function () {
    return this.get('nodes.length');
  }),

  isDraggingRole: Ember.computed('roles.[]', 'roles.@each.isDraggingObject', function () {
    return this.get('roles').any(role => role.get('isDraggingObject') === true);
  }),

  droppableClass: Ember.computed('isDraggingRole', function () {
    return this.get('isDraggingRole') ? 'deployment-roles-active' : '';
  }),

  roleCountChanged: Ember.observer('roles.@each.count', function () {
    Ember.run.once(this, 'updateRoleCounts');
  }),

  hasValidNodeAssignments: Ember.computed.alias('openstackDeployment.hasValidNodeAssignments'),

  disableAssignNodesNext: Ember.computed(
    'hasValidNodeAssignments',
    'hasValidRoleCountsPerFlavor',
    function() {
      return !this.get('hasValidNodeAssignments') || !this.get('hasValidRoleCountsPerFlavor');
    }
  ),

  availableNodesPerFlavor: Ember.computed('nodes.[]', 'profiles.@each.name', function() {
    const profiles = this.get('profiles');

    const nodesPerFlavor = profiles.reduce((hash, profile) => {
      hash.set(profile.get('name'), profile.matchingNodeCount(this.get('nodes')));
      return hash;
    }, Ember.Object.create({}));

    return nodesPerFlavor;
  }),

  configuredNodesPerFlavor: Ember.computed(
    'openstackDeployment.overcloud_compute_flavor',
    'openstackDeployment.overcloud_compute_count',
    'openstackDeployment.overcloud_controller_flavor',
    'openstackDeployment.overcloud_controller_count',
    'openstackDeployment.overcloud_block_storage_flavor',
    'openstackDeployment.overcloud_block_storage_count',
    'openstackDeployment.overcloud_object_storage_flavor',
    'openstackDeployment.overcloud_object_storage_count',
    function() {
      return [
        ['overcloud_compute_flavor', 'overcloud_compute_count'],
        ['overcloud_controller_flavor', 'overcloud_controller_count'],
        ['overcloud_block_storage_flavor', 'overcloud_block_storage_count'],
        ['overcloud_object_storage_flavor', 'overcloud_object_storage_count']
      ].reduce((hash, roleProp) => {
        const flavorProp = roleProp[0];
        const flavor = this.get(`openstackDeployment.${flavorProp}`);
        const countProp = roleProp[1];
        const count = this.get(`openstackDeployment.${countProp}`);

        const totalFlavorCount = hash.get(flavor);
        hash.set(
          flavor,
          totalFlavorCount ? totalFlavorCount + count : count
        );
        return hash;
      }, Ember.Object.create({}));
    }
  ),

  hasValidRoleCountsPerFlavor: Ember.computed(
    'availableNodesPerFlavor',
    'configuredNodesPerFlavor',
    function() {
      const availableNodes = this.get('availableNodesPerFlavor');
      const configuredNodes = this.get('configuredNodesPerFlavor');
      const flavors = Object.keys(availableNodes);

      const hasValidRoleCounts = flavors.reduce((isValid, flavor) => {
        const configuredCount = configuredNodes.get(flavor);

        if(configuredCount == null) {
          return isValid && true;
        } else {
          return isValid && (availableNodes.get(flavor) >= configuredCount);
        }
      }, true);

      return hasValidRoleCounts;
    }
  ),

  settingsActiveClass: Ember.computed('selectedTab', function () {
    return this.get('selectedTab') == 'settings' ? 'active' : 'inactive';
  }),

  configActiveClass: Ember.computed('selectedTab', function () {
    return this.get('selectedTab') == 'config' ? 'active' : 'inactive';
  }),

  doAssignRole(role, profileName) {
    if (this.get('isStarted')) {
      return;
    }
    role.set('isDraggingObject', false);
    role.set('flavor', profileName);
    this.set(`openstackDeployment.${role.get('flavorDeploymentAttributeName')}`, profileName);
  },

  updateRoleCounts() {
    if (!this.get('plan')) {
      return;
    }

    this.get('roles').forEach(role => {
      this.set(`openstackDeployment.${role.get('countDeploymentAttributeName')}`, role.get('count'));
    });
  },

  openEditDialog() {
    this.set('openModalEditRole', true);
  },

  closeEditDialog() {
    this.set('openModalEditRole', false);
  },

  openGlobalServiceConfigDialog() {
    this.set('openModalEditGlobal', true);
  },

  closeGlobalServiceConfigDialog() {
    this.set('openModalEditGlobal', false);
  },

  resetEditedParameters(parameters) {
    parameters.forEach(p => p.set('newValue', p.get('value')));
  },

  updateEditedParameters(parameters) {
    parameters.forEach(p => p.set('value', p.get('newValue')));
  },

  actions: {
    editRole(role) {
      this.set('selectedTab', 'settings');

      this.set('editedRole', role);
      this.set('editedRoleImage', role.get('image'));
      this.set('editedRoleNodeCount', role.get('count'));
      this.set('editedRoleProfile', role.get('flavor'));
      this.set('editedRoleParameters', role.get('parameters'));

      this.resetEditedParameters(this.get('editedRoleParameters'));
      this.openEditDialog();
    },

    saveRole() {
      let role = this.get('editedRole');

      role.set('image', this.get('editedRoleImage'));
      role.set('count', parseInt(this.get('editedRoleNodeCount'), 10));

      this.doAssignRole(role, this.get('editedRoleProfile'));
      this.updateEditedParameters(this.get('editedRoleParameters'));
      this.closeEditDialog();
    },

    assignRole(role, profile) {
      this.doAssignRole(role, profile.get('name'));
    },

    unassignRole(role) {
      this.doAssignRole(role, 'baremetal');
    },

    doShowSettings() {
      this.set('selectedTab', 'settings');
    },

    doShowConfig() {
      this.set('selectedTab', 'config');
    },

    editGlobalServiceConfig() {
      this.resetEditedParameters(this.get('globalPlanParameters'));
      this.openGlobalServiceConfigDialog();
    },

    saveGlobalServiceConfig() {
      this.updateEditedParameters(this.get('globalPlanParameters'));
      this.closeGlobalServiceConfigDialog();
    },

    cancelGlobalServiceConfig() {
      this.resetEditedParameters(this.get('globalPlanParameters'));
      this.closeGlobalServiceConfigDialog();
    }
  }
});

export default AssignNodesController;
