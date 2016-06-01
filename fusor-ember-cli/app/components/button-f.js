import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'button',
  classNames: ['btn btn-primary next-button'],
  attributeBindings: ['disabled'],
  click() {
    this.sendAction();
  }
});
