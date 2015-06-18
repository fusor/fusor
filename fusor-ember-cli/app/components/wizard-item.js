import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'li',

  classNameBindings: ['active', 'completed', 'future'],

  active: function () {
    return this.get('childViews').isAny('active');
  }.property('childViews.@each.active'),

  completed: function() {
    return (!this.get('isDisabled') && !this.get('active'));
  }.property('isDisabled', 'active'),

  future: function() {
    return this.get('isDisabled');


  }.property('isDisabled'),

  // isReviewTab: function() {
  //   return (this.get('routeName') == 'review')
  // }.property('routeName')

});
