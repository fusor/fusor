import Ember from 'ember';

export default Ember.Controller.extend({
  isChecked: false,

  registerOnParent: function() {
    this.send('registerToggle', this);
  }.on('init'),

});
