import Ember from 'ember';

export default Ember.Component.extend({

  tagName: 'tr',

  classNameBindings: ['bgColor'],

  isChecked: function () {
    return (this.get('selectedOrganization') === this.get('org'));
  }.property('selectedOrganization', 'org'),

  bgColor: function () {
    if (this.get('isChecked')) {
      return 'white-on-blue';
    }
  }.property('isChecked'),

  actions: {
    organizationChanged: function() {
      this.sendAction('action', this.get('org'));
    }
  }

});
