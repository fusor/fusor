import Ember from 'ember';
import TextareaF from "../mixins/textarea-f-mixin";

export default Ember.Component.extend(TextareaF, {

  rowsPassed: Ember.computed('rows', function() {
    if(this.get('rows')) {
      if (this.get('rows') > 0) {
        return true;
      }
    }
  })
});
