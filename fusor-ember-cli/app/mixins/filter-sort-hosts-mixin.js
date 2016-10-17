import Ember from 'ember';

export default Ember.Mixin.create({

  filteredHosts: Ember.computed('availableHosts.[]', 'searchString', 'isStarted', function(){
    var searchString = this.get('searchString');
    var rx = new RegExp(searchString, 'gi');
    var availableHosts = this.get('availableHosts');

    if (this.get('isStarted')) {
      // hypervisors model will already be packaged as array
      if (Ember.isArray(this.get('model'))) {
        return this.get('model');
      }
      // convert singular host contained in engine model to array
      else {
        return Ember.A([this.get('model')]);
      }
    } else if (availableHosts.get('length') > 0) {
      return availableHosts.filter(function(record) {
        return record.get('name').match(rx) ||
          record.get('memory_human_size').match(rx) ||
          record.get('disks_human_size').match(rx) ||
          record.get('subnet_to_s').match(rx) ||
          record.get('mac').match(rx);
      });
    } else {
      return availableHosts;
    }
  }),

  sortCriteria: Ember.computed('sort_by', 'dir', function () {
    let sort_by = this.get('sort_by') || 'name';
    let dir = this.get('dir') || 'asc';
    return [sort_by+':'+dir];
  }),

  sortedHosts: Ember.computed.sort('filteredHosts', 'sortCriteria')

});
