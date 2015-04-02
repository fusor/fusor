import Ember from 'ember';
import StartControllerMixin from "../../mixins/start-controller-mixin";

export default Ember.ObjectController.extend(StartControllerMixin, {

  needs: ['deployment-new'],

  isRhev: Ember.computed.alias("controllers.deployment-new.deploy_rhev"),
  isOpenStack: Ember.computed.alias("controllers.deployment-new.deploy_openstack"),
  isCloudForms: Ember.computed.alias("controllers.deployment-new.deploy_cfme"),
  isSubscriptions: Ember.computed.alias("controllers.deployment-new.isSubscriptions"),

});
