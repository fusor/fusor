import Ember from 'ember';
import request from 'ic-ajax';
import DeploymentControllerMixin from "../mixins/deployment-controller-mixin";
import NeedsDeploymentMixin from "../mixins/needs-deployment-mixin";

export default Ember.Controller.extend(DeploymentControllerMixin, NeedsDeploymentMixin, {

  deployment: Ember.computed.alias("deploymentController.model"),
  deploymentId: Ember.computed.alias("deployment.id"),
  isCloudForms: Ember.computed.alias("deploymentController.isCloudForms"),

  flavorParams: Ember.computed('plan.parameters.[]', function () {
    if (!this.get('plan.parameters')) {
      return [];
    }

    return this.get('plan.parameters').filter(function (param) {
      return !!param.get('id').match(/.*::Flavor/);
    });
  }),

  unassignedRoles: Ember.computed('plan.roles.[]', 'flavorParams.@each.value', function () {
    var self = this, roles = this.get('plan.roles');

    if (!roles) {
      return [];
    }

    return roles.filter(function(role) { return !self.roleIsAssigned(role); });
  }),

  assignedRoles: Ember.computed('unassignedRoles.[]', function () {
    var self = this, roles = this.get('plan.roles');

    if (!roles) {
      return [];
    }

    return roles.filter(function(role) { return self.roleIsAssigned(role); });
  }),

  roleIsAssigned(role) {
    var value = this.get('plan').getParamValue(role.get('flavorParameterName'), this.get('flavorParams'));
    return value && value !== 'baremetal';
  },

  allRolesAssigned: Ember.computed('unassignedRoles.[]', function() {
    return (this.get('unassignedRoles.length') === 0);
  }),

  notAllRolesAssigned: Ember.computed.not('allRolesAssigned'),

  numProfiles: Ember.computed('profiles.[]', function() {
    return this.get('profiles.length');
  }),

  nodeCount: Ember.computed('nodes.[]', function() {
    return this.get('nodes.length');
  }),

  assignedNodeCount: Ember.computed('plan.roles.[]', 'plan.parameters.[]', function() {
    var count = 0;
    var params = this.get('plan.parameters');
    var self = this;
    if (!this.get('plan.roles')) {
      return 0;
    }
    this.get('plan.roles').forEach(function(role) {
      count += parseInt(self.getParamValue(role.get('countParameterName'), params), 10);
    });
    return count;
  }),

  isDraggingRole: Ember.computed(
    'plan.roles.[]',
    'plan.roles.@each.isDraggingObject',
    function() {
      var isDragging = false;

      if (!this.get('plan.roles')) {
        return false;
      }

      this.get('plan.roles').forEach(function (role) {
        if (role.get('isDraggingObject') === true) {
          isDragging = true;
        }
      });

      return isDragging;
    }
  ),

  droppableClass: Ember.computed('isDraggingRole', function() {
    if (this.get('isDraggingRole')) {
      return 'deployment-roles-active';
    }
    else {
      return '';
    }
  }),

  doAssignRole(plan, role, profile) {
    var data;
    var self = this;
    var unassignedRoles;
    var token = Ember.$('meta[name="csrf-token"]').attr('content');

    if (!profile) {
      unassignedRoles = this.get('unassignedRoles');
      if (unassignedRoles.contains(role)) {
        // Role is already unassigned, do nothing
        return;
      }
      data = { 'role_name': role.get('name'), 'flavor_name': 'baremetal' };
    } else {
      data = { 'role_name': role.get('name'), 'flavor_name': profile.get('name') };
    }

    var updateUrl =
      '/fusor/api/openstack/deployments/' +
      this.get('deploymentId') +
      '/deployment_plans/overcloud/update_role_flavor';

    plan.updateParam(role.get('flavorParameterName'), data.flavor_name);
    this.set(`deployment.${role.get('flavorDeploymentAttributeName')}`, data.flavor_name);
    request({
      url: updateUrl,
      type: 'PUT',
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "X-CSRF-Token": token
      },
      data: JSON.stringify(data)
    }).catch(function (error) {
      console.log('ERROR');
      console.log(error.jqXHR);
      return self.send('error', error.jqXHR);
    });
  },

  editedRole: null,
  editedRoleImage: null,
  editedRoleNodeCount: null,
  editedRoleProfile: null,
  editedRoleParameters: null,
  showSettings: true,

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

  settingsTabActiveClass: Ember.computed('showSettings', function() {
    if (this.get('showSettings')) {
      return "active";
    }
    else {
      return "inactive";
    }
  }),

  configTabActiveClass: Ember.computed('showSettings', function() {
    if (this.get('showSettings')) {
      return "inactive";
    }
    else {
      return "active";
    }
  }),

  handleOutsideClick(e) {
    // do nothing, this overrides the closing of the dialog when clicked outside of it
  },

  actions: {
    editRole(role) {
      this.set('showRoleSettings', 'active');
      this.set('showRoleConfig',   'inactive');
      var roleParams = Ember.A();
      this.get('plan.parameters').forEach(function(param) {
        var paramId = param.get('id');
        if (paramId.indexOf(role.get('parameterPrefix')) === 0) {
          param.displayId = paramId.substring(role.get('parameterPrefix').length);
          param.displayId = param.displayId.replace(/([a-z])([A-Z])/g, '$1 $2');

          /* Using boolean breaks saving...
             if (param.get('parameter_type') === 'boolean') {
             param.set('isBoolean', true);
             }
             */
          if (param.get('hidden')) {
            param.set('inputType', 'password');
          }
          else {
            param.set('inputType', param.get('parameter_type'));
          }

          let shouldAddParam =
            (paramId === role.get('imageParameterName')) ||
            (paramId === role.get('countParameterName')) ||
            (paramId === role.get('flavorParameterName'));

          if (shouldAddParam) {
            roleParams.addObject(param);
          } else if (param.get('parameter_type') !== 'json') {
            advancedParams.addObject(param);
          }
        }
      });

      this.set('editedRole', role);
      this.set('editedRoleImage', this.get('plan').getParamValue(role.get('imageParameterName'), roleParams));
      this.set('editedRoleNodeCount', this.get('plan').getParamValue(role.get('countParameterName'), roleParams));
      this.set('editedRoleProfile', this.get('plan').getParamValue(role.get('flavorParameterName'), roleParams));
      this.set('editedRoleParameters', advancedParams);

      this.openEditDialog();
    },

    saveRole() {
      var plan = this.get('plan');
      var role = this.get('editedRole');
      var deploymentId = this.get('deploymentId');

      var params = [
        {'name': role.get('imageParameterName'), 'value': this.get('editedRoleImage')},
        {'name': role.get('countParameterName'), 'value': this.get('editedRoleNodeCount')},
        {'name': role.get('flavorParameterName'), 'value': this.get('editedRoleProfile')}
      ];

      this.get('editedRoleParameters').forEach(function(param) {
        params.push({'name': param.get('id'), 'value': param.get('value')});
      });
      var token = Ember.$('meta[name="csrf-token"]').attr('content');

      this.send('updateOpenStackPlan', params);
      this.closeEditDialog();
    },

    setRoleCount(role, count) {
      var plan = this.get('plan');
      var data = { 'role_name': role.get('name'), 'count': count };
      var deploymentId = this.get('deploymentId');
      var token = Ember.$('meta[name="csrf-token"]').attr('content');
      plan.updateParam(role.get('countParameterName'), count);
      this.set(`deployment.${role.get('countDeploymentAttributeName')}`, count);

      request({
        url: '/fusor/api/openstack/deployments/' + deploymentId + '/deployment_plans/overcloud/update_role_count',
        type: 'PUT',
        data: JSON.stringify(data),
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "X-CSRF-Token": token
        }
      }).catch(function (error) {
        console.log('ERROR');
        console.log(error);
      });
    },

    cancelEditRole() {
      this.closeEditDialog();
    },

    assignRoleType(profile, roleType) {
      var role = this.getRoleByType(roleType);
      this.doAssignRole(profile, role);
    },

    assignRole(plan, role, profile) {
      this.doAssignRole(plan, role, profile);
    },

    removeRole(profile, role) {
      var plan = this.get('plan');
      this.doAssignRole(plan, role, null);
    },

    unassignRole(role) {
      var plan = this.get('plan');
      this.doAssignRole(plan, role, null);
    },

    showRoleSettings: 'active',
    showRoleConfig:   'inactive',

    doShowSettings() {
      this.set('showRoleSettings', 'active');
      this.set('showRoleConfig',   'inactive');
    },

    doShowConfig() {
      this.set('showRoleSettings', 'inactive');
      this.set('showRoleConfig',   'active');
    },

    editGlobalServiceConfig() {
      var planParams = Ember.A();
      this.get('plan.parameters').forEach(function(param) {
        if (param.get('id').indexOf('::') === -1) {
          param.displayId = param.get('id').replace(/([a-z])([A-Z])/g, '$1 $2');
          /* Using boolean breaks saving...
             if (param.get('parameter_type') === 'boolean') {
             param.set('isBoolean', true);
             }
             */
          if (param.get('hidden')) {
            param.set('inputType', 'password');
          }
          else {
            param.set('inputType', param.get('parameter_type'));
          }
          if (param.get('parameter_type') !== 'json') {
            planParams.addObject(param);
          }
        }
      });
      this.set('editedPlanParameters', planParams);

      this.openGlobalServiceConfigDialog();
    },

    saveGlobalServiceConfig() {
      var params = Ember.A();
      this.get('editedPlanParameters').forEach(function(param) {
        params.push({'name': param.get('id'), 'value': param.get('value')});
      });
      var token = Ember.$('meta[name="csrf-token"]').attr('content');

      this.send('updateOpenStackPlan', params);
      this.closeGlobalServiceConfigDialog();
    },

    cancelGlobalServiceConfig() {
      this.closeGlobalServiceConfigDialog();
    }
  },

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

    disableAssignNodesNext: Ember.computed.not('hasValidNodeAssignments')
  });
