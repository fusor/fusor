import Ember from 'ember';

export default Ember.ArrayController.extend({
  unusedTrafficTypes: function() {
    return this.get('trafficTypes').filter(function(item, index, enumerable){
      return (item.get('subnets').get('length') == 0);
    });
  }.property('trafficTypes.@each.subnets', 'model.@each.trafficTypes'),

  usedTrafficTypes: function() {
    return this.get('trafficTypes').filter(function(item, index, enumerable){
      return (item.get('subnets').get('length') > 0);
    });
  }.property('trafficTypes.@each.subnets', 'model.@each.trafficTypes'),

  actions: {
    assignTrafficTypeToSubnet: function(obj,ops) {
      var subnets = obj.get('subnets');
      subnets.forEach(function (item) {
        obj.get('subnets').removeObject(item);
      });

      var subnet = ops.target.subnet;
      subnet.get('trafficTypes').then(function(results) {
        return results.pushObject(obj);
      })
    },
    removeTrafficTypeFromSubnet: function(obj,ops) {
      var subnets = obj.get('subnets');
      subnets.forEach(function (item) {
        obj.get('subnets').removeObject(item);
      });
      return this.get('unusedTrafficTypes').pushObject(obj);
    }
  }

//      })

      // var subnet = ops.target.subnet;
      // subnet.get('trafficTypes').then(function(results) {
      //    return results.pushObject(obj);
      // })


});
