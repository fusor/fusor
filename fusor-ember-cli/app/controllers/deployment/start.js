import Ember from 'ember';
import StartControllerMixin from "../../mixins/start-controller-mixin";
import NeedsDeploymentMixin from "../../mixins/needs-deployment-mixin";

export default Ember.Controller.extend(StartControllerMixin, NeedsDeploymentMixin, {

  isRhev: Ember.computed.alias("controllers.deployment.model.deploy_rhev"),
  isOpenStack: Ember.computed.alias("controllers.deployment.model.deploy_openstack"),
  isCloudForms: Ember.computed.alias("controllers.deployment.model.deploy_cfme"),
  isSubscriptions: Ember.computed.alias("controllers.deployment.model.isSubscriptions")

});
