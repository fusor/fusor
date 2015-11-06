import Ember from 'ember';
import request from 'ic-ajax';
import DeploymentControllerMixin from "../mixins/deployment-controller-mixin";
import NeedsDeploymentMixin from "../mixins/needs-deployment-mixin";

export default Ember.Controller.extend(DeploymentControllerMixin, NeedsDeploymentMixin, {

  needs: ['register-nodes'],

  deploymentId: Ember.computed.alias("controllers.deployment.model.id"),
  isCloudForms: Ember.computed.alias("controllers.deployment.isCloudForms"),

  getParamValue: function(paramName, params) {
    var paramValue = null;
    var numParams = params.get('length');
    for (var i=0; i<numParams; i++) {
      var param = params.objectAt(i);
      if (param.get('id') === paramName) {
        paramValue = param.get('value');
        break;
      }
    }
    return paramValue;
  },

  images: function() {
    return this.get('model.images');
  }.property('model.images.[]'),

  unassignedRoles: function() {
    var unassignedRoles = Ember.A();
    var params = this.get('model.plan.parameters');
    var self = this;
    var value = null;
    this.get('model.plan.roles').forEach(function(role) {
      value = self.getParamValue(role.get('flavorParameterName'), params);
      if (value === 'baremetal' || Ember.isNone(value)) {
        unassignedRoles.addObject(role);
      }
    });
    return unassignedRoles;
  }.property('model.plan.roles.[]', 'model.plan.parameters.[]'),

  allRolesAssigned: function() {
    return (this.get('unassignedRoles.length') === 0);
  }.property('unassignedRoles.[]'),

  noRolesAssigned: function() {
    return (this.get('unassignedRoles.length') === this.get('model.plan.roles.length'));
  }.property('unassignedRoles.[]', 'model.plan.roles.[]'),

  profiles: function() {
    return this.get('model.profiles');
  }.property('model.profiles.[]'),

  numProfiles: function() {
    return this.get('model.profiles.length');
  }.property('model.profiles.[]'),

  nodes: function() {
    return this.get('model.nodes');
  }.property('model.nodes.[]'),

  nodeCount: function() {
    return this.get('model.nodes.length');
  }.property('model.nodes.[]'),

  assignedNodeCount: function() {
    var count = 0;
    var params = this.get('model.plan.parameters');
    var self = this;
    this.get('model.plan.roles').forEach(function(role) {
      count += parseInt(self.getParamValue(role.get('countParameterName'), params), 10);
    });
    return count;
  }.property('model.plan.roles.[]', 'model.plan.parameters.[]'),

  isDraggingRole: function() {
    var isDragging = false;
    this.get('model.plan.roles').forEach(function (role) {
          if (role.get('isDraggingObject') === true) {
            isDragging = true;
          }
    });
    return isDragging;
  }.property('model.plan.roles.[]', 'model.plan.roles.@each.isDraggingObject'),

  droppableClass: function() {
    if (this.get('isDraggingRole')) {
      return 'deployment-roles-active';
    }
    else {
      return '';
    }
  }.property('isDraggingRole'),

  showLoadingSpinner: false,
  loadingSpinnerText: "Loading...",

  doAssignRole: function(plan, role, profile) {
    var data;
    var self = this;

    if (profile == null ) {
      var unassignedRoles = this.get('unassignedRoles');
      if (unassignedRoles.contains(role)) {
        // Role is already unassigned, do nothing
        return;
      }
      data = { 'role_name': role.get('name'), 'flavor_name': null };
    } else {
      data = { 'role_name': role.get('name'), 'flavor_name': profile.get('name') };
    }

    self.set('loadingSpinnerText', "Loading...");
    self.set('showLoadingSpinner', true);
    var token = Ember.$('meta[name="csrf-token"]').attr('content');
    //ic-ajax request
    console.log('PUT /fusor/api/openstack/deployments/' + this.get('deploymentId') + '/deployment_plans/overcloud/update_role_flavor');
    request({
        url: '/fusor/api/openstack/deployments/' + this.get('deploymentId') + '/deployment_plans/overcloud/update_role_flavor',
        type: 'PUT',
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "X-CSRF-Token": token,
        },
        data: JSON.stringify(data)
      }).then(function(result) {
        self.set('showLoadingSpinner', false);
        console.log('SUCCESS');
        self.store.push('deployment_plan', self.store.normalize('deployment_plan', result.deployment_plan));
      }, function(error) {
        error = error.jqXHR;
        console.log('ERROR');
        console.log(error);
        // TODO: Remove the reload call once we determine how to get around the failure
        //       that appears to be due to port forwarding. But make sure to leave the show spinner setting.
        self.get('model').plan.reload().then(function() {
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

  openEditDialog: function() {
    this.set('editRoleModalOpened', true);
    this.set('editRoleModalClosed', false);
  },

  closeEditDialog: function() {
    this.set('editRoleModalOpened', false);
    this.set('editRoleModalClosed', true);
  },

  openGlobalServiceConfigDialog: function() {
    this.set('editGlobalServiceConfigModalOpened', true);
    this.set('editGlobalServiceConfigModalClosed', false);
  },

  closeGlobalServiceConfigDialog: function() {
    this.set('editGlobalServiceConfigModalOpened', false);
    this.set('editGlobalServiceConfigModalClosed', true);
  },

  settingsTabActiveClass: function() {
    if (this.get('showSettings')) {
      return "active";
    }
    else {
      return "inactive";
    }
  }.property('showSettings'),

  configTabActiveClass: function() {
    if (this.get('showSettings')) {
      return "inactive";
    }
    else {
      return "active";
    }
  }.property('showSettings'),

  handleOutsideClick: function(e) {
    // do nothing, this overrides the closing of the dialog when clicked outside of it
  },

  actions: {
    editRole: function(role) {
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

    saveRole: function() {
      var self = this;
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

      self.set('loadingSpinnerText', "Saving...");
      self.set('showLoadingSpinner', true);
      console.log('action: saveRole, PUT /fusor/api/openstack/deployments/' + deploymentId + '/deployment_plans/overcloud/update_parameters');
      //ic-ajax request
      request({
        url: '/fusor/api/openstack/deployments/' + deploymentId + '/deployment_plans/overcloud/update_parameters',
        type: 'PUT',
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "X-CSRF-Token": token,
        },
        data: JSON.stringify({ 'parameters': params })
      }).then( function() {
          console.log('SUCCESS');
          self.store.find('deployment-plan', deploymentId).then(function (result) {
            self.set('model.plan', result);
            self.set('showLoadingSpinner', false);
          });
        }, function(error) {
          error = error.jqXHR;
          console.log('ERROR');
          console.log(error);
          self.set('showLoadingSpinner', false);
        }
      );
      this.closeEditDialog();
    },

    setRoleCount: function(role, count) {
      var self = this;
      var plan = this.get('model.plan');
      var data = { 'role_name': role.get('name'), 'count': count };
      var deploymentId = this.get('deploymentId');
      var token = Ember.$('meta[name="csrf-token"]').attr('content');

      self.set('loadingSpinnerText', "Saving...");
      self.set('showLoadingSpinner', true);
      //ic-ajax request
      console.log('PUT /fusor/api/openstack/deployments/' + this.get('deploymentId') + '/deployment_plans/overcloud/update_role_count');
      request({
          url: '/fusor/api/openstack/deployments/' + deploymentId + '/deployment_plans/overcloud/update_role_count',
          type: 'PUT',
          data: JSON.stringify(data),
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "X-CSRF-Token": token,
          }
        }).then(function(result) {
          console.log('SUCCESS');
          self.store.find('deployment-plan', deploymentId).then(function (result) {
            self.set('model.plan', result);
            self.set('showLoadingSpinner', false);
          });
        }, function(error) {
             error = error.jqXHR;
             console.log('ERROR');
             console.log(error);
             self.set('showLoadingSpinner', false);
           }
        );
    },

    cancelEditRole: function() {
      this.closeEditDialog();
    },

    assignRoleType: function(profile, roleType) {
      var role = this.getRoleByType(roleType);
      this.doAssignRole(profile, role);
    },

    assignRole: function(plan, role, profile) {
      this.doAssignRole(plan, role, profile);
    },

    removeRole: function(profile, role) {
      var plan = this.get('model.plan');
      this.doAssignRole(plan, role, null);
    },

    unassignRole: function(role) {
      var plan = this.get('model.plan');
      this.doAssignRole(plan, role, null);
    },

    showRoleSettings: 'active',
    showRoleConfig:   'inactive',

    doShowSettings: function() {
      this.set('showRoleSettings', 'active');
      this.set('showRoleConfig',   'inactive');
    },

    doShowConfig: function() {
      this.set('showRoleSettings', 'inactive');
      this.set('showRoleConfig',   'active');
    },

    editGlobalServiceConfig: function() {
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

    saveGlobalServiceConfig: function() {
      var self = this;
      var plan = this.get('model.plan');

      var params = Ember.A();
      this.get('edittedPlanParameters').forEach(function(param) {
        params.push({'name': param.get('id'), 'value': param.get('value')});
      });
      var token = Ember.$('meta[name="csrf-token"]').attr('content');

      self.set('loadingSpinnerText', "Saving...");
      self.set('showLoadingSpinner', true);

      //ic-ajax request
      console.log('action: saveGlobalServiceConfig, PUT /fusor/api/openstack/deployments/' + this.get('deploymentId') + '/deployment_plans/overcloud/update_parameters');
      request({
        url: '/fusor/api/openstack/deployments/' + this.get('deploymentId') + '/deployment_plans/overcloud/update_parameters',
        type: 'PUT',
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "X-CSRF-Token": token,
        },
        data: JSON.stringify({ 'parameters': params })
      }).then( function() {
          console.log('SUCCESS');
          self.set('showLoadingSpinner', false);
        },
          function(error) {
            error = error.jqXHR;
            console.log('ERROR');
            console.log(error);
            self.set('showLoadingSpinner', false);
        }
      );

      this.closeGlobalServiceConfigDialog();

    },

    cancelGlobalServiceConfig: function() {
      this.closeGlobalServiceConfigDialog();
    }
  },

  disableAssignNodesNext: function() {
    return (this.get('unassignedRoles.length') > 0);
  }.property('unassignedRoles.[]'),

  nextStepRouteNameAssignNodes: function() {
    if (this.get('isCloudForms')) {
      return 'cloudforms';
    } else {
      return 'subscriptions';
    }
  }.property('isCloudForms')
});
