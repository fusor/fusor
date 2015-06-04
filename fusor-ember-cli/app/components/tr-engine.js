import Ember from 'ember';
import SaveHostnameMixin from "../mixins/save-hostname-mixin";

export default Ember.Component.extend(SaveHostnameMixin, {
  tagName: 'tr',

  classNameBindings: ['bgColor'],

  isChecked: function () {
    return this.get('host.isSelectedAsEngine');
  }.property('host.isSelectedAsEngine'),

  bgColor: function () {
    if (this.get('isChecked')) {
      return 'white-on-blue';
    }
  }.property('isChecked'),

  actions: {
    engineHostChanged: function(host) {
      var self = this.get('targetObject');
      var controller = self.get('controllers.deployment');
      return self.store.find('discovered-host', host.get('id')).then(function (result) {
        return controller.set('discovered_host', result);
      });
    },

  }

});
