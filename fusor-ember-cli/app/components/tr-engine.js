import Ember from 'ember';
import TrEngineHypervisorMixin from "../mixins/tr-engine-hypervisor-mixin";

export default Ember.Component.extend(TrEngineHypervisorMixin, {

  isSelectedAsEngine: Ember.computed('host', 'selectedRhevEngineHost', function() {
      if (this.get('selectedRhevEngineHost')) {
          return (this.get('selectedRhevEngineHost.id') === this.get('host.id'));
      }
  }),

  isChecked: Ember.computed('isSelectedAsEngine', function () {
      return this.get('isSelectedAsEngine');
  }),

  actions: {
    engineHostChanged(host) {
      return this.sendAction("action", host);
    }
  }

});
