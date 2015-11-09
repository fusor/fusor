import Ember from 'ember';

export default Ember.Component.extend({

  typeInput: Ember.computed('type', function() {
    return (this.get('type') ? this.get('type') : 'text');
  }),

  actions: {
     showErrors: function() {
       this.set("showError", true);
     }
   }

});
