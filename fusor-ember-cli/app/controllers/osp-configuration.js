import Ember from 'ember';

export default Ember.Controller.extend({
  tenantType: 'vxlan',
  corePlugin: 'ml2',
  glanceBackend: 'local',
  cinderBackend: 'NFS',
});
