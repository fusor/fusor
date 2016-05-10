import Ember from 'ember';

export default Ember.Component.extend({
  roleAssigned: Ember.computed('profile', function() {
    return Ember.isPresent(this.get('profile'));
  }),

  assignedClass: Ember.computed('role-assigned', function() {
    return this.get('roleAssigned') ? 'role-assigned' : 'role-unassigned';
  }),

  hasAssignedNodes: Ember.computed('roleNodeCount', function() {
    return this.get('role.count') >= 1;
  }),

  multipleAssignedNodes: Ember.computed('roleNodeCount', function() {
    return this.get('role.count') >= 2;
  }),

  availableOptions: Ember.computed('role.count', function() {
    let avail = [];
    let maxNodes = Math.max(this.get('nodeCount'), this.get('role.count'));

    for (let i = 0; i <= maxNodes; i++) {
      avail.pushObject(i);
    }

    return avail;
  }),

  actions: {
    editRole() {
      this.sendAction('edit', this.get('role'));
    },

    removeRole() {
      this.sendAction('remove', this.get('role'));
    }
  }
});
