import Ember from 'ember';
import _ from 'lodash/lodash';

export default Ember.Mixin.create({

  queryParams: {
    search: {
      refreshModel: true
    },
    page: {
      refreshModel: true
    },
    sort_by: {
      refreshModel: true
    },
    dir: {
      refreshModel: true
    }
  }

});
