import Ember from 'ember';

export default Ember.ArrayController.extend({

  sortProperties: ['name'],
  sortAscending: true,

  sortedDeployments: Ember.computed.sort('model', 'sortProperties'),

  searchDeploymentString: '',

  filteredDeployments: function(){
    var searchDeploymentString = this.get('searchDeploymentString');
    var rx = new RegExp(searchDeploymentString, 'gi');
    var sortedDeployments = this.get('sortedDeployments');

    if (sortedDeployments.get('length') > 1) {
      return sortedDeployments.filter(function(record) {
        if (Ember.isPresent(record.get('name'))) {
          return record.get('name').match(rx);
        }
      });
    } else {
      return sortedDeployments;
    }
  }.property('sortedDeployments', 'searchDeploymentString', 'model.[]'),

  // related to deleted-deployment-modal
  isOpenModal: false,
  deploymentInModal: null,

  actions: {
    openDeploymentModal: function (item) {
      this.set('deploymentInModal', item);
      return this.set('isOpenModal', true);
    },
  }
});
