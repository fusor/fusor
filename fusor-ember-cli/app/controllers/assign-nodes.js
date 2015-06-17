import Ember from 'ember';
import DeploymentControllerMixin from "../mixins/deployment-controller-mixin";

export default Ember.Controller.extend(DeploymentControllerMixin, {

  needs: ['deployment', 'register-nodes'],
  register: Ember.computed.alias("controllers.register-nodes"),

  roles: [],
  init: function() {
    this._super();
    var roles = [];
    var me = this;

    this.DeploymentRole = Ember.Object.extend({
      name: function () {
        var roleType = this.get('roleType');
        if (roleType === 'controller') {
          var roleName = 'Controller';
          if (this.get('numNodes') > 1) {
            roleName += ' (HA)';
          }
          return roleName;
        }
        if (roleType === 'compute') {
          return 'Compute';
        }
        if (roleType === 'block') {
          return 'Block Storage';
        }
        if (roleType === 'object') {
          return 'Object Storage';
        }
      }.property('roleType', 'numNodes'),

      roleType: '',
      profile: null,
      image: '',
      numNodes: 0,
      isDraggingObject: false,
      watchForDrag: function() {
        me.set('isDraggingRole', this.get('isDraggingObject'));
      }.observes('isDraggingObject')
    });

    roles.pushObject(this.DeploymentRole.create({
      roleType: 'controller'
    }));
    roles.pushObject(this.DeploymentRole.create({
      roleType: 'compute'
    }));
    roles.pushObject(this.DeploymentRole.create({
      roleType: 'block'
    }));
    roles.pushObject(this.DeploymentRole.create({
      roleType: 'object'
    }));

    this.set('roles', roles);
  },

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

  controllerAssigned: function() {
    var role = this.getRoleByType('controller');
    return (role && role.numNodes > 0);
  }.property('roles','roles.@each.numNodes'),

  computeAssigned: function() {
    var role = this.getRoleByType('compute');
    return (role && role.numNodes > 0);
  }.property('roles','roles.@each.numNodes'),

  blockAssigned: function() {
    var role = this.getRoleByType('block');
    return (role && role.numNodes > 0);
  }.property('roles','roles.@each.numNodes'),

  objectAssigned: function() {
    var role = this.getRoleByType('object');
    return (role && role.numNodes > 0);
  }.property('roles','roles.@each.numNodes'),

  allAssigned: function() {
    return this.get('controllerAssigned') && this.get('computeAssigned') && this.get('blockAssigned') && this.get('objectAssigned');
  }.property('controllerAssigned','computeAssigned', 'blockAssigned', 'objectAssigned'),

  noneAssigned: function() {
    return !this.get('controllerAssigned') && !this.get('computeAssigned') && !this.get('blockAssigned') && !this.get('objectAssigned');
  }.property('controllerAssigned','computeAssigned', 'blockAssigned', 'objectAssigned'),

  profiles:function() {
    return this.get('register').get('model.profiles');
  }.property('register.model.profiles', 'register.model.profiles.length'),

  numProfiles: function() {
    var profiles = this.get('register.model.profiles');
    return profiles.length;
  }.property('model.profiles', 'model.profiles.length'),

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
