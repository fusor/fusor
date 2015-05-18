import Ember from 'ember';

export default Ember.Component.extend({

  tagName: 'tr',

  classNameBindings: ['bgColor'],

  systemType: function() {
    if (this.get('subscription.type') === "NORMAL") {
      return 'Physical';
    } else {
      return this.get('subscription.type');
    }
  }.property('subscription.type'),

  isChecked: function () {
    return this.get('subscription.isSelectedSubscription');
  }.property('subscription.isSelectedSubscription'),

  bgColor: function () {
    if (this.get('isChecked')) {
      return 'white-on-blue';
    }
  }.property('isChecked'),

  envCssId: function () {
    return ('env_' + this.get('env.id'));
  }.property('env'),

});
