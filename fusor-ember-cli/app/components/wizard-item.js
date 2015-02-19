import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'li',
  classNames: ['wizard-item'],

  classNameBindings: 'active',

  active: function () {
      return this.get('childViews.firstObject.active');
  }.property(),

  // isReviewTab: function() {
  //   return (this.get('routeName') == 'review')
  // }.property('routeName')
});
