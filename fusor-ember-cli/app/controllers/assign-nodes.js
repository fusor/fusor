import Ember from 'ember';
import DeploymentControllerMixin from "../mixins/deployment-controller-mixin";
import NeedsDeploymentMixin from "../mixins/needs-deployment-mixin";

const Role = Ember.Object.extend({
  isAssigned() {
    return Ember.isPresent(this.get('flavor')) && this.get('flavor') !== 'baremetal';
  }
});

export default Ember.Controller.extend(DeploymentControllerMixin, NeedsDeploymentMixin, {

  deployment: Ember.computed.alias("deploymentController.model"),
  deploymentId: Ember.computed.alias("deployment.id"),
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
      flavorDeploymentAttributeName: 'openstack_overcloud_compute_flavor',
      countDeploymentAttributeName: 'openstack_overcloud_compute_count',
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
      flavorDeploymentAttributeName: 'openstack_overcloud_controller_flavor',
      countDeploymentAttributeName: 'openstack_overcloud_controller_count',
      roleType: 'controller',
      parameters: [],
      advancedParameters: []
    }),
    Role.create({
      name: 'CephStorage',
      label: 'Ceph Storage',
      parameterPrefixes: ['Ceph', 'OvercloudCeph'],
      countParameterName: 'CephStorageCount',
      flavorParameterName: 'OvercloudCephStorageFlavor',
      imageParameterName: 'CephStorageImage',
      flavorDeploymentAttributeName: 'openstack_overcloud_ceph_storage_flavor',
      countDeploymentAttributeName: 'openstack_overcloud_ceph_storage_count',
      roleType: 'ceph',
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
      flavorDeploymentAttributeName: 'openstack_overcloud_cinder_storage_flavor',
      countDeploymentAttributeName: 'openstack_overcloud_cinder_storage_count',
      roleType: 'cinder',
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
      flavorDeploymentAttributeName: 'openstack_overcloud_swift_storage_flavor',
      countDeploymentAttributeName: 'openstack_overcloud_swift_storage_count',
      roleType: 'swift',
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

  hasValidNodeAssignments: Ember.computed(
    'deployment.openstack_overcloud_compute_flavor',
    'deployment.openstack_overcloud_compute_count',
    'deployment.openstack_overcloud_controller_flavor',
    'deployment.openstack_overcloud_controller_count',
    function () {
      let computeFlavor = this.get('deployment.openstack_overcloud_compute_flavor');
      let computeCount = this.get('deployment.openstack_overcloud_compute_count');
      let controllerFlavor = this.get('deployment.openstack_overcloud_controller_flavor');
      let controllerCount = this.get('deployment.openstack_overcloud_controller_count');

      return computeFlavor && computeFlavor !== 'baremetal' && computeCount > 0 &&
        controllerFlavor && controllerFlavor !== 'baremetal' && controllerCount > 0;
    }),

  disableAssignNodesNext: Ember.computed.not('hasValidNodeAssignments'),

  settingsActiveClass: Ember.computed('selectedTab', function () {
    return this.get('selectedTab') == 'settings' ? 'active' : 'inactive';
  }),

  configActiveClass: Ember.computed('selectedTab', function () {
    return this.get('selectedTab') == 'config' ? 'active' : 'inactive';
  }),

  doAssignRole(role, profileName) {
    role.set('isDraggingObject', false);
    role.set('flavor', profileName);
    this.set(`deployment.${role.get('flavorDeploymentAttributeName')}`, profileName);
    this.get('plan').setParamValue(role.get('flavorParameterName'), profileName);
  },

  updateRoleCounts() {
    if (!this.get('plan')) {
      return;
    }

    this.get('roles').forEach(role => {
      this.set(`deployment.${role.get('countDeploymentAttributeName')}`, role.get('count'));
      this.get('plan').setParamValue(role.get('countParameterName'), role.get('count'));
    });
  },

  openEditDialog() {
    this.set('editRoleModalOpened', true);
    this.set('editRoleModalClosed', false);
  },

  closeEditDialog() {
    this.set('editRoleModalOpened', false);
    this.set('editRoleModalClosed', true);
  },

  openGlobalServiceConfigDialog() {
    this.set('editGlobalServiceConfigModalOpened', true);
    this.set('editGlobalServiceConfigModalClosed', false);
  },

  closeGlobalServiceConfigDialog() {
    this.set('editGlobalServiceConfigModalOpened', false);
    this.set('editGlobalServiceConfigModalClosed', true);
  },

  resetEditedParameters(parameters) {
    parameters.forEach(p => p.set('newValue', p.get('value')));
  },

  updateEditedParameters(parameters) {
    parameters.forEach(p => p.set('value', p.get('newValue')));
  },

  handleOutsideClick(e) {
    // do nothing, this overrides the closing of the dialog when clicked outside of it
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

    cancelEditRole() {
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
