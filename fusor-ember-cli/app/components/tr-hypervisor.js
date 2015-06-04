import Ember from 'ember';
import SaveHostnameMixin from "../mixins/save-hostname-mixin";

export default Ember.Component.extend(SaveHostnameMixin, {
  tagName: 'tr',

  classNameBindings: ['bgColor'],

  isChecked: function () {
    return this.get('host.isSelectedAsHypervisor');
  }.property('host.isSelectedAsHypervisor'),

  bgColor: function () {
    if (this.get('isChecked')) {
      return 'white-on-blue';
    }
  }.property('isChecked'),

  observeHostName: function() {
    if (this.get('host.isSelectedAsHypervisor')) {
      if (this.get('isCustomScheme') && (this.get('custom_preprend_name'))) {
        this.get('host').set('name', (this.get('custom_preprend_name') + this.get('num')));
      } else if (this.get('isHypervisorN')) {
        this.get('host').set('name', ('hypervisor' + this.get('num')));
      } else if (this.get('isMac')) {
        this.get('host').set('name', 'mac' + this.get('host').get('mac').replace(/:/g,''));
      } else {
        this.get('host').set('name', this.get('host.name'));
      }
      return this.send('saveHostname');
    }
  }.observes('host.isSelectedAsHypervisor', 'custom_preprend_name', 'isCustomScheme', 'isHypervisorN', 'isFreeform', 'isMac')

});
