import { moduleForModel, test } from 'ember-qunit';

moduleForModel('openstack-deployment', 'Unit | Model | openstack deployment', {
  // Specify the other units that are required for this test.
  needs: []
});

test('it exists', function(assert) {
  let model = this.subject();
  // let store = this.store();
  assert.ok(!!model);
});

const validPresence = ['valid', '  valid', 'valid  '];
const validHostOrIp = ['192.168.2.0', '192.168.153.0', 'ValidHostName', 'Valid-Host-Name'];
const validFlavor = validPresence;
const validCount = [1, 999];
const validCidr = ['192.168.153.0/1', '192.168.153.0/32', '0.0.0.0/1', '255.255.255.255/32'];
const validIpAddress = ['192.168.2.0', '192.168.153.0'];

const validFieldHash = {
  undercloud_admin_password: validPresence,
  undercloud_ip_address: validHostOrIp,
  undercloud_ssh_username: validPresence,
  undercloud_ssh_password: validPresence,
  overcloud_node_count: [2, 999],
  overcloud_compute_flavor: validFlavor,
  overcloud_compute_count: validCount,
  overcloud_controller_flavor: validFlavor,
  overcloud_controller_count: validCount,
  overcloud_ext_net_interface: validPresence,
  overcloud_private_net: validCidr,
  overcloud_float_net: validCidr,
  overcloud_float_gateway: validIpAddress,
  overcloud_password: validPresence
};

const invalidPresence = ['', null, undefined];
const invalidHostOrIp = invalidPresence.concat([
  '8.8.8.256/24',
  'spaces invalid',
  'underscores_are_invalid',
  'special%chars',
  '.startsWithPeriod']);
const invalidFlavor = invalidPresence.concat('baremetal');
const invalidCount = invalidPresence.concat(0, -1);
const invalidCidr = invalidPresence.concat([
  'garbage',
  '8.8.8.0',
  '8.8.8.x/24',
  '8.8.8.0/33',
  '8.8.8.256/24',
  '8.8.256.8/24',
  '8.256.8.8/24',
  '256.8.8.8/24',
  '8.8.8.0/./24',
  '8.8.8/24',
  '8.8.8.8//24',
  '8.8.8.8.8/24'
]);
const invalidIpAddress = invalidPresence.concat([
  '192.168.2.2000',
  '192.162.257',
  'garbage192.168.1.2',
  '192.168.1.2/24',
  '192.168.1.2/',
  '192.168.1.2postfix'
]);

const invalidFieldHash = {
  undercloud_admin_password: invalidPresence,
  undercloud_ip_address: invalidHostOrIp,
  undercloud_ssh_username: invalidPresence,
  undercloud_ssh_password: invalidPresence,
  overcloud_node_count: invalidPresence.concat(1, 0, -1),
  overcloud_compute_flavor: invalidFlavor,
  overcloud_compute_count: invalidCount,
  overcloud_controller_flavor: invalidFlavor,
  overcloud_controller_count: invalidCount,
  overcloud_ext_net_interface: invalidPresence,
  overcloud_private_net: invalidCidr,
  overcloud_float_net: invalidCidr,
  overcloud_float_gateway: invalidIpAddress,
  overcloud_password: invalidPresence
};

test ('validateField(fieldName) should be true when data is valid', function(assert){
  let fieldName;
  const model = this.subject();
  const checkFieldValidation = value => {
    Ember.run(() => model.set(fieldName , value));
    assert.ok(model.validateField(fieldName), `${fieldName}: ${value} was not accepted as valid`);
  };

  for (fieldName in validFieldHash) {
    let validValues = validFieldHash[fieldName];
    validValues.forEach(checkFieldValidation);
  }
});

test ('validateField(fieldName) should be false when data is invalid', function(assert){
  let fieldName;
  const model = this.subject();
  const checkFieldValidation = value => {
    Ember.run(() => model.set(fieldName , value));
    assert.notOk(model.validateField(fieldName), `${fieldName}: ${value} was not rejected as invalid`);
  };

  for (fieldName in invalidFieldHash) {
    let invalidValues = invalidFieldHash[fieldName];
    invalidValues.forEach(checkFieldValidation);
  }
});

