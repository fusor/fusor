import Ember from 'ember';
import ActiveLinkMixin from 'ember-cli-active-link-wrapper/mixins/active-link';

export default Ember.Component.extend(ActiveLinkMixin, {
  tagName: 'li',

  classNameBindings: ['completed'],

  attributeBindings: ['dataToggle:data-toggle', 'dataPlacement:data-placement', 'title'],

  dataToggle: "tooltip",
  dataPlacement: "top",
  title: Ember.computed('fullname', function() {
    return this.get('fullname');
  }),

  completed: Ember.computed('isDisabled', 'active', function() {
    return (!this.get('isDisabled') && !this.get('active'));
  }),

  // // code borrowed addon ember-cli-active-link-wrapper
  // // github.com/alexspeller/ember-cli-active-link-wrapper/blob/master/addon/components/active-link.js
  // childLinkViews: [],

  // active: Ember.computed('childLinkViews.@each.active', function() {
  //   return Ember.A(this.get('childLinkViews')).isAny('active');
  // }),

  // didRender: function() {
  //   Ember.run.schedule('afterRender', this, function() {
  //     var childLinkElements = this.$('a.ember-view');

  //     var childLinkViews = childLinkElements.toArray().map(view =>
  //       this._viewRegistry[view.id]
  //     );

  //     this.set('childLinkViews', childLinkViews);
  //   });
  // },

});
