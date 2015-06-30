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

    for (var i=0; i <= this.get('nodeCount'); i = i + increment) {
      var nextOption = Ember.Object.create({
        label: '' + i,
        value: i,
        selected: (i == this.get('roleNodeCount'))
      });
      avail.pushObject(nextOption);
    }

    return avail;
  }.property('roleNodeCount'),

  actions: {
    updateNodeCount: function() {
      var nodeCount = parseInt(this.$('select').val());
      var role = this.get('role');
      var plan = this.get('plan');
      var data = { 'role_name': role.get('name'), 'count': nodeCount };

      Ember.$.ajax({
        url: '/fusor/api/openstack/deployment_plans/' + plan.get('id') + '/update_role_count',
        type: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function(response) {
          console.log('SUCCESS');
        },
        error: function(error) {
          console.log('ERROR');
          console.log(error);
        }
      });
    },

    editRole: function() {
      this.sendAction('edit', this.get('role'));
    },

    removeRole: function() {
      this.sendAction('remove', this.get('role'));
    }
  }
});
