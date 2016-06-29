import Ember from 'ember';

export default Ember.Component.extend({

  editRoleTitle: Ember.computed('editedRole.label', function() {
    return "Edit Deployment Role - " + this.get('editedRole.label');
  }),

  profileOptions: Ember.computed('profiles.[]', function() {
    let options = [Ember.Object.create({name: 'baremetal'})];
    let profiles = this.get('profiles');
    if (profiles) {
      this.get('profiles').forEach(profile => options.pushObject(profile));
    }
    return options;
  }),

  matchingNodeCount: Ember.computed('editedRoleProfile', 'nodes.[]', 'profiles.[]', function () {
    let profiles = this.get('profiles');
    if (!profiles) {
      return 0;
    }

    let profile = profiles.findBy('name', this.get('editedRoleProfile'));
    if (!profile) {
      return 0;
    }

    return profile.matchingNodeCount(this.get('nodes'));
  }),

  roleNodeCountOptions: Ember.computed('matchingNodeCount', function() {
    let options = [];
    let maxNodes = this.get('matchingNodeCount');

    for (let i = 0; i <= maxNodes; i++) {
      options.pushObject(i);
    }

    return options;
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
