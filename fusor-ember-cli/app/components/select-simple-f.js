import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    setValue(name) {
      this.sendAction('action', this.get('fieldName'), name);
    }
  }
});
