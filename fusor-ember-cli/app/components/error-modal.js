import Ember from 'ember';

export default Ember.Component.extend({
  errorMessage: '',
  okayCallback: null,
  didInsertElement() {
    Ember.run.scheduleOnce('afterRender', () => this.send('startListening'));
  },
  actions: {
    okay() {
      var okcb = this.get('okayCallback');
      if(okcb) { okcb(); }
    },
    startListening() {
      $(document).on('displayErrorModal', (e) => {
        this.set('errorMessage', e.errorMessage);
        if(e.okayCallback) { this.set('okayCallback', e.okayCallback); }

        // backdrop: 'static and keyboard: false will prevent user from
        // clicking out of the modal or using <Esc> to drop it.
        $('.error-modal').modal({
          show: 'true',
          backdrop: 'static',
          keyboard: false
        });
      });
    },
    stopListening() {
      $(document).off('displayErrorModal');
    }
  }
});
