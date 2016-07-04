import Ember from 'ember';

export default Ember.Mixin.create({

  queryParams: ['search', 'page', 'sort_by', 'dir'],

  sortByDirection: Ember.computed('dir', function() {
    if (this.get('dir') === 'DESC') {
      return 'ASC';
    } else {
      return 'DESC';
    }
  })

});
