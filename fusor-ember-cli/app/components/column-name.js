import Ember from 'ember';

export default Ember.Component.extend({
  arrowIcon: Ember.computed('col_name', 'sort_by', 'dir', function () {
    let col_name = this.get('col_name');
    let sort_by = this.get('sort_by');
    let dir = this.get('dir') ? this.get('dir').toUpperCase() : '';
    if (col_name === sort_by) {
      if (dir === 'DESC') {
        return '▼';
      } else if (dir === 'ASC') {
        return '▲';
      }
    }
  })
});
