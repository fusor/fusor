import Ember from 'ember';

export default Ember.Component.extend({

  tagName: 'div',
  classNames: ['node-details'],

  customEditLabel: "Custom Edit",

  isEditMode: false,

  customEditLabel: Ember.computed('isEditMode', function() {
    return this.get('isEditMode') ? "Finish Editing" : "Custom Edit";
  }),

  actions: {
    editOseNodeDetails() {
      this.toggleProperty('isEditMode');
    }
  }

});
