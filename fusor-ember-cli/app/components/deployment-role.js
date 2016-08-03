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

  availableOptions: Ember.computed(
    'role.count',
    'role.name',
    'nodeCount',
    function() {
      let avail = [];
      const nodeCount = this.get('nodeCount');

      let maxNodes = Math.max(this.get('nodeCount'), this.get('role.count'));

      if(this.get('role.name') === 'Controller') {
        // Require at least one Controller, allow for 3 (HA) if > 3 available
        avail.push(1);
        if(nodeCount >= 3) {
          avail.push(3);
        }
        return avail;
      }

      for (let i = 0; i <= maxNodes; i++) {
        avail.pushObject(i);
      }

      return avail;
    }
  ),

  actions: {
    editRole() {
      this.sendAction('edit', this.get('role'));
    },

    removeRole() {
      this.sendAction('remove', this.get('role'));
    }
  }
});
