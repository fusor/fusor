// app/routes/application.js
import Ember from 'ember';
import ApplicationRouteMixin from 'simple-auth/mixins/application-route-mixin';

export default Ember.Route.extend(ApplicationRouteMixin, {

  beforeModel: function(transition) {
    if (!this.controllerFor('application').get('isEmberCliMode')) {
      return this.get('session').set('isAuthenticated', true);
    };
  },

  setupController: function(controller, model) {
    controller.set('model', model);

    // Ensure headers are set in ApplicationAdapter. TODO - Why can't adapter access session?
    var adapter = this.store.adapterFor('ApplicationAdapter');
    if (this.get('session.authType') == 'oAuth') {
      adapter.set('headers', { Authorization: 'Bearer ' + this.get('session.access_token') });
    } else if (this.get('session.authType') == 'Basic') {
      adapter.set('headers', { Authorization: 'Basic ' + this.get('session.basicAuthToken') });
    }
  },

  actions: {
    invalidateSession: function () {
      this.get('session').invalidate();
      return this.transitionTo('login');
    },

    notImplemented: function() {
      alert('This link is not implemented in the fusor-ember-cli prototype');
    },
    willImplement: function() {
      alert('Check back soon. This will be implemented soon.');
    },

    // OLD MODAL CODE MANUALLY NOT USING BS EMBER
    // showModal: function(controller_name) {
    //   this.render(controller_name, {
    //     into: 'application',
    //     outlet: 'modal'
    //   });
    // },
    // removeModal: function() {
    //   this.disconnectOutlet({
    //     outlet: 'modal',
    //     parentView: 'application'
    //   });
    // },

    //Submit the modal
    submit: function() {
      Bootstrap.NM.push('Successfully submitted modal', 'success');
      return Bootstrap.ModalManager.hide('myModal');
    },

    //Cancel the modal, we don't need to hide the model manually because we set {..., dismiss: 'modal'} on the button meta data
    cancel: function() {
      return Bootstrap.NM.push('Modal was cancelled', 'info');
    },

    //Show the modal
    showModal: function(name) {
      return Bootstrap.ModalManager.show(name);
    },

    //Show the modal
    showRHCIModal: function() {
      return Bootstrap.ModalManager.show('newRHCI');
    },

  }
});
