import Ember from 'ember';

export default Ember.Component.extend({

  setIsDisabledCfme: function() {
    if (this.get('isRhev') || this.get('isOpenStack')) {
      return this.set('isDisabledCfme', false);
    } else {
      this.set('isCloudForms', false);
      return this.set('isDisabledCfme', true);
    }
  }.observes('isRhev', 'isOpenStack')

});
