import Ember from 'ember';
import SaveHostnameMixin from "../mixins/save-hostname-mixin";

export default Ember.Component.extend(SaveHostnameMixin, {
  tagName: 'tr',

});
