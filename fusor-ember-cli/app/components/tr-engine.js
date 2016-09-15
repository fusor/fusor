import Ember from 'ember';
import TrEngineHypervisorMixin from "../mixins/tr-engine-hypervisor-mixin";

export default Ember.Component.extend(TrEngineHypervisorMixin, {

  isSelectedAsEngine: Ember.computed('host', 'selectedRhevEngineHost', function() {
    if (this.get('selectedRhevEngineHost')) {
      return (this.get('selectedRhevEngineHost.id') === this.get('host.id'));
    }
  }),

  isHypervisorOrStarted: Ember.computed('host', 'hypervisorModelIds.[]', 'isStarted', function() {
    let hypervisorIds = this.get('hypervisorModelIds');
    let isHypervisor = hypervisorIds && hypervisorIds.contains(this.get('host.id'));
    let isStarted = this.get('isStarted');
    return isHypervisor || isStarted;
  }),

  isChecked: Ember.computed('isSelectedAsEngine', function () {
    return this.get('isSelectedAsEngine');
  }),

  actions: {
    engineHostChanged(host) {
      this.sendAction("action", host, this.get('isInvalidHostname'));
    }
  }
});
