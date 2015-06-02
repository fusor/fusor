import Ember from 'ember';

export default Ember.Component.extend({
  assignMenuOpenClass: '',

  profile: null,
  profiles: null,

  assignedRoles: function() {
    var profile = this.get('profile');
    var roles = profile.get('assignedRoles');
    return roles;
  }.property('profile', 'profile.assignedRoles'),

  controllerAssigned: function() {
    var profiles = this.get('profiles');
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
  }.property('profiles','profiles.@each.isControl'),

  computeAssigned: function() {
    var profiles = this.get('profiles');
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
  }.property('profiles.@each.isCompute'),

  blockAssigned: function() {
    var profiles = this.get('profiles');
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
  }.property('profiles.@each.isBlockStorage'),

  objectAssigned: function() {
    var profiles = this.get('profiles');
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
  }.property('profiles.@each.isObjectStorage'),

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

  assignClass: function() {
    if (this.doAssign) {
      return "";
    }
    else {
      return "nodes-coalescing";
    }
  }.property('doAssign'),

  actions: {
    showAssignMenu: function() {
      if (this.get('freeNodes') > 0) {
        this.set('assignMenuOpenClass', 'open');
      }
    },
    assignRoleType: function(roleType) {
      this.set('assignMenuOpenClass', '');
      this.sendAction('assignRoleType', this.get('profile'), roleType);
    },
    assignDroppedRole: function(role) {
      role.set('isDraggingObject', false);
      var profile = this.get('profile');
      if (profile.get('freeNodes') > 0)
      {
        if (role.get('profile') !== this.get('profile'))
        {
          this.sendAction('unassignRole', role);
          this.sendAction('assignRole', this.get('profile'), role);
        }
      }
    },
    removeRole: function(role) {
      this.sendAction('unassignRole', role);
    },
    editRole: function(role) {
      this.sendAction('editRole', role);
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
