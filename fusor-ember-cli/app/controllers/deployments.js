import Ember from 'ember';
import PaginationControllerMixin from "../mixins/pagination-controller-mixin";

export default Ember.Controller.extend(PaginationControllerMixin, {

  filteredDeployments: Ember.computed('model', 'search', 'model.[]', function(){
    var search = this.get('search');
    var rx = new RegExp(search, 'gi');
    var model = this.get('model');

    if (model.get('length') > 1) {
      return model.filter(function(record) {
        if (Ember.isPresent(record.get('name'))) {
          return record.get('name').match(rx);
        }
      });
    } else {
      return model;
    }
  })

});
