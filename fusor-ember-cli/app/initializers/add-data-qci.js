import RadioButtonInput from 'ember-radio-button/components/radio-button-input';
import XSelect from 'emberx-select/components/x-select';
import BootstrapSwitch from 'ember-bootstrap-switch/components/bootstrap-switch';
import DraggableObject from 'ember-drag-drop/components/draggable-object';

export function initialize() {
  RadioButtonInput.reopen({
    init() {
      this._super();
      this.get('attributeBindings').pushObject('data-qci');
    }
  });

  XSelect.reopen({
    init() {
      this._super();
      this.get('attributeBindings').pushObject('data-qci');
    }
  });

  BootstrapSwitch.reopen({
    init() {
      this._super();
      this.get('attributeBindings').pushObject('data-qci');
    }
  });

  DraggableObject.reopen({
    init() {
      this._super();
      this.get('attributeBindings').pushObject('data-qci');
    }
  });

}

export default {
  name: 'add-data-qci',
  initialize
};
