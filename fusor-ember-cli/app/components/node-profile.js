import Ember from 'ember';

export default Ember.Component.extend({
  assignMenuOpenClass: '',

  profile: null,
  plan: null,
  nodes: [],

  getParamValue: function(paramName, params) {
    var paramValue = null;
    var numParams = params.get('length');
    for (var i=0; i<numParams; i++) {
      var param = params.objectAt(i);
      if (param.get('id') == paramName) {
        paramValue = param.get('value');
        break;
      }
    }
    return paramValue;
  },

  assignedRoles: function() {
    var assignedRoles = [];
    var profile = this.get('profile');
    var params = this.get('plan.parameters')
    var self = this;
    this.get('plan.roles').forEach(function(role, index) {
      if ( self.getParamValue(role.get('flavorParameterName'), params) == profile.get('name') ) {
        assignedRoles.pushObject(role);
      }
    });
    return assignedRoles;
  }.property('profile', 'plan', 'plan.roles', 'plan.parameters'),

  unassignedRoles: function() {
    var unassignedRoles = [];
    var assignedRoles = this.get('assignedRoles');
    this.get('plan.roles').forEach(function(role, index) {
      var unassignedRole = true;
      for (var i=0; i<assignedRoles.length; i++) {
        if ( role.get('name') == assignedRoles[i].get('name') ) {
          unassignedRole = false;
          break;
        }
      }
      if ( unassignedRole ) {
        unassignedRoles.pushObject(role);
      }
    });
    return unassignedRoles;
  }.property('assignedRoles', 'plan', 'plan.roles'),

  allRolesAssigned: function() {
    return (this.get('unassignedRoles').length == 0);
  }.property('unassignedRoles'),

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

  matchingNodeCount: function() {
    var nodeCount = 0;
    var profile = this.get('profile');
    var self = this;
    this.get('nodes').forEach(function(node,index) {
      if (self.nodeMatchesProfile(node,profile)) {
        nodeCount++;
      }
    });
    return nodeCount;
  }.property('profile', 'nodes'),

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
