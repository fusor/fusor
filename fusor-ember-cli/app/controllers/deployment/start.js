import Ember from 'ember';
import StartControllerMixin from "../../mixins/start-controller-mixin";
import NeedsDeploymentMixin from "../../mixins/needs-deployment-mixin";

export default Ember.Controller.extend(StartControllerMixin, NeedsDeploymentMixin, {

  isRhev: Ember.computed.alias("deploymentController.model.deploy_rhev"),
  isOpenStack: Ember.computed.alias("deploymentController.model.deploy_openstack"),
  isCloudForms: Ember.computed.alias("deploymentController.model.deploy_cfme"),
  isOpenShift: Ember.computed.alias("deploymentController.model.deploy_openshift"),
  isSubscriptions: Ember.computed.alias("deploymentController.model.isSubscriptions")

});
