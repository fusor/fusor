import { moduleForModel, test } from 'ember-qunit';

moduleForModel('subscription', 'Unit | Model | subscription', {
  // Specify the other units that are required for this test.
  needs: ['model:deployment', 'model:organization', 'model:lifecycle-environment', 'model:discovered-host']
});

