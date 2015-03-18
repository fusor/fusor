import Ember from 'ember';

export default Ember.Component.extend({

  isChecked: function () {
    return (this.get('selectedOrganization') == this.get('org'));
  }.property('selectedOrganization', 'org'),

  actions: {
    organizationChanged: function(event) {
      this.sendAction('action', this.get('org'));
    }
  }

});
