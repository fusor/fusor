import Ember from 'ember';

export default Ember.Component.extend({
  assignMenuOpenClass: '',

  profile: null,
  nodeProfiles: null,

  assignedRoles: function() {
    var roles = [];
    var profile = this.get('profile');
    var me = this;

    var Role = Ember.Object.extend({
      roleType: '',
      roleLabel: '',
      profile: profile,
      isDraggingObject: false,
      watchForDrag: function() {

        if (this.get('isDraggingObject')) {
          me.sendAction("startDrag", this);
        }
        else {
          me.sendAction("stopDrag", this);
        }
      }.observes('isDraggingObject')
    });

    if (profile.get('isControl')) {
      roles.pushObject(Role.create({
        roleType: 'controller',
        roleLabel: 'Controller'
      }));
    }
    if (profile.get('isCompute')) {
      roles.pushObject(Role.create({
        roleType: 'compute',
        roleLabel: 'Compute'
      }));
    }
    if (profile.get('isBlockStorage')) {
      roles.pushObject(Role.create({
        roleType: 'block',
        roleLabel: 'Block Storage'
      }));
    }
    if (profile.get('isObjectStorage')) {
      roles.pushObject(Role.create({
        roleType: 'object',
        roleLabel: 'Object Storage'
      }));
    }
    return roles;
  }.property('profile.isCompute', 'profile.isControl', 'profile.isBlockStorage', 'profile.isObjectStorage'),

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

  freeNodes: function() {
    var profile = this.get('profile');
    return profile.get('totalNodes') - profile.get('controllerNodes') - profile.get('computeNodes') - profile.get('blockNodes') - profile.get('objectNodes');
  }.property('profile.totalNodes', 'profile.controllerNodes', 'profile.computeNodes', 'profile.blockNodes', 'profile.objectNodes'),

  allAssigned: function() {
    return this.get('controllerAssigned') && this.get('computeAssigned') && this.get('blockAssigned') && this.get('objectAssigned');
  }.property('controllerAssigned', 'computeAssigned', 'blockAssigned', 'objectAssigned'),

  hideAssignMenu: function() {
    this.set('assignMenuOpenClass', '');
  },

  actions: {
    showAssignMenu: function() {
      if (this.get('freeNodes') > 0) {
        this.set('assignMenuOpenClass', 'open');
      }
    },
    assignRole: function(roleType) {
      this.set('assignMenuOpenClass', '');
      this.sendAction('assignRole', this.get('profile'), roleType);
    },
    assignDroppedRole: function(role) {
      role.set('isDraggingObject', false);
      if (role.profile !== this.get('profile')) {
        if (role.profile) {
          this.sendAction('removeRole', role.profile, role.roleType);
        }
        this.sendAction('assignRole', this.get('profile'), role.roleType);
      }
    },
    removeRole: function(roleType) {
      this.sendAction('removeRole', this.get('profile'), roleType);
    }
  },
  didInsertElement: function() {
    var self = this;
    $('body').on('click', function() {
      try {
        self.hideAssignMenu();
      }
      catch (error) {
      }
    });
  }
});
