import Ember from 'ember';

export default Ember.Component.extend({
  assignedClass: function() {
    if (this.get('role-assigned')) {
      return ('role-assigned');
    }
    else {
      return '';
    }
  }.property('role-assigned'),

  roleLabel: function() {
    var roleLabel = this.get('role-label');
    var roleType = this.get('role-type');
    if ((roleType === 'controller') && (this.get('assignedNodes') > 1)) {
      roleLabel += ' (HA)';
    }
    return roleLabel;
  }.property('role-label', 'role-type', 'assignedNodes'),

  assignedNodes: function() {
    var roleType = this.get('role-type');
    var profile = this.get('profile');
    if (!this.get('role-assigned')) {
      return 0;
    }

    if (roleType === 'controller') {
      return profile.get('controllerNodes');
    }
    else if (roleType === 'compute') {
      return profile.get('computeNodes');
    }
    else if (roleType === 'block') {
      return profile.get('blockNodes');
    }
    else if (roleType === 'object') {
      return profile.get('objectNodes');
    }
  }.property('profile', 'profile.controllerNodes', 'profile.computeNodes', 'profile.blockNodes', 'profile.objectNodes'),

  maxToAssign: function() {
    var numNodes = this.get('assignedNodes');
    var freeNodes = this.get('profile').get('freeNodes');
    return freeNodes + numNodes;
  }.property('profile', 'profile.freeNodes', 'assignedNodes'),

  availableOptions: function() {
    var avail = [];
    var assignedNodes = this.get('assignedNodes');
    var roleType = this.get('role-type');
    var increment = 1;
    if (roleType == 'controller') {
      increment = 2;
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
  }.property('maxToAssign', 'assignedNodes', 'profile.freeNodes'),

  actions: {
    assignNodes: function() {
      var newCount = parseInt(this.$('select').val());
      var roleType = this.get('role-type');
      var profile = this.get('profile');
      if (roleType === 'controller') {
        profile.set('controllerNodes', newCount);
      }
      else if (roleType === 'compute') {
        profile.set('computeNodes', newCount);
      }
      else if (roleType === 'block') {
        profile.set('blockNodes', newCount);
      }
      else if (roleType === 'object') {
        profile.set('objectNodes', newCount);
      }
    },

    editRole: function(roleType) {
      this.sendAction('edit', roleType);
    },

    removeRole: function(roleType) {
      this.sendAction('remove', roleType);
    }
  }
});
