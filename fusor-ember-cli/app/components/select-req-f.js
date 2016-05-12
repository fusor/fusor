import Ember from 'ember';

Ember.SelectOption.reopen({
  attributeBindings: ['value', 'disabled'],
  disabled: function() {
    let content = this.get('content');
    return content.disabled || false;
  }.property('content')
});

export default Ember.Component.extend({
  // Requires: optionLabelPath, optionValuePath, prompt
  // Expects showValidationError to be bound to external property
  _content: Ember.computed('content', 'prompt', function() {
    let promptObj = Ember.Object.create({
      disabled: true,
      isPrompt: true
    });

    if(this.get('optValueIsOptLabel')) {
      promptObj.set(this.get('valueKey'), this.get('prompt'));
    } else {
      promptObj.set(this.get('labelKey'), this.get('prompt'));
      promptObj.set(this.get('valueKey'), null);
    }

    let wrappedContent = Ember.A([promptObj]);
    wrappedContent.pushObjects(this.get('content'));
    return wrappedContent;
  }),

  valueKey: Ember.computed('content', function() {
    let split = this.get('optionValuePath').split('.');
    return split[split.length-1];
  }),

  labelKey: Ember.computed('content', function() {
    let split = this.get('optionLabelPath').split('.');
    return split[split.length-1];
  }),

  optValueIsOptLabel: Ember.computed(
    'optionValuePath', 'optionLabelPath', function() {
      return this.get('optionValuePath') === this.get('optionLabelPath');
    }),

  valueIsPrompt: Ember.computed('value', function() {
    return this.get('value') === null || this.get('value.isPrompt');
  }),
  valueIsNotPrompt: Ember.computed.not('valueIsPrompt'),

  isInvalid: Ember.computed.not('isValid'),

  validationMessages: Ember.computed('value', function() {
    return [ 'must select an option' ];
  }),

  hasError: Ember.computed('showValidationError', 'errors.name', 'isInvalid',
    function() {
      return this.get('showValidationError') && this.get('isInvalid');
    }),

  showValidationError: false // Sane default if not bound to external property
});

