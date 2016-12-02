import Ember from 'ember';

export default Ember.Object.extend({
  init() {
    if (!this.get('nodes')) {
      this.set('nodes', []);
      this.set('nodeRequests', []);
    }
  },

  driverMatchesNode(node) {
    let nodeDriver = this.get('driver');

    if (nodeDriver !== this.get('driver')) {
      return false;
    }

    if (nodeDriver === 'pxe_ipmitool') {
      return node.get('driver_info.ipmi_address') === this.get('address') &&
        node.get('driver_info.ipmi_username') === this.get('username');
    }
    return  node.get('driver_info.ssh_address') === this.get('address') &&
      node.get('driver_info.ssh_username') === this.get('username');
  },

  setDriverInfoFromNode(node) {
    let nodeDriver = node.get('driver');

    this.set('driver', nodeDriver);

    if (nodeDriver === 'pxe_ipmitool') {
      this.set('address', node.get('driver_info.ipmi_address'));
      this.set('username', node.get('driver_info.ipmi_username'));
    } else {
      this.set('address', node.get('driver_info.ssh_address'));
      this.set('username', node.get('driver_info.ssh_username'));
    }
  },

  putNode(newNode) {
    let found = false;
    let nodes = this.get('nodes');

    for (let i = 0; i < nodes.length; i++) {
      let node = nodes[i];
      if (node.id === newNode.id) {
        nodes[i] = newNode;
        found = true;
      }
    }

    if (!found) {
      this.get('nodes').pushObject(newNode);
    }
  },

  putNodeRequest(newNodeRequest) {
    let found = false;
    let nodeRequests = this.get('nodeRequests');

    for (let i = 0; i < nodeRequests.length; i++) {
      let node = nodeRequests[i];
      if (node.get('address') === newNodeRequest.get('address')) {
        nodeRequests[i] = newNodeRequest;
        found = true;
      }
    }

    if (!found) {
      this.get('nodeRequests').pushObject(newNodeRequest);
    }
  },

  removeNode(node) {
    let nodes = this.get('nodes');
    if (this.driverMatchesNode(node)){
      this.set('nodes', nodes.without(node));
    }
  }
});
