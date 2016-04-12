import Ember from 'ember';

export default Ember.Component.extend({

  tagName: 'div',
  classNames: ['row env-summary-needed-available'],

  percentProgress: Ember.computed('needed', 'available', function() {
    return parseInt(parseInt(this.get('needed')) / parseInt(this.get('available')) * 100);
  }),

  percentProgressMax: Ember.computed('percentProgress', function () {
    var percentProgress = this.get('percentProgress') > 100 ? 100 : this.get('percentProgress');
    return parseInt(percentProgress);
  }),

  styleWidth: Ember.computed('percentProgressMax', function () {
    return new Ember.Handlebars.SafeString(this.get('percentProgressMax') + '%');
  }),

  progressBarClass: Ember.computed('percentProgress', function() {
    var percent = this.get('percentProgress');
    if (percent < 100) {
      return 'progress-bar progress-bar-gray';
    } else if (percent === 100) {
      return 'progress-bar progress-bar-black';
    } else if (percent > 100) {
      return 'progress-bar progress-bar-danger';
    } else {
      return 'progress-bar';
    }
  }),

  fontColorClass: Ember.computed('percentProgress', function() {
    if (this.get('percentProgress') > 99) {
      return 'white';
    } else {
      return 'black';
    }
  }),

  isMaxAmount: Ember.computed('percentProgress', function() {
    return (this.get('percentProgress') === 100);
  }),

  isOverCapacity: Ember.computed('percentProgress', function() {
    return (this.get('percentProgress') > 100);
  }),

  helpText: Ember.computed('isOverCapacity', 'isMaxAmount', function() {
    if (this.get('isOverCapacity')) {
      return "Too much " + this.get('label') + " assigned";
    } else if (this.get('isMaxAmount')) {
      return "Maximum amount of " + this.get('label') + " assigned";
    }
  }),

  showSubstractTooltip: Ember.computed('label', 'substractCfme', function() {
    return (this.get('label') === 'Disk' && this.get('substractCfme'));
  })

});
