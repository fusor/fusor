import Ember from 'ember';
import DeploymentControllerMixin from "../mixins/deployment-controller-mixin";

export default Ember.Controller.extend(DeploymentControllerMixin, {

  needs: ['deployment', 'register-nodes'],

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
  }.property('model.images'),

  unassignedRoles: function() {
    var unassignedRoles = [];
    var params = this.get('model.plan.parameters');
    var self = this;
    this.get('model.plan.roles').forEach(function(role, index) {
      if ( self.getParamValue(role.get('flavorParameterName'), params) == null ) {
        unassignedRoles.pushObject(role);
      }
    });
    return unassignedRoles;
  }.property('model.plan.roles', 'model.plan.parameters'),

  allRolesAssigned: function() {
    return (this.get('unassignedRoles').length === 0);
  }.property('unassignedRoles'),

  noRolesAssigned: function() {
    return (this.get('unassignedRoles').length === this.get('model.plan.roles').length);
  }.property('unassignedRoles'),

  profiles: function() {
    return this.get('model.profiles');
  }.property('model.profiles', 'model.profiles.length'),

  numProfiles: function() {
    var profiles = this.get('model.profiles');
    return profiles.length;
  }.property('model.profiles', 'model.profiles.length'),

  nodes: function() {
    return this.get('model.nodes');
  }.property('model.nodes'),

  nodeCount: function() {
    return this.get('model.nodes').length;
  }.property('model.nodes'),

  assignedNodeCount: function() {
    var count = 0;
    var params = this.get('model.plan.parameters');
    var self = this;
    this.get('model.plan.roles').forEach(function(role, index) {
      count += self.getParamValue(role.get('countParameterName'), params);
    });
    return count;
  }.property('model.plan.roles', 'model.plan.parameters'),

  isDraggingRole: function() {
    var isDragging = false;
    this.get('model.plan.roles').forEach(function (role, index) {
          if (role.get('isDraggingObject') === true) {
            isDragging = true;
          }
    });
    return isDragging;
  }.property('model.plan.roles', 'model.plan.roles.@each.isDraggingObject'),

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
    var me = this;

    if (profile == null ) {
      data = { 'role_name': role.get('name'), 'flavor_name': null };
    } else {
      data = { 'role_name': role.get('name'), 'flavor_name': profile.get('name') };
    }

    me.set('loadingSpinnerText', "Loading...");
    me.set('showLoadingSpinner', true);

    Ember.$.ajax({
      url: '/fusor/api/openstack/deployment_plans/' + plan.get('id') + '/update_role_flavor',
      type: 'PUT',
      contentType: 'application/json',
      data: JSON.stringify(data),
      success: function(response) {
        me.set('showLoadingSpinner', false);
        console.log('SUCCESS');
      },
      error: function(error) {
        me.set('showLoadingSpinner', false);
        console.log('ERROR');
        console.log(error);
      }
    });
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

  actions: {
    editRole: function(role) {
      var roleParams = [];
      this.get('model.plan.parameters').forEach(function(param) {
        if (param.get('id').indexOf(role.get('parameterPrefix')) === 0) {
          roleParams.pushObject(param);
        }
      });
      this.set('edittedRole', role);
      this.set('edittedRoleImage', this.getParamValue(role.get('imageParameterName'), roleParams));
      this.set('edittedRoleNodeCount', this.getParamValue(role.get('countParameterName'), roleParams));
      this.set('edittedRoleProfile', this.getParamValue(role.get('flavorParameterName'), roleParams));
      this.set('edittedRoleParameters', roleParams);
      this.openEditDialog();
    },

    saveRole: function() {
      var plan = this.get('model.plan');
      var role = this.get('edittedRole');

      var params = [
        {'name': role.get('imageParameterName'), 'value': this.get('edittedRoleImage')},
        {'name': role.get('countParameterName'), 'value': this.get('edittedRoleNodeCount')},
        {'name': role.get('flavorParameterName'), 'value': this.get('edittedRoleProfile')}
      ];

      Ember.$.ajax({
        url: '/fusor/api/openstack/deployment_plans/' + plan.get('id') + '/update_parameters',
        type: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify({ 'parameters': params }),
        success: function(response) {
          console.log('SUCCESS');
        },
        error: function(error) {
          console.log('ERROR');
          console.log(error);
        }
      });

      this.closeEditDialog();
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

    doShowSettings: function() {
      this.set('showSettings', true);
    },

    doShowConfig: function() {
      this.set('showSettings', false);
    },

    deployPlan: function() {
      var plan = this.get('model.plan');
      var me = this;

      me.set('loadingSpinnerText', "Deploying plan: " + plan.get('id'));
      me.set('showLoadingSpinner', true);

      Ember.$.ajax({
        url: '/fusor/api/openstack/deployment_plans/' + plan.get('id') + '/deploy',
        type: 'POST',
        contentType: 'application/json',
        success: function(response) {
          me.set('showLoadingSpinner', false);
          console.log('SUCCESS');
        },
        error: function(error) {
          me.set('showLoadingSpinner', false);
          console.log('ERROR');
          console.log(error);
        }
      });
    },
  },

  disableAssignNodesNext: function() {
    return false;
  }.property('profiles'),

  nextStepRouteName: function() {
    return ('');
  }.property('step2RouteName', 'step3RouteName')
});
