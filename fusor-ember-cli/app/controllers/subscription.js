import Ember from 'ember';

export default Ember.ObjectController.extend({
  isChecked: false,

  registerOnParent: function() {
    this.send('registerToggle', this);
  }.on('init'),

});
