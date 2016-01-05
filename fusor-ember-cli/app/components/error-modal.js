import Ember from 'ember';

export default Ember.Component.extend({
  openModal: false,
  errorMessage: '',
  okayCallback: null,
  didInsertElement() {
    Ember.run.scheduleOnce('afterRender', () => this.send('startListening'));
  },
  actions: {
    okay() {
      this.set('openModal', false);
      var okcb = this.get('okayCallback');
      if(okcb) { okcb(); }
    },
    startListening() {
      this.eventBus.on('displayErrorModal', (e) => {
        // Reset stale okayCallback
        if(this.get('okayCallback')) { this.set('okayCallback', null); }

        this.set('errorMessage', e.errorMessage);
        if(e.okayCallback) { this.set('okayCallback', e.okayCallback); }
        this.set('openModal', true);
      });
    },
    stopListening() {
      this.eventBus.off('displayErrorModal');
    }
  }
});
