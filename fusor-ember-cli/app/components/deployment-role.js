import Ember from 'ember';

export default Ember.Component.extend({
  role: null,
  profile: null,

  assignedNodes: function() {
    var role = this.get('role');
    if (role && role.numNodes) {
      return role.numNodes;
    }
    else {
      return 0;
    }
  }.property('role', 'role.numNodes'),

  roleAssigned: function() {
    return this.get('profile') !== null;
  }.property('profile'),

  assignedClass: function() {
    if (this.get('roleAssigned')) {
      return ('role-assigned');
    }
    else {
      return 'role-unassigned';
    }
  }.property('role-assigned'),

  roleType: function() {
    var role = this.get('role');
    if (role) {
      return role.get('roleType');
    }
    else {
      return 'hidden';
    }
  }.property('role', 'role.roleType'),

  maxToAssign: function() {
    var numNodes = this.get('assignedNodes');
    var freeNodes = this.get('profile').get('freeNodes');
    return freeNodes + numNodes;
  }.property('profile', 'profile.freeNodes', 'assignedNodes'),

  availableOptions: function() {
    var avail = [];
    var assignedNodes = this.get('assignedNodes');
    var increment = 1;
    try {
      var roleType = this.get('role').get('roleType');
      if (roleType === 'controller') {
        increment = 2;
      }
    }
    catch (e) {
    }

    for (var i=1; i <= this.get('maxToAssign'); i = i + increment) {
      var nextOption = Ember.Object.create({
        label: '' + i,
        value: i,
        selected: (i === assignedNodes)
      });
      avail.pushObject(nextOption);
    }

    return avail;
  }.property('maxToAssign', 'assignedNodes', 'profile.freeNodes', 'role.roleType'),

  actions: {
    assignNodes: function() {
      var newCount = parseInt(this.$('select').val());
      var role = this.get('role');
      role.set('numNodes', newCount);

      var profile = this.get('profile');
      if (!profile.getAssignedRole(role.get('roleType'))) {
        profile.assignRole(role);
      }
    },

    editRole: function() {
      this.sendAction('edit', this.get('role'));
    },

    removeRole: function() {
      this.sendAction('remove', this.get('role'));
    }
  }
});
