import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'button',
  classNames: ['btn btn-primary'],
  attributeBindings: ['disabled'],
  click: function() {
    this.sendAction();
  }
});
