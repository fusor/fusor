import Ember from 'ember';

export default Ember.Component.extend({

  didInsertElement() {
    const $component = this.$();
    return $component.find('[data-toggle="popover"]').popover({
      html: false,
      trigger: 'focus hover',
      title: this.get('label'),
      placement: 'right',
      content: this.get('helpText')
    });
  },

  willDestroyElement() {
    return Ember.$('[data-toggle="popover"]').popover('destroy');
  },

  labelClassSize: Ember.computed(function () {
    return this.getWithDefault('labelSize', 'col-lg-2 col-md-3 col-sm-5');
  }),

  inputClassSize: Ember.computed(function () {
    return this.getWithDefault('inputSize', 'col-lg-4 col-md-6 col-sm-6');
  }),

  showUnits: Ember.computed('unitsLabel', function() {
    return !Ember.isBlank(this.get('unitsLabel'));
  }),

  showHelpPopover: Ember.computed('showHelpIndicator', function() {
    return !Ember.isBlank(this.get('helpText'));
  }),

  unitsClassSize: Ember.computed(function () {
    return this.getWithDefault('unitsSize', 'col-md-2');
  }),

  actions: {
    doNothing() {
      return false;
    }
  }
});
