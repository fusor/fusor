import Ember from 'ember';
import ValidatedInput from "../mixins/validated-input-mixin";

export default Ember.Mixin.create(ValidatedInput, {

  numRows: Ember.computed('rows', function () {
    return this.getWithDefault('rows', '');
  }),

  numCols: Ember.computed('cols', function () {
    return this.getWithDefault('cols', '');
  }),

  spellcheckEnabled: Ember.computed('spellcheck', function() {
    return this.getWithDefault('spellcheck', true);
  })
});
