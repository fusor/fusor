import Ember from 'ember';
import request from 'ic-ajax';
import ProgressBarMixin from "../mixins/progress-bar-mixin";

export default Ember.Controller.extend(ProgressBarMixin, {

  deploymentController: Ember.inject.controller('deployment'),

  deploymentId: Ember.computed.alias("deploymentController.model.id"),
  deployment: Ember.computed.alias("deploymentController.model"),

  init: function() {
    this._super();
    this.Node = Ember.Object.extend({
      name: function () {
        var ipAddress = this.get('ipAddress');
        if (!Ember.isEmpty(ipAddress))
        {
          return ipAddress;
        }
        else
        {
          return 'Undefined node';
        }
      }.property('ipAddress'),
      driver: null,
      ipAddress: null,
      ipmiUsername: '',
      ipmiPassword: '',
      nicMacAddress: '',

      isSelected: false,
      isActiveClass: function() {
        if (this.get('isSelected') === true)
        {
          return 'active';
        }
        else
        {
          return 'inactive';
        }
      }.property('isSelected'),
      isError: false,
      errorMessage: ''
    });
  },

  newNodes: Ember.A(),
  errorNodes: Ember.A(),
  edittedNodes: Ember.A(),

  drivers: ['pxe_ipmitool', 'pxe_ssh'],
  selectedNode: null,


  registrationInProgress: false,
  initRegInProcess: false,
  introspectionInProgress: false,
  registerNodesModalOpened: false,
  registerNodesModalClosed: true,
  modalOpen: false,

  registrationError: function() {
    return this.get('errorNodes.length') > 0;
  }.property('errorNodes.[]'),

  registrationErrorMessage: function() {
    var count = this.get('errorNodes.length');
    if (count === 1) {
      return '1 node not registered';
    }
    else if (count > 1) {
      return count + ' nodes not registered';
    }
    else {
      return '';
    }
  }.property('errorNodes.[]'),

  registrationErrorTip: function() {
    var tip = '';
    var errorNodes = this.get('errorNodes');

    errorNodes.forEach(function(item, index) {
      if (index > 0) {
        tip += '\n';
      }
      tip += item.errorMessage;
    });
    return tip;
  }.property('errorNodes.[]'),

  noRegisteredNodes: function() {
      return (this.get('model.nodes.length') < 1);
  }.property('model.nodes.[]'),

  noProfiles: function() {
      return (this.get('model.profiles.length') < 1);
  }.property('model.profiles.[]'),

  hasSelectedNode: function() {
    return this.get('selectedNode') != null;
  }.property('selectedNode'),

  nodeFormStyle:function() {
    if (this.get('edittedNodes.length') > 0 && this.get('hasSelectedNode'))
    {
      return 'visibility:visible;';
    }
    else {
      return 'visibility:hidden;';
    }
  }.property('edittedNodes.[]', 'hasSelectedNode'),

  updateNodeSelection: function(node) {
    var oldSelection = this.get('selectedNode');
    if (oldSelection) {
      oldSelection.set('isSelected', false);
    }

    if (node)
    {
      node.set('isSelected', true);
    }
    this.set('selectedNode', node);
  },

  handleOutsideClick: function() {
    // do nothing, this overrides the closing of the dialog when clicked outside of it
  },

  openRegDialog: function() {
    this.set('registerNodesModalOpened', true);
    this.set('registerNodesModalClosed', false);
    this.set('modalOpen', true);
  },

  closeRegDialog: function() {
    this.set('registerNodesModalOpened', false);
    this.set('registerNodesModalClosed', true);
    this.set('modalOpen', false);
  },

  getCSVFileInput: function() {
    return $('#regNodesUploadFileInput')[0];
  },

  introspectionTasks: function() {
    return this.get('deployment.introspection_tasks');
  }.property("deployment.introspection_tasks.[]"),

  hasIntrospectionTasks: function() {
    return (this.get('introspectionTasks.length') > 0);
  }.property("deployment.introspection_tasks.[]"),

  intervalPolling: function() {
    return 10000; // overwrite mixin (5000) between refreshing (in ms)
  }.property().readOnly(),

  actions: {
    refreshNodesAndFlavors: function() {
      // manually set manual rather than using this.get('model').reload() which looks at data store changes
      // since the nodes changes or db changes happened outside of ember-data.
      console.log('refreshing model.nodes and model.profiles');
      var deploymentId = this.get('deploymentId');
      var self = this;
      Ember.RSVP.hash({nodes: this.store.query('node', {deployment_id: deploymentId}),
                       profiles: this.store.query('flavor', {deployment_id: deploymentId})
                     }).then(function(result) {
                         return self.set('model', result);
                     });
    },

    showNodeRegistrationModal: function() {
      // stop polling when opening the modal
      this.stopPolling();

      var newNodes = this.get('newNodes');
      var errorNodes = this.get('errorNodes');
      var edittedNodes = this.get('edittedNodes');

      edittedNodes.setObjects(newNodes);
      var savedErrors = Ember.A();
      errorNodes.forEach(function(item) {
        if (!item.isIntrospectionError) {
          edittedNodes.addObject(item);
        }
        else {
          savedErrors.push(item);
        }
      });
      this.set('errorNodes', savedErrors);

      // Always start with at least one profile
      if (edittedNodes.get('length') === 0) {
        var newNode = this.Node.create({});
        newNode.isDefault = true;
        edittedNodes.addObject(newNode);
      }

      this.set('edittedNodes', edittedNodes);
      this.updateNodeSelection(edittedNodes[0]);
      this.openRegDialog();
    },

    registerNodes: function() {
      this.closeRegDialog();
      // restart polling after closing modal
      this.startPolling();
      var edittedNodes = this.get('edittedNodes');
      var errorNodes = this.get('errorNodes');
      var newNodes = this.get('newNodes');
      edittedNodes.forEach(function(item) {
        item.isError = false;
        item.errorMessage = '';
        errorNodes.removeObject(item);
      });

      newNodes.setObjects(edittedNodes);
      this.set('edittedNodes', Ember.A());
      this.set('newNodes', newNodes);
      var my = this;
      newNodes.forEach(function(node) {
        my.registerNode(node);
      });
    },

    cancelRegisterNodes: function() {
      this.closeRegDialog();
      this.set('edittedNodes', Ember.A());
    },

    selectNode: function(node) {
      this.updateNodeSelection(node);
    },

    addNode: function() {
      var edittedNodes = this.get('edittedNodes');
      var newNode = this.Node.create({});
      edittedNodes.insertAt(0, newNode);
      this.updateNodeSelection(newNode);
    },

    removeNode: function(node) {
      var nodes = this.get('edittedNodes');
      nodes.removeObject(node);
      this.set('edittedNodes', nodes);

      if (this.get('selectedNode') === node) {
        this.updateNodeSelection(nodes[0]);
      }
    },

    updloadCsvFile: function() {
      var uploadfile = this.getCSVFileInput();
      uploadfile.click();
    },

    csvFileChosen: function() {
      var fileInput = this.getCSVFileInput();
      var file = fileInput.files[0];
      var self = this;
      if (file) {
        var reader = new FileReader();
        reader.onload = function() {
          var text = reader.result;
          var data = $.csv.toArrays(text);
          var edittedNodes = self.get('edittedNodes');
          // If the default added node is still listed, remove it
          if (edittedNodes.get('length') === 1 && edittedNodes[0].isDefault && Ember.isEmpty(edittedNodes[0].get('ipAddress'))) {
            edittedNodes.removeObject(edittedNodes[0]);
          }

          for (var row in data) {
            var node_data = data[row];
            if (Array.isArray(node_data) && node_data.length >=5) {
              var driver = node_data[0].trim();
              var ipmi_address = node_data[1].trim();
              var ipmi_username = node_data[2].trim();
              var ipmi_password = node_data[3].trim();
              var mac_address = node_data[4].trim();

              var newNode = self.Node.create({
                driver: driver,
                ipAddress: ipmi_address,
                ipmiUsername: ipmi_username,
                ipmiPassword: ipmi_password,
                nicMacAddress: mac_address,
              });
              edittedNodes.insertAt(0, newNode);
              self.updateNodeSelection(newNode);
            }
          }
        };
        reader.onloadend = function() {
          if (reader.error) {
            console.log(reader.error.message);
          }
        };

        reader.readAsText(file);
      }
    }
  },

  disableRegisterNodesNext: function() {
    var nodeCount = this.get('model.nodes.length');
    return (nodeCount < 2);
  }.property('model.nodes.[]'),

  updateAfterRegistration: function(resolve) {
    var self = this;
    var deploymentId = this.get('deploymentId');
    this.store.query('node', {deployment_id: deploymentId, reload: true}).then(function() {
      self.store.query('flavor', {deployment_id: deploymentId, reload: true}).then(function () {
        if (resolve) {
          resolve();
        }
      });
    });
  },

  registerNode: function(node) {
    var self = this;
    var driverInfo = {};
    if ( node.get('driver') === 'pxe_ssh' ) {
      driverInfo = {
        ssh_address: node.get('ipAddress'),
        ssh_username: node.get('ipmiUsername'),
        ssh_password: node.get('ipmiPassword'),
        ssh_virt_type: 'virsh',
        deploy_kernel: this.get('bmDeployKernelImage.id'),
        deploy_ramdisk: this.get('bmDeployRamdiskImage.id')
      };
    } else if (node.get('driver') === 'pxe_ipmitool')  {
      driverInfo = {
        ipmi_address: node.get('ipAddress'),
        ipmi_username: node.get('ipmiUsername'),
        ipmi_password: node.get('ipmiPassword'),
        deploy_kernel: this.get('bmDeployKernelImage.id'),
        deploy_ramdisk: this.get('bmDeployRamdiskImage.id')
      };
    }
    var createdNode = {
      driver: node.get('driver'),
      driver_info: driverInfo,
      properties: {
        capabilities: 'boot_option:local'
      },
      address: node.get('nicMacAddress')
    };
    var token = Ember.$('meta[name="csrf-token"]').attr('content');

    this.set('initRegInProcess', true);

    //ic-ajax request
    console.log('action: registerNode');
    console.log('POST /fusor/api/openstack/deployments/' + this.get('deploymentId') + '/nodes');
    request({
      url: '/fusor/api/openstack/deployments/' + this.get('deploymentId') + '/nodes',
      type: 'POST',
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "X-CSRF-Token": token,
      },
      data: JSON.stringify({ 'node': createdNode })
    }).then(function(result) {
        // node was added on the backend, but model.nodes needs to be freshed
        self.send('refreshNodesAndFlavors');
        self.set('initRegInProcess', false);
        //push task_id into data store
        var newTask = self.store.push('introspection-task', {
              id: (Math.floor(Math.random() * 1000000000)),
              task_id: result.id,
              deployment_id: self.get('deploymentId')
        });
        self.get('deployment.introspection_tasks').addObject(newTask);
      }, function(reason) {
            reason = reason.jqXHR;
            self.set('initRegInProcess', false);
            node.errorMessage = node.ipAddress + ": " + self.getErrorMessageFromReason(reason);
            self.get('errorNodes').addObject(node);
        }
    );
  },

  getErrorMessageFromReason: function(reason) {
    try {
      var displayMessage = reason.responseJSON.displayMessage;
      if (displayMessage.indexOf('{') >= 0 && displayMessage.indexOf('}') >= 1) {
        displayMessage = displayMessage.substring(displayMessage.indexOf('{'),displayMessage.indexOf('}') + 1) + "}";
        displayMessage = displayMessage.replace(/\\/g, "");
        displayMessage = displayMessage.replace(/"\{/g, "{");

        var errorObj = JSON.parse(displayMessage);
        displayMessage = errorObj.error_message.faultstring;
      }

      return displayMessage;
    }
    catch (e) {
      return reason.statusText;
    }
  },

});
