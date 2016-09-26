import Ember from 'ember';
import PaginationRouteMixin from "../mixins/pagination-route-mixin";
import _ from 'lodash/lodash';

export default Ember.Route.extend(PaginationRouteMixin, {

  model(params) {
    // server-side deployments controller uses scoped search params[:order] for sorting
    let sort_by = params['sort_by'] || 'updated_at';
    let dir = params['dir'] || 'DESC';
    let page = params['page'] || 1;
    params['order'] = sort_by + ' ' + dir;
    let controller = this.controllerFor('deployments');
    return this.store.query('deployment', params);
  },

  setupController(controller, model) {
    controller.set('model', model);
    controller.set('totalCnt', model.get('meta.total'));
    controller.set('pageNumber', model.get('meta.page'));
    controller.set('totalPages', model.get('meta.total_pages'));
    controller.set('pageRange', _.range(1, model.get('meta.total_pages') + 1));
    controller.set('isLoading', false);
  },

  actions: {
    deleteDeployment(item) {
      let controller = this.controllerFor('deployments');
      let newTotalCnt = controller.get('totalCnt') - 1;
      return this.store.findRecord('deployment', item.get('id')).then(function(deployment) {
        deployment.deleteRecord();
        deployment.save().then(function(result) {
          controller.set('totalCnt', newTotalCnt);
        });
      });
    },

    willTransition() {
      this.controllerFor('deployment').set('backRouteNameOnSatIndex', 'deployments');
    }
  }

});
