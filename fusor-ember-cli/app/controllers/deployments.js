import Ember from 'ember';

export default Ember.Controller.extend({

  sortedDeployments: Ember.computed('model.[]', 'model.@each.name', function() {
    return this.get('model').sortBy('name');
  }),

  searchDeploymentString: '',

  filteredDeployments: Ember.computed('sortedDeployments', 'searchDeploymentString', 'model.[]', function(){
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
  }),

  // related to deleted-deployment-modal
  isOpenModal: false,
  deploymentInModal: null,

  actions: {
    openDeploymentModal: function (item) {
      this.set('deploymentInModal', item);
      return this.set('isOpenModal', true);
    }
  }
});
