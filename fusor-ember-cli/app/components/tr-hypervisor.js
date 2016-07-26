import Ember from 'ember';
import TrEngineHypervisorMixin from "../mixins/tr-engine-hypervisor-mixin";

export default Ember.Component.extend(TrEngineHypervisorMixin, {
  didInsertElement() {
    this.updateCheckbox();
  },

  isChecked: Ember.computed.alias('isSelectedAsHypervisor'),

  observeHostName: Ember.observer(
    'isSelectedAsHypervisor',
    'customPreprendName',
    'isCustomScheme',
    'isHypervisorN',
    'isFreeform',
    'isMac',
    function () {
      if (this.get('isSelectedAsHypervisor')) {
        if (this.get('isCustomScheme') && (this.get('customPreprendName'))) {
          this.get('host').set('name', (this.get('customPreprendName').trim() + this.get('num')));
        } else if (this.get('isHypervisorN')) {
          this.get('host').set('name', ('hypervisor' + this.get('num')));
        } else if (this.get('isMac')) {
          this.get('host').set('name', 'mac' + this.get('host').get('mac').replace(/:/g, ''));
        } else {
          this.get('host').set('name', this.get('host.name'));
        }
        this.send('saveHostname');
      }
    }
  ),

  checkboxObserver: Ember.observer('isSelectedAsHypervisor', function () {
    Ember.run.once(this, () => {
      let isSelected = this.get('isSelectedAsHypervisor');
      let host = this.get('host');
      let hostFound = this.get('model').contains(host);

      if (isSelected && !hostFound) {
        this.get('model').addObject(host);
      } else if (!isSelected && hostFound) {
        this.get('model').removeObject(host);
      }
    });
  }),

  modelObserver: Ember.observer('model.[]', function () {
    Ember.run.once(this, () => {
      this.updateCheckbox();
    });
  }),

  updateCheckbox() {
    let originalState = this.get('isSelectedAsHypervisor');
    let selectedIds = this.get('selectedIds');
    let isSelectedAsHypervisor = selectedIds && selectedIds.contains(this.get('host.id'));

    if (originalState !== isSelectedAsHypervisor) {
      this.set('isSelectedAsHypervisor', isSelectedAsHypervisor);
    }
  }
});
