import { moduleForModel, test } from 'ember-qunit';

moduleForModel('discovered-host', 'Unit | Model | discovered host', {
  // Specify the other units that are required for this test.
  needs: ['model:deployment', 'model:organization', 'model:lifecycle-environment', 'model:subscription']
});

