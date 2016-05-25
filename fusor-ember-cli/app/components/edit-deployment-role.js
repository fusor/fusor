import Ember from 'ember';

export default Ember.Component.extend({

  editRoleTitle: Ember.computed('editedRole.label', function() {
    return "Edit Deployment Role - " + this.get('editedRole.label');
  }),

  actions: {
    doShowSettings() {
      this.sendAction('doShowSettings');
    },
    doShowConfig() {
      this.sendAction('doShowConfig');
    },
    cancelEditRole() {
      this.set('openModal', false);
    },
    saveRole() {
      this.sendAction('saveRole');
    }
  }

});
