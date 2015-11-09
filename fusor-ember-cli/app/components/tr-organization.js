import Ember from 'ember';

export default Ember.Component.extend({

  tagName: 'tr',

  classNameBindings: ['bgColor'],

  isChecked: Ember.computed('selectedOrganization', 'org', function () {
    return (this.get('selectedOrganization') === this.get('org'));
  }),

  bgColor: Ember.computed('isChecked', function () {
    if (this.get('isChecked')) {
      return 'white-on-blue';
    }
  }),

  actions: {
    organizationChanged: function() {
      this.sendAction('action', this.get('org'));
    }
  }

});