const validOpenstackDeploymentFields = {
  undercloud_admin_password: 'changeme',
  undercloud_ip_address: '192.168.234.254',
  undercloud_ssh_username: 'root',
  undercloud_ssh_password: 'vagrant',

  overcloud_address: null,
  overcloud_ext_net_interface: 'nic2',
  overcloud_private_net: '192.168.254.0/24',
  overcloud_float_net: '192.168.253.0/24',
  overcloud_float_gateway: '192.168.253.1',
  overcloud_password: 'changeme',
  overcloud_libvirt_type: 'kvm',

  overcloud_node_count: 2,
  overcloud_compute_flavor: 'Flavor-16-x86_64-16384-99',
  overcloud_compute_count: 1,
  overcloud_controller_flavor: 'Flavor-16-x86_64-16384-99',
  overcloud_controller_count: 1,
  overcloud_ceph_storage_flavor: null,
  overcloud_ceph_storage_count: null,
  overcloud_block_storage_flavor: null,
  overcloud_block_storage_count: null,
  overcloud_object_storage_flavor: null,
  overcloud_object_storage_count: null,

  overcloud_hostname: null,
  undercloud_hostname: null
};

test ('isUndercloudDeployed should be true when relevant fields are valid', function(assert){
  const model = this.subject(validOpenstackDeploymentFields);
  assert.ok(model.get('isUndercloudDeployed'));
});

test ('isUndercloudDeployed should be false when relevant fields are invalid', function(assert){
  const model = this.subject(validOpenstackDeploymentFields);
  [
    'undercloud_admin_password',
    'undercloud_ip_address',
    'undercloud_ssh_username',
    'undercloud_ssh_password'
  ].forEach(fieldName => {
    let originalValue = model.get(fieldName);
    Ember.run(() => model.set(fieldName, null));
    assert.notOk(model.get('isUndercloudDeployed'), `isUndercloudDeployed was true when ${fieldName}: null`);
    Ember.run(() => model.set(fieldName, originalValue));
  });
});

test ('areNodesRegistered should be true when relevant fields are valid', function(assert){
  const model = this.subject(validOpenstackDeploymentFields);
  assert.ok(model.get('areNodesRegistered'));
});

test ('areNodesRegistered should be false when relevant fields are invalid', function(assert){
  const model = this.subject(validOpenstackDeploymentFields);
  Ember.run(() => model.set('overcloud_node_count' , 0));
  assert.notOk(model.get('areNodesRegistered'));
});


test ('hasValidNodeAssignments should be true when relevant fields are valid', function(assert){
  const model = this.subject(validOpenstackDeploymentFields);
  assert.ok(model.get('hasValidNodeAssignments'));
});

test ('hasValidNodeAssignments should be false when relevant fields are invalid', function(assert){
  const model = this.subject(validOpenstackDeploymentFields);
  [
    'overcloud_compute_flavor',
    'overcloud_compute_count',
    'overcloud_controller_flavor',
    'overcloud_controller_count'
  ].forEach(fieldName => {
    let originalValue = model.get(fieldName);
    Ember.run(() => model.set(fieldName, null));
    assert.notOk(model.get('hasValidNodeAssignments'), `hasValidNodeAssignments was true when ${fieldName}: null`);
    Ember.run(() => model.set(fieldName, originalValue));
  });
});


test ('isValidOvercloud should be true when relevant fields are valid', function(assert){
  const model = this.subject(validOpenstackDeploymentFields);
  assert.ok(model.get('isValidOvercloud'));
});

test ('isValidOvercloud should be false when relevant fields are invalid', function(assert){
  const model = this.subject(validOpenstackDeploymentFields);
  [
    'overcloud_ext_net_interface',
    'overcloud_private_net',
    'overcloud_float_net',
    'overcloud_float_gateway',
    'overcloud_password'
  ].forEach(fieldName => {
    let originalValue = model.get(fieldName);
    Ember.run(() => model.set(fieldName, null));
    assert.notOk(model.get('isValidOvercloud'), `isValidOvercloud was true when ${fieldName}: null`);
    Ember.run(() => model.set(fieldName, originalValue));
  });
});

test ('areAllAttributesValid should be true when relevant fields are valid', function(assert){
  const model = this.subject(validOpenstackDeploymentFields);
  assert.ok(model.get('areAllAttributesValid'));
});

test('areAllAttributesValid should be false when any field is invalid', function (assert) {
  const model = this.subject(validOpenstackDeploymentFields);
  [
    'undercloud_admin_password',
    'undercloud_ip_address',
    'undercloud_ssh_username',
    'undercloud_ssh_password',
    'overcloud_compute_flavor',
    'overcloud_compute_count',
    'overcloud_controller_flavor',
    'overcloud_controller_count',
    'overcloud_ext_net_interface',
    'overcloud_private_net',
    'overcloud_float_net',
    'overcloud_float_gateway',
    'overcloud_password'
  ].forEach(fieldName => {
    let originalValue = model.get(fieldName);
    Ember.run(() => model.set(fieldName, null));
    assert.notOk(model.get('areAllAttributesValid'));
    Ember.run(() => model.set(fieldName, originalValue));
  });
});
