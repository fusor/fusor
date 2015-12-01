import Ember from 'ember';
import request from 'ic-ajax';

export default Ember.Route.extend({

  model() {
    return request('https://raw.githubusercontent.com/isratrade/fusor/readme/fusor-ember-cli/readme-demo.md');
  }
});
