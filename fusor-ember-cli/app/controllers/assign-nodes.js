import Ember from 'ember';
import request from 'ic-ajax';
import DeploymentControllerMixin from "../mixins/deployment-controller-mixin";
import NeedsDeploymentMixin from "../mixins/needs-deployment-mixin";

export default Ember.Controller.extend(DeploymentControllerMixin, NeedsDeploymentMixin, {

  deploymentId: Ember.computed.alias("deploymentController.model.id"),
  openStack: Ember.computed.alias("deploymentController.openStack"),
  isCloudForms: Ember.computed.alias("deploymentController.isCloudForms"),

  images: Ember.computed('openStack.images.[]', function() {
    return this.get('openStack.images');
  }),

  flavorParams: Ember.computed('openStack.plan.parameters.[]', function () {
    if (!this.get('openStack.plan.parameters')) {
      return [];
    }

    return this.get('openStack.plan.parameters').filter(function (param) {
      return !!param.get('id').match(/.*::Flavor/);
    });
  }),

  unassignedRoles: Ember.computed('openStack.plan.roles.[]', 'flavorParams.@each.value', function () {
    var self = this, roles = this.get('openStack.plan.roles');

    if (!roles) {
      return [];
    }

    return roles.filter(function(role) { return !self.roleIsAssigned(role); });
  }),

  assignedRoles: Ember.computed('unassignedRoles.[]', function () {
    var self = this, roles = this.get('openStack.plan.roles');

    if (!roles) {
      return [];
    }

    return roles.filter(function(role) { return self.roleIsAssigned(role); });
  }),

  roleIsAssigned(role) {
    var value = this.get('openStack.plan').getParamValue(role.get('flavorParameterName'), this.get('flavorParams'));
    return value && value !== 'baremetal';
  },

  allRolesAssigned: Ember.computed('unassignedRoles.[]', function() {
    return (this.get('unassignedRoles.length') === 0);
  }),

  notAllRolesAssigned: Ember.computed.not('allRolesAssigned'),

  profiles: Ember.computed('openStack.profiles.[]', function() {
    return this.get('openStack.profiles');
  }),

  numProfiles: Ember.computed('openStack.profiles.[]', function() {
    return this.get('openStack.profiles.length');
  }),

  nodes: Ember.computed('openStack.nodes.[]', function() {
    return this.get('openStack.nodes');
  }),

  nodeCount: Ember.computed('openStack.nodes.[]', function() {
    return this.get('openStack.nodes.length');
  }),

  assignedNodeCount: Ember.computed('openStack.plan.roles.[]', 'openStack.plan.parameters.[]', function() {
    var count = 0;
    var params = this.get('openStack.plan.parameters');
    var self = this;
    if (!this.get('openStack.plan.roles')) {
      return 0;
    }
    this.get('openStack.plan.roles').forEach(function(role) {
      count += parseInt(self.getParamValue(role.get('countParameterName'), params), 10);
    });
    return count;
  }),

  isDraggingRole: Ember.computed(
    'openStack.plan.roles.[]',
    'openStack.plan.roles.@each.isDraggingObject',
    function() {
      var isDragging = false;

      if (!this.get('openStack.plan.roles')) {
        return false;
      }

      this.get('openStack.plan.roles').forEach(function (role) {
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

  showLoadingSpinner: false,
  loadingSpinnerText: "Loading...",

  doAssignRole(plan, role, profile) {
    var data, self = this, unassignedRoles,
      token = Ember.$('meta[name="csrf-token"]').attr('content');

    if (profile == null) {
      unassignedRoles = this.get('unassignedRoles');
      if (unassignedRoles.contains(role)) {
        // Role is already unassigned, do nothing
        return;
      }
      data = { 'role_name': role.get('name'), 'flavor_name': null };
    } else {
      data = { 'role_name': role.get('name'), 'flavor_name': profile.get('name') };
    }

    plan.updateParam(data.role_name + "-1::Flavor", data.flavor_name);
    request({
      url: '/fusor/api/openstack/deployments/' + this.get('deploymentId') + '/deployment_plans/overcloud/update_role_flavor',
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
      }
    );
  },

  edittedRole: null,
  edittedRoleImage: null,
  edittedRoleNodeCount: null,
  edittedRoleProfile: null,
  edittedRoleParameters: null,
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
      var advancedParams = Ember.A();
      this.get('openStack.plan.parameters').forEach(function(param) {
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

          if ((paramId === role.get('imageParameterName')) ||
              (paramId === role.get('countParameterName')) ||
              (paramId === role.get('flavorParameterName'))) {
            roleParams.addObject(param);
          }
          else if (param.get('parameter_type') !== 'json') {
            advancedParams.addObject(param);
          }
        }
      });

      this.set('edittedRole', role);
      this.set('edittedRoleImage', this.get('openStack.plan').getParamValue(role.get('imageParameterName'), roleParams));
      this.set('edittedRoleNodeCount', this.get('openStack.plan').getParamValue(role.get('countParameterName'), roleParams));
      this.set('edittedRoleProfile', this.get('openStack.plan').getParamValue(role.get('flavorParameterName'), roleParams));
      this.set('edittedRoleParameters', advancedParams);

      this.openEditDialog();
    },

    saveRole() {
      var plan = this.get('openStack.plan');
      var role = this.get('edittedRole');
      var deploymentId = this.get('deploymentId');

      var params = [
        {'name': role.get('imageParameterName'), 'value': this.get('edittedRoleImage')},
        {'name': role.get('countParameterName'), 'value': this.get('edittedRoleNodeCount')},
        {'name': role.get('flavorParameterName'), 'value': this.get('edittedRoleProfile')}
      ];

      this.get('edittedRoleParameters').forEach(function(param) {
        params.push({'name': param.get('id'), 'value': param.get('value')});
      });
      var token = Ember.$('meta[name="csrf-token"]').attr('content');

      this.send('updateOpenStackPlan', params);
      this.closeEditDialog();
    },

    setRoleCount(role, count) {
      var self = this;
      var plan = this.get('openStack.plan');
      var data = { 'role_name': role.get('name'), 'count': count };
      var deploymentId = this.get('deploymentId');
      var token = Ember.$('meta[name="csrf-token"]').attr('content');
      plan.updateParam(role.get('countParameterName'), count);

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
        error = error.jqXHR;
        console.log('ERROR');
        console.log(error);
        self.set('showLoadingSpinner', false);
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
      var plan = this.get('openStack.plan');
      this.doAssignRole(plan, role, null);
    },

    unassignRole(role) {
      var plan = this.get('openStack.plan');
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
      this.get('openStack.plan.parameters').forEach(function(param) {
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
      this.set('edittedPlanParameters', planParams);

      this.openGlobalServiceConfigDialog();
    },

    saveGlobalServiceConfig() {
      var params = Ember.A();
      this.get('edittedPlanParameters').forEach(function(param) {
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

  disableAssignNodesNext: Ember.computed(
    'unassignedRoles.[]',
    'openStack.plan.computeRoleCount',
    'openStack.plan.controllerRoleCount',
    function () {
      var unassignedRoleTypes = this.get('unassignedRoles').getEach('roleType'),
        computeRoleCount = this.get('openStack.plan.computeRoleCount'),
        controllerRoleCount = this.get('openStack.plan.controllerRoleCount');

      return unassignedRoleTypes.contains('controller') ||
        unassignedRoleTypes.contains('compute') ||
        !computeRoleCount || computeRoleCount === '0' ||
        !controllerRoleCount || controllerRoleCount === '0';
    })
});
