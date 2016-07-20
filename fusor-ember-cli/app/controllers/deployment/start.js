import Ember from 'ember';
import StartControllerMixin from "../../mixins/start-controller-mixin";
import NeedsDeploymentMixin from "../../mixins/needs-deployment-mixin";

export default Ember.Controller.extend(StartControllerMixin, NeedsDeploymentMixin, {
  isNew: false
});
