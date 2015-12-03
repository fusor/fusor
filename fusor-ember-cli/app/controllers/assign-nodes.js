import Ember from 'ember';
import request from 'ic-ajax';
import DeploymentControllerMixin from "../mixins/deployment-controller-mixin";
import NeedsDeploymentMixin from "../mixins/needs-deployment-mixin";

export default Ember.Controller.extend(DeploymentControllerMixin, NeedsDeploymentMixin, {

  deploymentId: Ember.computed.alias("deploymentController.model.id"),
  isCloudForms: Ember.computed.alias("deploymentController.isCloudForms"),

  getParam(paramName, paramsOverride) {
    var params = paramsOverride || this.get('model.plan.parameters');
    return params ? params.findBy('id', paramName) : null;
  },

  getParamValue(paramName, paramsOverride) {
    var param = this.getParam(paramName, paramsOverride);
    return param ? param.get('value') : null;
  },

  updateParam(name, value) {
    var param = this.getParam(name);

    if (param) {
      param.set('value', value);
    }
  },

  images: Ember.computed('model.images.[]', function() {
    return this.get('model.images');
  }),

  flavorParams: Ember.computed('model.plan.parameters.[]', function () {
    return this.get('model.plan.parameters').filter(function (param) {
      return !!param.get('id').match(/.*::Flavor/);
    });
  }),

  unassignedRoles: Ember.computed('model.plan.roles.[]', 'flavorParams.@each.value', function () {
    var self = this, roles = this.get('model.plan.roles');

    if (!roles) {
      return [];
    }

    return roles.filter(function(role) { return !self.roleIsAssigned(role); });
  }),

  assignedRoles: Ember.computed('unassignedRoles.[]', function () {
    var self = this, roles = this.get('model.plan.roles');

    if (!roles) {
      return [];
    }

    return roles.filter(function(role) { return self.roleIsAssigned(role); });
  }),

  roleIsAssigned(role) {
    var value = this.getParamValue(role.get('flavorParameterName'), this.get('flavorParams'));
    return value && value !== 'bareMetal';
  },

  allRolesAssigned: Ember.computed('unassignedRoles.[]', function() {
    return (this.get('unassignedRoles.length') === 0);
  }),

  notAllRolesAssigned: Ember.computed.not('allRolesAssigned'),

  profiles: Ember.computed('model.profiles.[]', function() {
    return this.get('model.profiles');
  }),

  numProfiles: Ember.computed('model.profiles.[]', function() {
    return this.get('model.profiles.length');
  }),

  nodes: Ember.computed('model.nodes.[]', function() {
    return this.get('model.nodes');
  }),

  nodeCount: Ember.computed('model.nodes.[]', function() {
    return this.get('model.nodes.length');
  }),

  assignedNodeCount: Ember.computed('model.plan.roles.[]', 'model.plan.parameters.[]', function() {
    var count = 0;
    var params = this.get('model.plan.parameters');
    var self = this;
    this.get('model.plan.roles').forEach(function(role) {
      count += parseInt(self.getParamValue(role.get('countParameterName'), params), 10);
    });
    return count;
  }),

  isDraggingRole: Ember.computed(
    'model.plan.roles.[]',
    'model.plan.roles.@each.isDraggingObject',
    function() {
      var isDragging = false;
      this.get('model.plan.roles').forEach(function (role) {
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

    self.updateParam(data.role_name + "-1::Flavor", data.flavor_name);
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
        // TODO: Remove the reload call once we determine how to get around the failure
        //       that appears to be due to port forwarding. But make sure to leave the show spinner setting.
        self.set('showLoadingSpinner', true);
        self.get('model').plan.reload().then(function () {
          self.set('showLoadingSpinner', false);
        });
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
      this.get('model.plan.parameters').forEach(function(param) {
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
      this.set('edittedRoleImage', this.getParamValue(role.get('imageParameterName'), roleParams));
      this.set('edittedRoleNodeCount', this.getParamValue(role.get('countParameterName'), roleParams));
      this.set('edittedRoleProfile', this.getParamValue(role.get('flavorParameterName'), roleParams));
      this.set('edittedRoleParameters', advancedParams);

      this.openEditDialog();
    },

    saveRole() {
      var plan = this.get('model.plan');
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

      this.send('updatePlanParameters', params);
      this.closeEditDialog();
    },

    setRoleCount(role, count) {
      var self = this;
      var plan = this.get('model.plan');
      var data = { 'role_name': role.get('name'), 'count': count };
      var deploymentId = this.get('deploymentId');
      var token = Ember.$('meta[name="csrf-token"]').attr('content');
      self.get('deploymentController').set((role.get('roleType') + 'RoleCount'), count);

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
      var plan = this.get('model.plan');
      this.doAssignRole(plan, role, null);
    },

    unassignRole(role) {
      var plan = this.get('model.plan');
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
      this.get('model.plan.parameters').forEach(function(param) {
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

      this.send('updatePlanParameters', params);
      this.closeGlobalServiceConfigDialog();
    },

    cancelGlobalServiceConfig() {
      this.closeGlobalServiceConfigDialog();
    },

    setRoleCountOnController(roleType, count) {
      this.get('deploymentController').set((roleType + 'RoleCount'), count);
    }

  },

  disableAssignNodesNext: Ember.computed('unassignedRoles.[]',
                                         'deploymentController.computeRoleCount',
                                         'deploymentController.controllerRoleCount' , function() {
    var unassignedRoleTypes = this.get('unassignedRoles').getEach('roleType');
    return (unassignedRoleTypes.contains('controller') ||
            unassignedRoleTypes.contains('compute') ||
            (this.get('deploymentController.computeRoleCount') === 0) ||
            (this.get('deploymentController.controllerRoleCount') === 0)
           );
  })

});
