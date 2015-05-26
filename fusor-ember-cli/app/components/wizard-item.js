import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'li',

  // classNames: ['completed'],
  classNameBindings: 'active',
  //TODO add completed

  active: function () {
//        return this.get('childViews').isAny('active');
      return this.get('childViews.firstObject.active');
  }.property('childViews.@each.active'),

});
