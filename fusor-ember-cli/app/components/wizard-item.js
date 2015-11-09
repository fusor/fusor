import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'li',

  classNameBindings: ['active', 'completed', 'future'],

  attributeBindings: ['dataToggle:data-toggle', 'dataPlacement:data-placement', 'title'],

  dataToggle: "tooltip",
  dataPlacement: "top",
  title: Ember.computed('fullname', function() {
    return this.get('fullname');
  }),

  active: Ember.computed('childViews.@each.active', function () {
    return this.get('childViews').isAny('active');
  }),

  completed: Ember.computed('isDisabled', 'active', function() {
    return (!this.get('isDisabled') && !this.get('active'));
  }),

  future: Ember.computed('isDisabled', function() {
    return this.get('isDisabled');
  })

});
