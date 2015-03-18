import Ember from 'ember';
import StartControllerMixin from "../../mixins/start-controller-mixin";

export default Ember.ObjectController.extend(StartControllerMixin, {

  needs: ['deployment'],

  isRhev: Ember.computed.alias("controllers.deployment.deploy_rhev"),
  isOpenStack: Ember.computed.alias("controllers.deployment.deploy_openstack"),
  isCloudForms: Ember.computed.alias("controllers.deployment.deploy_cfme"),

});
