import Ember from 'ember';

export default Ember.Component.extend({

  classNames: ['row'],

  actions: {
    saveAndCancelDeployment: function() {
      var self = this.get('targetObject');
      self.send('saveAndCancelDeployment');
      return self.set('closeModal', true);
    },

    cancelAndDeleteDeployment: function() {
      var self = this.get('targetObject');
      self.send('cancelAndDeleteDeployment');
      return self.set('closeModal', true);
    }

  }

});
