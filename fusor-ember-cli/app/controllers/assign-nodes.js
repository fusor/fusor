import Ember from 'ember';
import DeploymentControllerMixin from "../mixins/deployment-controller-mixin";

export default Ember.Controller.extend(DeploymentControllerMixin, {

  needs: ['deployment', 'register-nodes'],
  register: Ember.computed.alias("controllers.register-nodes"),

  getParamValue: function(paramName, params) {
    var paramValue = null;
    var numParams = params.get('length');
    for (var i=0; i<numParams; i++) {
      var param = params.objectAt(i);
      if (param.get('id') == paramName) {
        paramValue = param.get('value');
        break;
      }
    }
    return paramValue;
  },

  unassignedRoles: function() {
    var unassignedRoles = [];
    var params = this.get('model.parameters')
    var self = this;
    this.get('model.roles').forEach(function(role, index) {
      if ( self.getParamValue(role.get('flavorParameterName'), params) == null ) {
        unassignedRoles.pushObject(role);
      }
    });
    return unassignedRoles;
  }.property('model.roles', 'model.parameters'),

  allRolesAssigned: function() {
    return (this.get('unassignedRoles').length == 0);
  }.property('unassignedRoles'),

  noRolesAssigned: function() {
    return (this.get('unassignedRoles').length == this.get('model.roles').length);
  }.property('unassignedRoles'),

  profiles: function() {
    return this.get('register').get('model.profiles');
  }.property('register.model.profiles', 'register.model.profiles.length'),

  numProfiles: function() {
    var profiles = this.get('register.model.profiles');
    return profiles.length;
  }.property('model.profiles', 'model.profiles.length'),

  nodes: function() {
    return this.get('register').get('model.nodes');
  }.property('register.model.nodes'),

  getRoleByType: function(roleType) {
    var roles = this.get('model.plan.roles');
    if (!roles || !roles.length) {
      return null;
    }

    for (var i=0; i<roles.length; i++) {
      if (roles[i].name === roleType) {
        return roles[i];
      }
    }

    return null;
  },

  removeRoleFromProfile: function(profile, roleType) {
    var role = this.getRoleByType(roleType);
    if (profile !== null && profile !== undefined)
    {
      profile.unassignRole(role);
    }
    if (role) {
      role.set('profile', null);
      role.set('numNodes', 0);
    }
  },

  isDraggingRole: false,

  droppableClass: function() {
    if (this.isDraggingRole) {
      return 'deployment-roles-active';
    }
    else {
      return '';
    }
  }.property('isDraggingRole'),

  doAssignRole: function(profile, role) {
    role.set('numNodes', 1);
    role.set('profile', profile);
    profile.assignRole(role);
  },

  actions: {
    editRole: function(roleType) {
      log("EDIT: " + roleType);
    },

    assignRoleType: function(profile, roleType) {
      var role = this.getRoleByType(roleType);
      this.doAssignRole(profile, role);
    },

    assignRole: function(profile, role) {
      this.doAssignRole(profile, role);
    },

    removeRole: function(profile, roleType) {
      this.removeRoleFromProfile(profile, roleType);
    },

    unassignRole: function(role) {
      role.set('isDraggingObject', false);
      this.removeRoleFromProfile(role.profile, role.roleType);
    },

    doShowSettings: function() {
      this.set('showSettings', true);
    },

    doShowConfig: function() {
      this.set('showSettings', false);
    }
  },

  disableAssignNodesNext: function() {
    var freeNodeCount = 0;
    var profiles = this.get('profiles');
    if (profiles) {
      for (var i = 0; i < profiles.length; i++ ) {
        freeNodeCount += profiles[i].freeNodes;
      }
    }
    return (freeNodeCount < 4);
  }.property('profiles'),

  nextStepRouteName: function() {
    return ('');
  }.property('step2RoutName', 'step3RouteName')
});
