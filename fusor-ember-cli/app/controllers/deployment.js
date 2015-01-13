import Ember from 'ember';

export default Ember.ObjectController.extend({
  needs: ['rhci', 'subscriptions', 'satellite/index'],

  isSatellite: Ember.computed.alias("controllers.rhci.isSatellite"),
  isRhev: Ember.computed.alias("controllers.rhci.isRhev"),
  isOpenStack: Ember.computed.alias("controllers.rhci.isOpenStack"),
  isCloudForms: Ember.computed.alias("controllers.rhci.isCloudForms"),

  nameRHCI: Ember.computed.alias("controllers.rhci.nameRHCI"),
  nameRhev: Ember.computed.alias("controllers.rhci.nameRhev"),
  nameOpenStack: Ember.computed.alias("controllers.rhci.nameOpenStack"),
  nameCloudForms: Ember.computed.alias("controllers.rhci.nameCloudForms"),
  nameSatellite: Ember.computed.alias("controllers.rhci.nameSatellite"),

  deploymentName: Ember.computed.alias("controllers.satellite/index.name"),

  disableReview: false, //Ember.computed.alias("controllers.subscriptions.disableNext"),
  stepNumberRhev: 2,

  stepNumberOpenstack: function() {
    if (this.get('isRhev')) {
      return '3';
    } else {
      return '2';
    }
  }.property('isRhev'),

  stepNumberCloudForms: function() {
    if (this.get('isRhev') && this.get('isOpenStack')) {
      return '4';
    } else if (this.get('isRhev') || this.get('isOpenStack'))  {
      return '3';
    } else {
      return '2';
    }
  }.property('isRhev', 'isOpenStack'),

  stepNumberReview: function() {
    if (this.get('isRhev') && this.get('isOpenStack') && this.get('isCloudForms')) {
      return '5';
    } else if ((this.get('isRhev') && this.get('isOpenStack')) || (this.get('isRhev') && this.get('isCloudForms')) ||  (this.get('isOpenStack') && this.get('isCloudForms')))  {
      return '4';
    } else if (this.get('isRhev') || this.get('isOpenStack') || this.get('isCloudForms')) {
      return '3';
    } else {
      return '2';
    }
  }.property('isRhev', 'isOpenStack', 'isCloudForms'),

});
