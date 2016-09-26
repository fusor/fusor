import Ember from 'ember';
import {
  Validator,
  PresenceValidator,
  UniquenessValidator,
  LengthValidator,
  AllValidator
} from '../utils/validators';

export default Ember.Mixin.create({
  applicationController: Ember.inject.controller('application'),
  deployments: Ember.computed.alias('applicationController.model'),

  deploymentNameValidator: Ember.computed('deployments', 'model.id', 'model.deploy_openstack', function () {
    let otherNames = [], otherLabels = [];
    let deploymentId = this.get('model.id');
    let deployOpenStack = this.get('model.deploy_openstack');

    this.get('deployments').forEach((otherDeployment) => {
      let otherDeploymentId = otherDeployment.get('id');

      if (otherDeploymentId && deploymentId !== otherDeploymentId) {
        otherNames.pushObject(otherDeployment.get('name'));
        otherLabels.pushObject(otherDeployment.get('label'));
      }
    });

    let illegalDeploymentNames = deployOpenStack ? ['admin', 'openstack'] : [];

    let LegalValuesValidator = Validator.extend({
      isValid(value) {
        let illegalValues = this.get('illegalValues');

        if (Ember.isEmpty(value) || Ember.isEmpty(illegalValues)) {
          return true;
        }

        return !illegalValues.any(illegalValue => illegalValue === value.trim().toLowerCase());
      },

      getMessages(value) {
        if (this.isValid(value)) {
          return [];
        }
        return [`The name "${(value)}" is not allowed`];
      }
    });

    let LabelValidator = UniquenessValidator.extend({
      isValid(value) {
        return this._super(this.labelize(value));
      },

      labelize(value) {
        return Ember.isPresent(value) ? value.trim().toLowerCase().replace(/([^a-z0-9_])/gi, '_') : '';
      },

      getMessages(value) {
        if (this.isValid(value)) {
          return [];
        }
        return [`generated label "${this.labelize(value)}" is not unique`];
      }
    });

    return AllValidator.create({
      validators: [
        PresenceValidator.create({}),
        LegalValuesValidator.create({illegalValues: illegalDeploymentNames}),
        UniquenessValidator.create({existingValues: otherNames}),
        LengthValidator.create({max: 64}),
        LabelValidator.create({existingValues: otherLabels})
      ]
    });
  })
});
