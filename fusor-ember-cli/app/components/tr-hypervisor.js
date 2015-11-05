import Ember from 'ember';
import TrEngineHypervisorMixin from "../mixins/tr-engine-hypervisor-mixin";

export default Ember.Component.extend(TrEngineHypervisorMixin, {

  isChecked: function () {
    return this.get('isSelectedAsHypervisor');
  }.property('isSelectedAsHypervisor'),

  observeHostName: function() {
    if (this.get('isSelectedAsHypervisor')) {
      if (this.get('isCustomScheme') && (this.get('customPreprendName'))) {
        this.get('host').set('name', (this.get('customPreprendName') + this.get('num')));
      } else if (this.get('isHypervisorN')) {
        this.get('host').set('name', ('hypervisor' + this.get('num')));
      } else if (this.get('isMac')) {
        this.get('host').set('name', 'mac' + this.get('host').get('mac').replace(/:/g,''));
      } else {
        this.get('host').set('name', this.get('host.name'));
      }
      return this.send('saveHostname');
    }
  }.observes('isSelectedAsHypervisor', 'customPreprendName', 'isCustomScheme', 'isHypervisorN', 'isFreeform', 'isMac'),

  addOrRemoveHypervisor: function(){
    if (this.get('isSelectedAsHypervisor')) {
      this.get('model').addObject(this.get('host'));
    } else {
      this.get('model').removeObject(this.get('host'));
    }
  }.observes('isSelectedAsHypervisor'),

  isSelectedAsHypervisor: function () {
    if (this.get('selectedIds')) {
        return this.get('selectedIds').contains(this.get('host.id'));
    }
  }.property('selectedIds', 'host.id')

});

