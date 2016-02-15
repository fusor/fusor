import Ember from 'ember';
import { PresenceValidator, UniquenessValidator, AggregateValidator } from '../utils/validators';

export default Ember.Mixin.create({
  applicationController: Ember.inject.controller('application'),
  deployments: Ember.computed.alias('applicationController.model'),

  deploymentNameValidator: Ember.computed('deployments', 'model.id', function () {
    let otherNames = [], otherLabels = [], deploymentId = this.get('model.id');

    this.get('deployments').forEach((otherDeployment) => {
      let otherDeploymentId = otherDeployment.get('id');

      if (otherDeploymentId && deploymentId !== otherDeploymentId) {
        otherNames.pushObject(otherDeployment.get('name'));
        otherLabels.pushObject(otherDeployment.get('label'));
      }
    });

    let LabelValidator = UniquenessValidator.extend({
      isValid(value) {
        return this._super(this.labelize(value));
      },

      labelize(value) {
        return Ember.isPresent(value) ? value.replace(/([^a-z0-9_])/gi, '_') : '';
      },

      getMessages(value) {
        if (this.isValid(value)) {
          return [];
        }
        return [`generated label "${this.labelize(value)}" is not unique`];
      }
    });

    return AggregateValidator.create({
      validators: [
        PresenceValidator.create({}),
        UniquenessValidator.create({existingValues: otherNames}),
        LabelValidator.create({existingValues: otherLabels})
      ]
    });
  })
});
