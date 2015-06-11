import Ember from 'ember';
import ProgressBarMixin from "../../../mixins/progress-bar-mixin";

export default Ember.Controller.extend(ProgressBarMixin, {

  needs: ['deployment'],

  isRhev: Ember.computed.alias("controllers.deployment.isRhev"),
  isOpenStack: Ember.computed.alias("controllers.deployment.isOpenStack"),
  isCloudForms: Ember.computed.alias("controllers.deployment.isCloudForms"),

  deploymentProductNames: function() {
    if (this.get('isRhev') && this.get('isOpenStack') && this.get('isCloudForms')) {
      return 'RHEV & CFME & RHELOSP';
    } else if (this.get('isRhev') && this.get('isCloudForms'))  {
      return 'RHEV & CFME';
    } else if (this.get('isOpenStack') && this.get('isCloudForms'))  {
      return 'RHELOSP & CFME';
    } else if (this.get('isRhev'))  {
      return 'RHEV';
    } else if (this.get('isOpenStack'))  {
      return 'RHELOSP';
    }
  }.property('isRhev', 'isOpenStack', 'isCloudForms'),

});
