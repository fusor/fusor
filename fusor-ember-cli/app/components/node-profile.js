import Ember from 'ember';

export default Ember.Component.extend({
  assignMenuOpenClass: '',
  nodes: [],

  assignedRoles: Ember.computed('roles.[]', 'roles.@each.flavor',  'profile.name', function() {
    return this.get('roles').filter(role => role.get('flavor') === this.get('profile.name'));
  }),

  unassignedRoles: Ember.computed('roles.@each.flavor', function () {
    return this.get('roles').filter(role => !role.isAssigned());
  }),

  matchingNodeCount: Ember.computed('profile', 'nodes.[]', function () {
    return this.get('profile').matchingNodeCount(this.get('nodes'));
  }),

  hideAssignMenu() {
    this.set('assignMenuOpenClass', '');
  },

  assignClass: Ember.computed('doAssign', function () {
    return this.doAssign ? '' : 'nodes-coalescing';
  }),

  hasOvercommittedNodeCount: Ember.computed(
    'assignedRoles.@each.count',
    'matchingNodeCount',
    function() {
      const assignedNodes = this.get('assignedRoles').reduce((totalNodes, role) => {
        return totalNodes += role.get('count');
      }, 0);

      return assignedNodes > this.get('matchingNodeCount');
    }
  ),
  actions: {
    showAssignMenu() {
      if (!this.get('allRolesAssigned')) {
        this.set('assignMenuOpenClass', 'open');
      }
    },

    assignRole(role) {
      this.sendAction('assignRole', role, this.get('profile'));
      if ((role.get('name') === 'Compute' || role.get('name') == 'Controller') && !role.get('count')){
        role.set('count', 1);
      }

      if (this.get('matchingNodeCount') < role.get('count')) {
        role.set('count', this.get('matchingNodeCount'));
        this.sendAction('roleCountUpdated', role);
      }
    },

    editRole(role) {
      this.sendAction('editRole', role);
    },

    removeRole(role) {
      this.sendAction('unassignRole', role);
    }
  },

  didInsertElement() {
    let self = this;
    Ember.$('body').on('click', function () {
      try {
        self.hideAssignMenu();
      }
      catch (error) {
        // do nothing
      }
    });
  }
});
