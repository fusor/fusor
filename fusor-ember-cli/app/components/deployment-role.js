import Ember from 'ember';

export default Ember.Component.extend({
  role: null,
  profile: null,
  plan: null,
  nodeCount: 0,

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

  roleNodeCount: function() {
    var role = this.get('role');
    var params = this.get('plan.parameters');
    return this.getParamValue(role.get('countParameterName'), params);
  }.property('role', 'plan.parameters'),

  hasAssignedNodes: function() {
    return this.get('roleNodeCount') >= 1;
  }.property('roleNodeCount'),

  multipleAssignedNodes: function() {
    return this.get('roleNodeCount') >= 2;
  }.property('roleNodeCount'),

  profileNodes: function() {
    var totalNodes = 10;
    return totalNodes;
  }.property('totalNodes'),

  availableOptions: function() {
    var avail = [];
    var increment = 1;
    var maxNodes = Math.max(this.get('nodeCount'), this.get('roleNodeCount'));

    for (var i=0; i <= maxNodes; i = i + increment) {
      var nextOption = Ember.Object.create({
        label: '' + i,
        value: i,
        /* jshint ignore:start */
        selected: (i == this.get('roleNodeCount'))
        /* jshint ignore:end */
      });
      avail.pushObject(nextOption);
    }

    return avail;
  }.property('roleNodeCount'),

  actions: {
    updateNodeCount: function() {
      var nodeCount = parseInt(this.$('select').val());
      this.sendAction('setRoleCount', this.get('role'), nodeCount);
    },

    editRole: function() {
      this.sendAction('edit', this.get('role'));
    },

    removeRole: function() {
      this.sendAction('remove', this.get('role'));
    }
  }
});
