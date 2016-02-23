import Ember from 'ember';

import { MacAddressValidator } from  "../utils/validators";

export default Ember.Component.extend({
  macAddressValidator: MacAddressValidator.create({}),

  label: Ember.computed('index', function() {
    return this.get('index') === 0 ? 'MAC Address' : '';
  })
});
