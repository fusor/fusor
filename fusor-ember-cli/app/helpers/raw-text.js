import Ember from 'ember';

export function rawText(input) {
  return new Handlebars.SafeString(input);
}

export default Ember.Handlebars.makeBoundHelper(rawText);

