import Ember from 'ember';
import request from 'ic-ajax';

export default Ember.Mixin.create({
  postDiscoveredHostIds(deployment, hypervisorIds) {
    const token = Ember.$('meta[name="csrf-token"]').attr('content');
    return request({
      url: '/fusor/api/v21/deployments/' + deployment.get('id'),
      type: 'PUT',
      data: JSON.stringify({'deployment': { 'discovered_host_ids': hypervisorIds } }),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-CSRF-Token': token
      }
    }).then(() => deployment.reload()); // Reload to update models
  }
});
