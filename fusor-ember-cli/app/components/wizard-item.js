import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'li',

  classNameBindings: ['active', 'completed'],

  active: function () {
    return this.get('childViews').isAny('active');
  }.property('childViews.@each.active'),

  completed: function() {
    return (this.get('num') < this.get('currentStepNumber'));
  }.property('num', 'currentStepNumber'),

  // isReviewTab: function() {
  //   return (this.get('routeName') == 'review')
  // }.property('routeName')

});
