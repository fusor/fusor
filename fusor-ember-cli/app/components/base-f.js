import Ember from 'ember';

export default Ember.Component.extend({

  didInsertElement: function(){
    return Ember.$('[data-toggle="popover"]').popover();
  },

  willDestroyElement: function(){
    return Ember.$('[data-toggle="popover"]').popover('destroy');
  },

  labelClassSize: function () {
    return this.getWithDefault('labelSize', 'col-lg-2 col-md-3 col-sm-5');
  }.property(),

  inputClassSize: function () {
    return this.getWithDefault('inputSize', 'col-lg-4 col-md-6 col-sm-7');
  }.property(),

  showUnits: function() {
    return !Ember.isBlank(this.get('unitsLabel'));
  }.property('unitsLabel'),

  showHelpPopover: function() {
    return !Ember.isBlank(this.get('helpText'));
  }.property('showHelpIndicator'),

  unitsClassSize: function () {
    return this.getWithDefault('unitsSize', 'col-md-2');
  }.property()
});
