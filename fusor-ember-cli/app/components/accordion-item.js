import Ember from 'ember';

export default Ember.Component.extend({
  isOpen: false,

  classNames: ['accordion-item'],

  actions: {
    openItem: function() {
      this.set('isOpen', this.toggleProperty('isOpen'));
    }
  }
});
