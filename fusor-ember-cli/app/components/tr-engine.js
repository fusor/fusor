import Ember from 'ember';
import TrEngineHypervisorMixin from "../mixins/tr-engine-hypervisor-mixin";

export default Ember.Component.extend(TrEngineHypervisorMixin, {

  isSelectedAsEngine: Ember.computed('host', 'selectedRhevEngineHost', function() {
    if (this.get('selectedRhevEngineHost')) {
      return (this.get('selectedRhevEngineHost.id') === this.get('host.id'));
    }
  }),

  isHypervisor: Ember.computed('host', 'hypervisorModelIds.[]', function() {
    let hypervisorIds = this.get('hypervisorModelIds');
    return hypervisorIds && hypervisorIds.contains(this.get('host.id'));
  }),

  isHypervisorOrStarted: Ember.computed('isHypervisor', 'isStarted', function() {
    return this.get('isHypervisor') || this.get('isStarted');
  }),

  isChecked: Ember.computed('isSelectedAsEngine', function () {
    return this.get('isSelectedAsEngine');
  }),

  isSelectedAndNotStarted: Ember.computed('isSelectedAsEngine', 'isStarted', function() {
    return this.get('isSelectedAsEngine') && !this.get('isStarted');
  }),

  actions: {
    engineHostChanged(host) {
      this.sendAction("action", host, this.get('isInvalidHostname'));
    }
  }
});
