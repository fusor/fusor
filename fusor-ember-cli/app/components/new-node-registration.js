import Ember from 'ember';
import request from 'ic-ajax';
import OspNodeForm from '../mixins/osp-node-form-mixin';

import {
  MacAddressValidator,
  PresenceValidator
} from  "../utils/validators";

export default Ember.Component.extend(OspNodeForm, {
  presenceValidator: PresenceValidator.create({}),
  resetErrorsMessageKey: 'new-node-registration.text-f:resetErrors',

  step: 1,
  detectNodesRequestNum: 0,
  csvInfo: [],
  csvErrors: [],

  newNodeTitle: Ember.computed('isStep1', function () {
    if (this.get('isStep1')) {
      return "Register Nodes";
    } else {
      return "Node Auto-detection";
    }
  }),

  isStep1: Ember.computed('step', function () {
    return this.get('step') === 1;
  }),

  isStep2: Ember.computed('step', function () {
    return this.get('step') === 2;
  }),

  isNewNodeMethodAuto: Ember.computed('registerNodesMethod', function () {
    return this.get('registerNodesMethod') === 'auto_detect';
  }),

  isNewNodeMethodCSV: Ember.computed('registerNodesMethod', function () {
    return this.get('registerNodesMethod') === 'csv_upload';
  }),

  isNewNodeMethodManual: Ember.computed('registerNodesMethod', function () {
    return this.get('registerNodesMethod') === 'manual';
  }),

  isPxeSsh: Ember.computed('nodeInfo.driver', function () {
    return this.get('nodeInfo.driver') === 'pxe_ssh';
  }),

  isIpmi: Ember.computed('nodeInfo.driver', function () {
    return this.get('nodeInfo.driver') === 'pxe_ipmitool';
  }),

  hasCsvInfo: Ember.computed('csvInfo.[]', function () {
    return Ember.isPresent(this.get('csvInfo'));
  }),

  hasCsvErrors: Ember.computed('csvErrors.[]', function () {
    return Ember.isPresent(this.get('csvErrors'));
  }),

  hasAutoDetectedNodesMultiMac: Ember.computed('autoDetectedNodesMultiMac.[]', function () {
    return this.get('autoDetectedNodesMultiMac.length') > 0;
  }),

  hasAutoDetectedNodesSingleMac: Ember.computed('autoDetectedNodesSingleMac.[]', function () {
    return this.get('autoDetectedNodesSingleMac.length') > 0;
  }),

  hasAutoDetectedNodes: Ember.computed('hasAutoDetectedNodesMultiMac', 'hasAutoDetectedNodesSingleMac', function () {
    return this.get('hasAutoDetectedNodesMultiMac') && this.get('hasAutoDetectedNodesSingleMac');
  }),

  noNodesDetected: Ember.computed('hasAutoDetectedNodes', 'detectNodesCanceled', function () {
    return !this.get('hasAutoDetectedNodes') && !this.get('detectNodesCanceled');
  }),

  numAutoDetectedNodesInvalidCount: Ember.computed(
    'autoDetectedNodesMultiMac.@each.value',
    'autoDetectedNodesMultiMac.@each.selected',
    'autoDetectedNodesSingleMac.@each.value',
    'autoDetectedNodesSingleMac.@each.selected',
    function () {
      return this.countAutoDetectedNodes(node => node.get('selected') && !Ember.isPresent(node.get('value')));
    }
  ),

  hasInvalidAutoDetectedNodes: Ember.computed('numAutoDetectedNodesInvalidCount', function () {
    return this.get('numAutoDetectedNodesInvalidCount') > 0;
  }),

  numAutoDetectedNodesDeselectedCount: Ember.computed(
    'autoDetectedNodesMultiMac.@each.selected',
    'autoDetectedNodesSingleMac.@each.selected',
    function () {
      return this.countAutoDetectedNodes(node => !node.get('selected'));
    }
  ),

  hasDeselectedAutoDetectedNodes: Ember.computed('numAutoDetectedNodesDeselectedCount', function () {
    return this.get('numAutoDetectedNodesDeselectedCount') > 0;
  }),

  numAutoDetectedNodesValidCount: Ember.computed(
    'autoDetectedNodesMultiMac.@each.value',
    'autoDetectedNodesMultiMac.@each.selected',
    'autoDetectedNodesSingleMac.@each.value',
    'autoDetectedNodesSingleMac.@each.selected',
    function () {
      return this.countAutoDetectedNodes(node => node.get('selected') && Ember.isPresent(node.get('value')));
    }
  ),

  countAutoDetectedNodes(matchFn) {
    let numMultiMacNodes = this.get('autoDetectedNodesMultiMac').reduce((prev, node) => prev + (matchFn(node) ? 1 : 0), 0);
    let numSingleMacNodes = this.get('autoDetectedNodesSingleMac').reduce((prev, node) => prev + (matchFn(node) ? 1 : 0), 0);

    return numMultiMacNodes + numSingleMacNodes;
  },

  hasValidAutoDetectedNodes: Ember.computed('numAutoDetectedNodesValidCount', function () {
    return this.get('numAutoDetectedNodesValidCount') > 0;
  }),

  selectedVendor: Ember.computed('isIpmi', 'ipmiVendor', 'virtVendor', function () {
    return this.get('isIpmi') ? this.get('ipmiVendor') : this.get('virtVendor');
  }),

  isValidAutoDetectInfo: Ember.computed(
    'registerNodesMethod',
    'nodeInfo.driver',
    'nodeInfo.vendor',
    'nodeInfo.address',
    'nodeInfo.username',
    'nodeInfo.password',
    function () {
      return this.get('registerNodesMethod') === 'auto_detect' &&
        Ember.isPresent(this.get('nodeInfo.driver')) &&
        Ember.isPresent(this.get('selectedVendor')) &&
        Ember.isPresent(this.get('nodeInfo.address')) &&
        Ember.isPresent(this.get('nodeInfo.username')) &&
        Ember.isPresent(this.get('nodeInfo.password')) &&
        this.get('hostAddressValidator').isValid(this.get('nodeInfo.address'));
    }),

  isValidNewNodeAuto: Ember.computed(
    'isValidAutoDetectInfo',
    'hasInvalidAutoDetectedNodes',
    'hasValidAutoDetectedNodes',
    function () {
      if (!this.get('isValidAutoDetectInfo')) {
        return false;
      }

      let macAddresses = this.get('nodeInfo.macAddresses');
      if (!macAddresses) {
        return false;
      }

      return this.get('hasValidAutoDetectedNodes') && !this.get('hasInvalidAutoDetectedNodes');
    }),

  isValidNewNodeCsv: Ember.computed('hasCsvInfo', 'hasCsvErrors', function () {
    return this.get('hasCsvInfo') && !this.get('hasCsvErrors');
  }),

  hasValidNodesForRegistration: Ember.computed('isValidNewNodeAuto', 'isValidNewNodeCsv', 'isValidNewNodeManual', function () {
    return this.get('isValidNewNodeAuto') || this.get('isValidNewNodeCsv') || this.get('isValidNewNodeManual');
  }),

  disableDetectNodesSubmit: Ember.computed.not('isValidAutoDetectInfo'),

  disableNewNodesSubmit: Ember.computed.not('hasValidNodesForRegistration'),

  onOpenModal: Ember.observer('openModal', function() {
    if (this.get('openModal')) {
      Ember.run.once(this, 'initInfo');
    }
  }),

  actions: {
    backStep() {
      this.set('step', 1);
    },

    addMacAddress() {
      this.get('nodeInfo.macAddresses').pushObject(Ember.Object.create({value: ''}));
    },

    submitRegisterNodes() {
      console.log('registerNodesMethod', this.get('registerNodesMethod'));

      let method = this.get('registerNodesMethod');

      if (method === 'manual') {
        this.sendAction('submitRegisterNodes', this.get('nodeInfo'));
      } else if (method === 'csv_upload') {
        this.get('csvInfo').forEach(nodeInfo => this.sendAction('submitRegisterNodes', nodeInfo));
      } else if (method === 'auto_detect') {
        this.prepAutoDetectNodeInfo();
        this.sendAction('submitRegisterNodes', this.get('nodeInfo'));
      }
      this.set('openModal', false);
    },

    cancelRegisterNodes() {
      this.set('openModal', false);
    },

    csvFileChosen() {
      this.parseCsvFile(this.getCSVFileInput());
    },

    submitDetectNodes() {
      this.detectNodes();
      this.set('step', 2);
    },

    cancelDetectNodes() {
      this.set('detectNodesCanceled', true);
      this.set('autoDetectNodesInProgress', false);
      this.set('detectNodesRequestNum', this.get('detectNodesRequestNum') + 1);
      this.set('autoDetectedNodesMultiMac', []);
      this.set('autoDetectedNodesSingleMac', []);
    }
  },

  initInfo() {
    this.eventBus.trigger(this.get('resetErrorsMessageKey'));
    this.set('registerNodesMethod', 'auto_detect');
    this.set('step', 1);

    this.set('nodeInfo', Ember.Object.create({
      vendor: null,
      driver: null,
      address: null,
      username: null,
      password: null,
      macAddresses: [Ember.Object.create({value: ''})]
    }));

    this.set('csvInfo', []);
    this.set('csvErrors', []);
    this.set('autoDetectedNodesMultiMac', []);
    this.set('autoDetectedNodesSingleMac', []);
  },

  detectNodes() {
    let nodeInfo = this.get('nodeInfo');
    let detectNodesRequestNum = this.get('detectNodesRequestNum') + 1;

    nodeInfo.set('address', nodeInfo.get('address').trim());
    nodeInfo.set('username', nodeInfo.get('username').trim());
    nodeInfo.set('vendor', this.get('selectedVendor'));

    this.set('autoDetectedNodesMultiMac', []);
    this.set('autoDetectedNodesSingleMac', []);
    this.set('detectNodesRequestNum', detectNodesRequestNum);

    let driverParams = {
      driver: nodeInfo.get('driver'),
      vendor: nodeInfo.get('vendor'),
      hostname: nodeInfo.get('address'),
      username: nodeInfo.get('username'),
      password: nodeInfo.get('password')
    };

    let url = `/fusor/api/openstack/deployments/${this.get('deployment.id')}/node_mac_addresses`;

    this.set('detectNodesCanceled', false);
    this.set('autoDetectNodesInProgress', true);

    return request({
      url: url,
      type: 'POST', //GET would expose password in a query param
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "X-CSRF-Token": Ember.$('meta[name="csrf-token"]').attr('content')
      },
      data: JSON.stringify(driverParams)
    }).then((result) => {
      if (detectNodesRequestNum === this.get('detectNodesRequestNum')) {
        this.updateAutoDetectedNodes(result.nodes);
        this.set('autoDetectNodesInProgress', false);
      }
    }, (error) => {
      console.log(error);
      if (detectNodesRequestNum === this.get('detectNodesRequestNum')) {
        this.set('detectNodesErrorMsg', `Unable to detect nodes. Failed with status code ${error.jqXHR.status}.`);
        this.set('autoDetectNodesInProgress', false);
      }
    });
  },

  updateAutoDetectedNodes(hostArray) {
    let autoDetectedNodesMultiMac = [];
    let autoDetectedNodesSingleMac = [];
    let usedMacs = this.getPortMacAddresses();

    hostArray.forEach(hostHash => {
      let host = Ember.Object.create({
        name: hostHash.hostname,
        macAddresses: hostHash.mac_addresses,
        selected: true
      });

      if (!this.autoDetectedNodeIsValid(host, usedMacs)) {
        return;
      }

      if (host.get('macAddresses.length') === 1) {
        host.set('value', host.get('macAddresses')[0]);
        autoDetectedNodesSingleMac.pushObject(host);
      } else if (host.get('macAddresses.length') > 1) {
        host.set('value', '');
        autoDetectedNodesMultiMac.pushObject(host);
      }
    });

    this.set('autoDetectedNodesMultiMac', autoDetectedNodesMultiMac);
    this.set('autoDetectedNodesSingleMac', autoDetectedNodesSingleMac);
  },

  autoDetectedNodeIsValid(host, usedMacs) {
    let hostMacs = host.get('macAddresses');

    if (!hostMacs) {
      return false;
    }

    for (let i = 0; i < hostMacs.length; i++) {
      if (usedMacs.contains(hostMacs[i])) {
        return false;
      }
    }

    return true;
  },

  prepAutoDetectNodeInfo() {
    let nodeInfo = this.get('nodeInfo');
    let macAddresses = this.get('autoDetectedNodesMultiMac').filter(node => node.get('selected'));

    this.get('autoDetectedNodesSingleMac').forEach(node => {
      if (node.get('selected')) {
        macAddresses.pushObject(node);
      }
    });

    nodeInfo.set('macAddresses', macAddresses);
    nodeInfo.set('vendor', this.get('selectedVendor'));
  },

  getCSVFileInput() {
    return Ember.$('#csvUploadInput')[0];
  },

  updloadCsvFile() {
    var uploadfile = this.getCSVFileInput();
    uploadfile.click();
  },

  parseCsvFile(fileInput) {
    let csvInfo = [];
    let csvErrors = [];
    let controller = this;
    let file = fileInput.files[0];
    let macAddressValidator = MacAddressValidator.create({});
    let usedMacs = this.getPortMacAddresses();


    if (file) {
      let reader = new FileReader();
      reader.onload = function () {
        var text = reader.result;
        var csvArray;

        try {
          csvArray = Ember.$.csv.toArrays(text);
        } catch (e) {
          console.log(e);
          controller.set('csvInfo', []);
          controller.set('csvErrors', [e.message]);
          return;
        }

        csvArray.forEach((row, rowIndex) => {
          if (!Array.isArray(row) || row.length < 5) {
            csvErrors.pushObject(`Row ${rowIndex + 1} Invalid row`);
            return;
          }

          if (row.length < 5) {
            csvErrors.pushObject(`Row ${rowIndex + 1} does not have enough fields (${row.length})`);
            return;
          }

          if (rowIndex === 0 && Ember.isPresent(row[0]) && row[0].toLowerCase().indexOf('driver') >= 0) {
            return;  //skip header row if present
          }

          let csvNode = Ember.Object.create({});
          let errorsFound = false;

          if (row[0].toLowerCase().indexOf('ssh') >= 0) {
            csvNode.set('driver', 'pxe_ssh');
          } else if (row[0].toLowerCase().indexOf('ipmi') >= 0) {
            csvNode.set('driver', 'pxe_ipmitool');
          } else {
            csvErrors.pushObject(`Row ${rowIndex + 1}, Column 1: "${row[0]}" is not a valid driver value`);
            errorsFound = true;
          }

          if (controller.get('hostAddressValidator').isValid(row[1])) {
            csvNode.set('address', row[1]);
          } else {
            csvErrors.pushObject(`Row ${rowIndex + 1}, Column 2: "${row[1]}" is not a valid host address`);
            errorsFound = true;
          }

          if (Ember.isPresent(row[2])) {
            csvNode.set('username', row[2]);
          } else {
            csvErrors.pushObject(`Row ${rowIndex + 1}, Column 3: "${row[2]}" is not a valid username`);
            errorsFound = true;
          }

          if (Ember.isPresent(row[3])) {
            csvNode.set('password', row[3]);
          } else {
            csvErrors.pushObject(`Row ${rowIndex + 1}, Column 4: "${row[3]}" is not a valid password`);
            errorsFound = true;
          }

          if (Ember.isBlank(row[4]) || macAddressValidator.isInvalid(row[4])) {
            csvErrors.pushObject(`Row ${rowIndex + 1}, Column 5 "${row[4]}" is not a valid MAC address`);
            errorsFound = true;
          } else if (usedMacs.contains(row[4].trim())) {
            csvErrors.pushObject(`Row ${rowIndex + 1}, Column 5 "${row[4]}" is not an available MAC address`);
            errorsFound = true;
          } else {
            csvNode.set('macAddresses', [Ember.Object.create({value: row[4]})]);
          }

          if (!errorsFound) {
            csvInfo.pushObject(csvNode);
            usedMacs.push(row[4].trim());
          }
        });

        controller.set('csvInfo', csvInfo);
        controller.set('csvErrors', csvErrors);
      };

      reader.onloadend = function () {
        if (reader.error) {
          console.log(reader.error.message);
          controller.set('csvErrors', [reader.error.message]);
        }
      };

      reader.readAsText(file);
    }
  }
});
