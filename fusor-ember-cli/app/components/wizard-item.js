import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'li',

  classNameBindings: ['active', 'completed', 'future'],

  attributeBindings: ['dataToggle:data-toggle', 'dataPlacement:data-placement', 'title'],

  dataToggle: "tooltip",
  dataPlacement: "top",
  title: function() {
    return this.get('fullname');
  }.property('fullname'),

  active: function () {
    return this.get('childViews').isAny('active');
  }.property('childViews.@each.active'),

  completed: function() {
    return (!this.get('isDisabled') && !this.get('active'));
  }.property('isDisabled', 'active'),

  future: function() {
    return this.get('isDisabled');
  }.property('isDisabled'),

});
