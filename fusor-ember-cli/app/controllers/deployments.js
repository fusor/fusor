import Ember from 'ember';

export default Ember.ArrayController.extend({

  sortProperties: ['name'],
  sortAscending: true,

  sortedDeployments: Ember.computed.sort('model', 'sortProperties'),

  searchDeploymentString: '',

  filteredDeployments: function(){
    var searchDeploymentString = this.get('searchDeploymentString');
    var rx = new RegExp(searchDeploymentString, 'gi');
    var model = this.get('sortedDeployments');

    if (model.get('length') > 0) {
      return model.filter(function(record) {
        return record.get('name').match(rx)
      });
    } else {
      return model;
    }
  }.property('sortedDeployments', 'searchDeploymentString'),

});
