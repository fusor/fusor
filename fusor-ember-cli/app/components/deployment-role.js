import Ember from 'ember';

export default Ember.Component.extend({
  role: null,
  profile: null,
  plan: null,
  nodeCount: 0,

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

  roleAssigned: Ember.computed('profile', function() {
    return this.get('profile') !== null;
  }),

  assignedClass: Ember.computed('role-assigned', function() {
    if (this.get('roleAssigned')) {
      return ('role-assigned');
    }
    else {
      return 'role-unassigned';
    }
  }),

  roleNodeCount: Ember.computed('role', 'plan.parameters', function() {
    var role = this.get('role');
    var params = this.get('plan.parameters');
    return this.getParamValue(role.get('countParameterName'), params);
  }),

  hasAssignedNodes: Ember.computed('roleNodeCount', function() {
    return this.get('roleNodeCount') >= 1;
  }),

  multipleAssignedNodes: Ember.computed('roleNodeCount', function() {
    return this.get('roleNodeCount') >= 2;
  }),

  profileNodes: Ember.computed('totalNodes', function() {
    var totalNodes = 10;
    return totalNodes;
  }),

  availableOptions: Ember.computed('roleNodeCount', function() {
    var avail = Ember.A();
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
      avail.addObject(nextOption);
    }

    return avail;
  }),

  actions: {
    updateNodeCount() {
      var nodeCount = parseInt(this.$('select').val());
      this.sendAction('setRoleCount', this.get('role'), nodeCount);
    },

    editRole() {
      this.sendAction('edit', this.get('role'));
    },

    removeRole() {
      this.sendAction('remove', this.get('role'));
    }
  }
});
