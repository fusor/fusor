import Ember from 'ember';

export default Ember.ObjectController.extend({

  needs: ['deployment', 'hypervisor/discovered-host', 'engine/discovered-host'],

  allDiscoveredHosts: Ember.computed.alias("controllers.hypervisor/discovered-host.allDiscoveredHosts"),
  // same as controllers.deployment.discovered_hosts
  selectedRhevHypervisorHosts: Ember.computed.alias("controllers.hypervisor/discovered-host.model"),
  // same as controllers.deployment.discovered_host
  selectedRhevEngineHost: Ember.computed.alias("controllers.engine/discovered-host.model"),

  rhev_engine_hostname: Ember.computed.alias("controllers.deployment.rhev_engine_hostname"),

  isSelectedAsHypervisor: function () {
    if (this.get('selectedRhevHypervisorHosts')) {
      var selectedIds = this.get('selectedRhevHypervisorHosts').getEach("id")
      return selectedIds.contains(this.get('id'))
    } else {
      return false
    }
  }.property('allDiscoveredHosts'),

  isSelectedAsEngine: function () {
    return (this.get('selectedRhevEngineHost.id') === this.get('id'));
  }.property('selectedRhevEngineHost'),

  actions: {
    engineHostChanged: function(host) {
      var engine_hostname = host.get('name');
      var controller = this.get('controllers.deployment');
      return this.store.find('discovered-host', host.get('id')).then(function (result) {
        controller.set('rhev_engine_hostname', engine_hostname);
        return controller.set('discovered_host', result);
        //TODO save hostname on discovered host on save deploy
      });
    }
  }

});
