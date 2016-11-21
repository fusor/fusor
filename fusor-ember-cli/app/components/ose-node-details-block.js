import Ember from 'ember';
import {
  AllValidator,
  NumberValidator,
  IntegerValidator
} from '../utils/validators';

export default Ember.Component.extend({
  positiveIntegerValidator: AllValidator.create({
    validators: [
      IntegerValidator.create({}),
      NumberValidator.create({min: 1})
    ]
  }),
  numNodesDisplay: Ember.computed(
    'numNodes',
    'positiveIntegerValidator',
    function() {
      const numNodes = this.get('numNodes');
      const validator = this.get('positiveIntegerValidator');
      return validator.isValid(numNodes) ? numNodes : '?';
    }
  )
});
