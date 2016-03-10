import Ember from 'ember';
import StartControllerMixin from "../../mixins/start-controller-mixin";

export default Ember.Controller.extend(StartControllerMixin, {

  deploymentNewController: Ember.inject.controller('deployment-new'),

  isRhev: Ember.computed.alias("deploymentNewController.model.deploy_rhev"),
  isOpenStack: Ember.computed.alias("deploymentNewController.model.deploy_openstack"),
  isCloudForms: Ember.computed.alias("deploymentNewController.model.deploy_cfme"),
  isOpenShift: Ember.computed.alias("deploymentNewController.model.deploy_openshift"),
  isSubscriptions: Ember.computed.alias("deploymentNewController.isSubscriptions")

});
