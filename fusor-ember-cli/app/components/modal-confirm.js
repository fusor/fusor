import Ember from 'ember';

export default Ember.Component.extend({
  dismissButtonLabel: function () {
    return this.getWithDefault('dismissLabel', 'Close');
  }.property('dismissLabel'),
  okButtonLabel: function () {
    return this.getWithDefault('okLabel', 'Yes');
  }.property('okLabel'),

  actions: {
    ok: function() {
      this.$('.modal').modal('hide');
      this.sendAction('ok');
    }
  },

  show: function() {
    this.$('.modal').modal().on('hidden.bs.modal', function() {
      this.sendAction('close');
    }.bind(this));
  }.on('didInsertElement')

});
