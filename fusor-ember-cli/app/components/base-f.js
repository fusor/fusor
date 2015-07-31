import Ember from 'ember';

export default Ember.Component.extend({

  labelClassSize: function () {
    return this.getWithDefault('labelSize', 'col-md-2');
  }.property(),

  inputClassSize: function () {
    return this.getWithDefault('inputSize', 'col-md-4');
  }.property(),

  showUnits: function() {
    return !Ember.isBlank(this.get('unitsLabel'));
  }.property('unitsLabel'),

  showHelpPopover: function() {
    return !Ember.isBlank(this.get('helpText'));
  }.property('showHelpIndicator'),

  unitsClassSize: function () {
    return this.getWithDefault('unitsSize', 'col-md-2');
  }.property(),

  helpId: 'popover',

  didInsertElement: function() {
    this.set('helpId', 'popover_' + Math.floor((Math.random() * 100000)));
    var selector = '[data-toggle=' + this.get('helpId') + ']';
    var afterDisplayed = function() {
      PatternFly.popovers(selector);
    };
    Ember.run.later(afterDisplayed, 300);
  }

});
