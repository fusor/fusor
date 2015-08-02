import Ember from 'ember';
import TrEngineHypervisorMixin from "../mixins/tr-engine-hypervisor-mixin";

export default Ember.Component.extend(TrEngineHypervisorMixin, {

  isSelectedAsEngine: function() {
      if (this.get('selectedRhevEngineHost')) {
          return (this.get('selectedRhevEngineHost.id') === this.get('host.id'));
      }
  }.property('host', 'selectedRhevEngineHost'),

  isChecked: function () {
      return this.get('isSelectedAsEngine');
  }.property('isSelectedAsEngine'),

  actions: {
    engineHostChanged: function(host) {
      return this.sendAction("action", host);
    }
  }

});
