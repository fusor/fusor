import Ember from 'ember';

export default Ember.Component.extend({

  actions: {
    closeModal() {
      this.set('openModal', false);
    },
    executeAbandonment() {
      this.set('openModal', false);
      this.get('targetObject').send('executeAbandonment');
    }
  }

});
