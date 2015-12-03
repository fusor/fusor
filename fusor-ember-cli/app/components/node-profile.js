import Ember from 'ember';

export default Ember.Component.extend({
  assignMenuOpenClass: '',

  nodes: [],

  getParamValue(paramName, params) {
    var paramValue = null;
    var numParams = params.get('length');
    for (var i=0; i<numParams; i++) {
      var param = params.objectAt(i);
      if (param.get('id') === paramName) {
        paramValue = param.get('value');
        break;
      }
    }
    return paramValue;
  },

  flavorParams: Ember.computed('plan.parameters.[]', function () {
    return this.get('plan.parameters').filter(function (param) {
      return !!param.get('id').match(/.*::Flavor/);
    });
  }),

  unassignedRoles: Ember.computed('plan.roles.[]', 'flavorParams.@each.value', function () {
    var self = this, roles = this.get('plan.roles');
    return roles.filter(function(role) { return !self.roleIsAssigned(role); });
  }),

  assignedRoles: Ember.computed('plan.roles.[]', 'flavorParams.@each.value', function() {
    var self = this, roles = this.get('plan.roles'), params = this.get('flavorParams');

    return roles.filter(function(role) {
      var param = params.findBy('id', role.get('flavorParameterName'));
      return param && param.get('value') === self.get('profile.name');
    });
  }),

  roleIsAssigned(role) {
    var value = this.getParamValue(role.get('flavorParameterName'), this.get('flavorParams'));
    return value && value !== 'baremetal';
  },

  allRolesAssigned: Ember.computed('unassignedRoles.[]', function() {
    return (this.get('unassignedRoles.length') === 0);
  }),

  /* jshint ignore:start */
  nodeMatchesProfile(node, profile) {
    var nodeMemory = node.get('properties.memory_mb');
    var nodeCPUs = node.get('properties.cpus');
    var nodeDisk = node.get('properties.local_gb');
    var nodeCPUArch = node.get('properties.cpu_arch');
    var profileMemory = profile.get('ram');
    var profileCPUs = profile.get('vcpus');
    var profileDisk = profile.get('disk');
    var profileCPUArch = profile.get('extra_specs.cpu_arch');
    return (nodeMemory == profileMemory &&
      nodeCPUs == profileCPUs &&
      nodeDisk == profileDisk &&
      nodeCPUArch == profileCPUArch);
  },
  /* jshint ignore:end */

  matchingNodeCount: Ember.computed('profile', 'nodes.[]', function() {
    var nodeCount = 0;
    var profile = this.get('profile');
    var self = this;
    this.get('nodes').forEach(function(node) {
      if (self.nodeMatchesProfile(node,profile)) {
        nodeCount++;
      }
    });
    return nodeCount;
  }),

  hideAssignMenu() {
    this.set('assignMenuOpenClass', '');
  },

  assignClass: Ember.computed('doAssign', function() {
    if (this.doAssign) {
      return "";
    }
    else {
      return "nodes-coalescing";
    }
  }),

  actions: {
    showAssignMenu() {
      if (!this.get('allRolesAssigned')) {
        this.set('assignMenuOpenClass', 'open');
      }
    },

    assignRole(role) {
      var profile = this.get('profile');
      var plan = this.get('plan');
      this.sendAction('assignRole', plan, role, profile);
    },

    assignDroppedRole(role) {
      role.set('isDraggingObject', false);
      var profile = this.get('profile');
      var plan = this.get('plan');
      if ( this.getParamValue(role.get('flavorParameterName'), plan.get('parameters')) !== profile.get('name') )
      {
        this.sendAction('assignRole', plan, role, profile);
      }
    },
    editRole(role) {
      this.sendAction('editRole', role);
    },

    setRoleCount(role, count) {
      this.sendAction('setRoleCount', role, count);
    },

    setRoleCountOnController(roleType, count) {
      this.sendAction('setRoleCountOnController', roleType, count);
    },

    removeRole(role) {
      var profile = this.get('profile');
      this.sendAction('removeRole', profile, role);
    }
  },
  didInsertElement() {
    var self = this;
    Ember.$('body').on('click', function() {
      try {
        self.hideAssignMenu();
      }
      catch (error) {
      }
    });
  }
});
