import Ember from 'ember';
import NeedsDeploymentMixin from "../../../mixins/needs-deployment-mixin";

export default Ember.Controller.extend(NeedsDeploymentMixin, {

  actions: {
    scrollToEnd() {
      if (this.get('scrollToEndChecked')) {
        var logOutput = Ember.$('.form-control.log-output')[0];
        logOutput.scrollTop = logOutput.scrollHeight;
      }
    }
  }

});
