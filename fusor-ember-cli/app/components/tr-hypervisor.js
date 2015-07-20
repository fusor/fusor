import Ember from 'ember';
import SaveHostnameMixin from "../mixins/save-hostname-mixin";

export default Ember.Component.extend(SaveHostnameMixin, {
  tagName: 'tr',

  classNameBindings: ['bgColor'],

  isChecked: function () {
    return this.get('isSelectedAsHypervisor');
  }.property('isSelectedAsHypervisor'),

  bgColor: function () {
    if (this.get('isChecked')) {
      return 'white-on-blue';
    }
  }.property('isChecked'),

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

  cssHostHostId: function () {
    return ('host_' + this.get('host.id'));
  }.property('host.id'),

  cssIdHostId: function () {
    return ('id_' + this.get('host.id'));
  }.property('host.id'),

  selectedIds: function () {
    return this.get('model').getEach("id");
  }.property('model.[]'),

  isSelectedAsHypervisor: function () {
      return this.get('selectedIds').contains(this.get('host.id'));
  }.property('selectedIds', 'host.id'),

  hostType: function() {
    if (this.get('host.is_virtual')) {
      return "Virtual";
    } else {
      return "Bare Metal";
    }
  }.property('host.is_virtual')

});
