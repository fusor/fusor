import Ember from 'ember';

export default Ember.Controller.extend({
  ha: 'compute',
  networking: 'neutron',
  messaging: 'rabbitmq',
  platform: 'rhel7',
  password: 'random',
  customRepos: null,
});
