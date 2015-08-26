import Ember from 'ember';

export default Ember.Component.extend({

  isOpen: false,

  click: function() {
    this.set('isOpen', this.toggleProperty('isOpen'));
  }

});
