import Ember from 'ember';

export default Ember.Component.extend({
  role: null,
  profile: null,
  plan: null,

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
    var params = this.get('plan.parameters')
    return this.getParamValue(role.get('countParameterName'), params);
  }.property('role', 'plan.parameters'),

  profileNodes: function() {
    var totalNodes = 10;
    return totalNodes;
  }.property('totalNodes'),

  availableOptions: function() {
    var avail = [];
    var increment = 1;

    for (var i=0; i <= this.get('profileNodes'); i = i + increment) {
      var nextOption = Ember.Object.create({
        label: '' + i,
        value: i,
        selected: (i == this.get('roleNodeCount'))
      });
      avail.pushObject(nextOption);
    }

    return avail;
  }.property('roleNodeCount', 'profileNodesAvailable'),

  actions: {
    assignNodes: function() {
      var newCount = parseInt(this.$('select').val());
      var role = this.get('role');
      role.set('numNodes', newCount);

      var profile = this.get('profile');
      if (!profile.getAssignedRole(role.get('roleType'))) {
        profile.assignRole(role);
      }
    },

    editRole: function() {
      this.sendAction('edit', this.get('role'));
    },

    removeRole: function() {
      this.sendAction('remove', this.get('role'));
    }
  }
});
