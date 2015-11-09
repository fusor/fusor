import Ember from 'ember';

export default Ember.Component.extend({
  assignMenuOpenClass: '',

  nodes: [],

  getParamValue: function(paramName, params) {
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

  assignedRoles: Ember.computed('profile', 'plan', 'plan.roles', 'plan.parameters', function() {
    var assignedRoles = Ember.A();
    var profile = this.get('profile');
    var params = this.get('plan.parameters');
    var self = this;
    var roles = this.get('plan.roles') || Ember.A();
    roles.forEach(function(role) {
      if ( self.getParamValue(role.get('flavorParameterName'), params) === profile.get('name') ) {
        assignedRoles.addObject(role);
      }
    });
    return assignedRoles;
  }),

  unassignedRoles: Ember.computed('assignedRoles', 'plan', 'plan.roles', function() {
    var unassignedRoles = Ember.A();
    var assignedRoles = this.get('assignedRoles');
    var roles = this.get('plan.roles') || Ember.A();
    roles.forEach(function(role) {
      var unassignedRole = true;
      for (var i=0; i<assignedRoles.length; i++) {
        if ( role.get('name') === assignedRoles[i].get('name') ) {
          unassignedRole = false;
          break;
        }
      }
      if ( unassignedRole ) {
        unassignedRoles.addObject(role);
      }
    });
    return unassignedRoles;
  }),

  allRolesAssigned: Ember.computed('unassignedRoles.[]', function() {
    return (this.get('unassignedRoles.length') === 0);
  }),

  /* jshint ignore:start */
  nodeMatchesProfile: function(node, profile) {
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

  hideAssignMenu: function() {
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
    showAssignMenu: function() {
      if (this.get('unassignedRoles.length') > 0) {
        this.set('assignMenuOpenClass', 'open');
      }
    },

    assignRole: function(role) {
      var profile = this.get('profile');
      var plan = this.get('plan');
      this.sendAction('assignRole', plan, role, profile);
    },

    assignDroppedRole: function(role) {
      role.set('isDraggingObject', false);
      var profile = this.get('profile');
      var plan = this.get('plan');
      if ( this.getParamValue(role.get('flavorParameterName'), plan.get('parameters')) !== profile.get('name') )
      {
        this.sendAction('assignRole', plan, role, profile);
      }
    },
    editRole: function(role) {
      this.sendAction('editRole', role);
    },

    setRoleCount: function(role, count) {
      this.sendAction('setRoleCount', role, count);
    },

    removeRole: function(role) {
      var profile = this.get('profile');
      this.sendAction('removeRole', profile, role);
    }
  },
  didInsertElement: function() {
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
