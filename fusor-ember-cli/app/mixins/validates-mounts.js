import Ember from 'ember';
import request from 'ic-ajax';

export default Ember.Mixin.create({
  fetchMountValidation(deployment_id, params) {
    return request({
      url: `/fusor/api/v21/deployments/${deployment_id}/check_mount_point`,
      type: 'GET',
      data: params,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-CSRF-Token': Ember.$('meta[name="csrf-token"]').attr('content')
      }
    });
  }
});
