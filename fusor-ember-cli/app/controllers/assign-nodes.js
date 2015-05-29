import Ember from 'ember';
import DeploymentControllerMixin from "../mixins/deployment-controller-mixin";

export default Ember.Controller.extend(DeploymentControllerMixin, {

  needs: ['deployment', 'register-nodes'],
  register: Ember.computed.alias("controllers.register-nodes"),

  availableRoles: function() {
    var roles = [];
    if (!this.get('controllerAssigned')) {
      roles.pushObject(Ember.Object.create({
        roleType: 'controller',
        roleLabel: 'Controller'
      }));
    }
    if (!this.get('computeAssigned')) {
      roles.pushObject(Ember.Object.create({
        roleType: 'compute',
        roleLabel: 'Compute'
      }));
    }
    if (!this.get('blockAssigned')) {
      roles.pushObject(Ember.Object.create({
        roleType: 'block',
        roleLabel: 'Block Storage'
      }));
    }
    if (!this.get('objectAssigned')) {
      roles.pushObject(Ember.Object.create({
        roleType: 'object',
        roleLabel: 'Object Storage'
      }));
    }
    return roles;
  }.property('controllerAssigned', 'computeAssigned', 'blockAssigned', 'objectAssigned'),

  isDraggingRole: false,

  droppableClass: function() {
    if (this.isDraggingRole) {
      return 'deployment-roles-active';
    }
    else {
      return '';
    }
  }.property('isDraggingRole'),

  controllerAssigned: function() {
    var profiles = this.get('nodeProfiles');
    if (!profiles) {
      return false;
    }
    var retVal = false;
    profiles.forEach(function(item) {
      if (item.get('isControl')) {
        retVal = true;
      }
    });
    return retVal;
  }.property('nodeProfiles','nodeProfiles.@each.isControl'),

  computeAssigned: function() {
    var profiles = this.get('nodeProfiles');
    if (!profiles) {
      return false;
    }
    var retVal = false;
    profiles.forEach(function(item) {
      if (item.get('isCompute')) {
        retVal = true;
      }
    });
    return retVal;
  }.property('nodeProfiles.@each.isCompute'),

  blockAssigned: function() {
    var profiles = this.get('nodeProfiles');
    if (!profiles) {
      return false;
    }
    var retVal = false;
    profiles.forEach(function(item) {
      if (item.get('isBlockStorage')) {
        retVal = true;
      }
    });
    return retVal;
  }.property('nodeProfiles.@each.isBlockStorage'),

  objectAssigned: function() {
    var profiles = this.get('nodeProfiles');
    if (!profiles) {
      return false;
    }
    var retVal = false;
    profiles.forEach(function(item) {
      if (item.get('isObjectStorage')) {
        retVal = true;
      }
    });
    return retVal;
  }.property('nodeProfiles.@each.isObjectStorage'),

  allAssigned: function() {
    return this.get('controllerAssigned') && this.get('computeAssigned') && this.get('blockAssigned') && this.get('objectAssigned');
  }.property('controllerAssigned','computeAssigned', 'blockAssigned', 'objectAssigned'),

  noneAssigned: function() {
    return !this.get('controllerAssigned') && !this.get('computeAssigned') && !this.get('blockAssigned') && !this.get('objectAssigned');
  }.property('controllerAssigned','computeAssigned', 'blockAssigned', 'objectAssigned'),

  nodeProfiles:function() {
    return this.get('register').get('model.profiles');
  }.property('register.model.profiles', 'register.model.profiles.length'),

  numProfiles: function() {
    var profiles = this.get('register.model.profiles');
    return profiles.length;
  }.property('model.profiles', 'model.profiles.length'),

  removeRoleFromProfile: function(profile, roleType) {
    if (roleType === 'controller') {
      profile.set('controllerNodes', 0);
    }
    else if (roleType === 'compute') {
      profile.set('computeNodes', 0);
    }
    else if (roleType === 'block') {
      profile.set('blockNodes', 0);
    }
    else if (roleType === 'object') {
      profile.set('objectNodes', 0);
    }
  },

  actions: {
    editRole: function(roleType) {
      log("EDIT: " + roleType);
    },

    assignRole: function(profile, roleType) {
      if (roleType === 'controller') {
        profile.set('controllerNodes', 1);
      }
      else if (roleType === 'compute') {
        profile.set('computeNodes', 1);
      }
      else if (roleType === 'block') {
        profile.set('blockNodes', 1);
      }
      else if (roleType === 'object') {
        profile.set('objectNodes', 1);
      }
    },

    removeRole: function(profile, roleType) {
      this.removeRoleFromProfile(profile, roleType);
    },

    unassignRole: function(role) {
      role.set('isDraggingObject', false);
      this.removeRoleFromProfile(role.profile, role.roleType);
    },

    startDrag:function() {
      this.set('isDraggingRole', true);
    },

    stopDrag:function() {
      this.set('isDraggingRole', false);
    }
  },

  disableAssignNodesNext: function() {
    var freeNodeCount = 0;
    var profiles = this.get('nodeProfiles');
    if (profiles) {
      for (var i = 0; i < profiles.length; i++ ) {
        freeNodeCount += profiles[i].freeNodes;
      }
    }
    return (freeNodeCount < 4);
  }.property('nodeProfiles'),

  nextStepRouteName: function() {
    return ('');
  }.property('step2RoutName', 'step3RouteName')
});
