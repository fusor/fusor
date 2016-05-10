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

  nodeMatchesProfile(node, profile) {
    let nodeMemory = node.get('properties.memory_mb');
    let nodeCPUs = node.get('properties.cpus');
    let nodeDisk = node.get('properties.local_gb');
    let nodeCPUArch = node.get('properties.cpu_arch');
    let profileMemory = profile.get('ram');
    let profileCPUs = profile.get('vcpus');
    let profileDisk = profile.get('disk');
    let profileCPUArch = profile.get('extra_specs.cpu_arch');

    return nodeMemory == profileMemory &&
      nodeCPUs == profileCPUs &&
      nodeDisk == profileDisk &&
      nodeCPUArch == profileCPUArch;
  },

  matchingNodeCount: Ember.computed('profile', 'nodes.[]', function () {
    let nodeCount = 0;
    let profile = this.get('profile');
    let self = this;
    this.get('nodes').forEach(function (node) {
      if (self.nodeMatchesProfile(node, profile)) {
        nodeCount++;
      }
    });
    return nodeCount;
  }),

  hideAssignMenu() {
    this.set('assignMenuOpenClass', '');
  },

  assignClass: Ember.computed('doAssign', function () {
    return this.doAssign ? '' : 'nodes-coalescing';
  }),

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
      }
    });
  }
});
