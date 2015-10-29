import Ember from 'ember';
import request from 'ic-ajax';
import ProgressBarMixin from "../mixins/progress-bar-mixin";

export default Ember.Controller.extend(ProgressBarMixin, {

  needs: ['deployment'],

  deploymentId: Ember.computed.alias("controllers.deployment.model.id"),
  deployment: Ember.computed.alias("controllers.deployment.model"),

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
  introspectionNodes: Ember.A(),

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

  preRegistered: 0,

  successNodesLength: function() {
    if (!this.get('introspectionInProgress')) {
      return 0;
    }
    return this.get('model.nodes.length') - this.get('preRegistered');
  }.property('model.nodes.[]', 'introspectionNodes.[]', 'preRegistered', 'introspectionInProgress'),

  nodeRegComplete: function() {
    return this.get('successNodesLength') + this.get('errorNodes.length');
  }.property('successNodesLength', 'errorNodes.[]'),

  nodeRegTotal: function() {
    var total = this.get('nodeRegComplete') + this.get('newNodes.length') + this.get('introspectionNodes.length');

    // During the initial registration process there is a node in limbo...
    if (this.get('initRegInProcess')) {
      total++;
    }

    return total;
  }.property('nodeRegComplete', 'newNodes.[]', 'introspectionNodes.[]', 'registrationInProgress', 'introspectionInProgress'),

  nodeRegPercentComplete: function() {
    var nodeRegTotal = this.get('nodeRegTotal');
    var nodeRegComplete = this.get('nodeRegComplete');
    var nodesIntrospection = this.get('introspectionNodes.length');

    var numSteps = nodeRegTotal * 4;
    var stepsComplete = (nodeRegComplete * 4) + (nodesIntrospection * 1);

    return Math.round(stepsComplete / numSteps * 100);
  }.property('nodeRegComplete', 'nodeRegTotal', 'newNodes.[]', 'introspectionNodes.[]'),

  noRegisteredNodes: function() {
      return (this.get('model.nodes.length') < 1);
  }.property('model.nodes.[]'),

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
  }.property("deployment.@each.introspection_tasks"),

  hasIntrospectionTasks: function() {
    return (this.get('introspectionTasks.length') > 0);
  }.property("introspectionTasks.[]"),

  actions: {
    refreshNodesAndFlavors: function() {
      // manually set manual rather than using this.get('model').reload() which looks at data store changes
      // since the nodes changes or db changes happened outside of ember-data.
      console.log('refreshing model.nodes and model.profiles');
      var deploymentId = this.get('deploymentId');
      var self = this;
      Ember.RSVP.hash({nodes: this.store.find('node', {deployment_id: deploymentId}),
                       profiles: this.store.find('flavor', {deployment_id: deploymentId})
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
          edittedNodes.pushObject(item);
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
        edittedNodes.pushObject(newNode);
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
      this.registerNewNodes();
    },

    cancelRegisterNodes: function() {
      this.closeRegDialog();
      this.set('edittedNodes', Ember.A());
      // Unpause if necessary
      if (this.get('registrationPaused'))
      {
        this.doNextNodeRegistration();
      }
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

  registerNewNodes: function() {
    var newNodes = this.get('newNodes');
    if (newNodes && newNodes.get('length') > 0) {
      if (!this.get('registrationInProgress'))
      {
        this.set('introspectionNodes', Ember.A());
        this.set('preRegistered', this.get('model.nodes.length'));
        this.doNextNodeRegistration();
      }
      else if (this.get('registrationPaused') || this.get('introspectionInProgress')) {
        this.doNextNodeRegistration();
      }
    }
  },

  updateAfterRegistration: function(resolve) {
    var self = this;
    var deploymentId = this.get('deploymentId');
    this.store.find('node', {deployment_id: deploymentId, reload: true}).then(function() {
      self.store.find('flavor', {deployment_id: deploymentId, reload: true}).then(function () {
        if (resolve) {
          resolve();
        }
      });
    });
  },

  doNextNodeRegistration: function(lastNode) {
    if (this.get('modalOpen')) {
      this.set('registrationPaused', true);
    } else {
      this.set('registrationPaused', false);

      var remaining = this.get('newNodes');
      if (remaining && remaining.get('length') > 0) {
        this.set('registrationInProgress', true);
        var lastIndex = remaining.get('length') - 1;
        var nextNode = remaining.objectAt(lastIndex);
        this.set('newNodes', remaining.slice(0, lastIndex));
        this.registerNode(nextNode);
      } else {
        var self = this;
        if (!self.get('introspectionInProgress')) {
          self.startCheckingNodeIntrospection();
        } else if (lastNode !== undefined) {
          self.checkNodeIntrospection(lastNode);
        }
      }
    }
  },

  startCheckingNodeIntrospection: function() {
    var self = this;
    var introspectionNodes = self.get('introspectionNodes');
    if (introspectionNodes.get('length') > 0) {
      self.set('introspectionInProgress', true);
      introspectionNodes.forEach(function(node) {
        self.checkNodeIntrospection(node);
      });
    }
    else
    {
      this.set('registrationInProgress', false);
    }
  },

  addIntrospectionNode: function(node) {
    var introspectionNodes = this.get('introspectionNodes');
    introspectionNodes.pushObject(node);
    this.set('introspectionNodes', introspectionNodes);
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
      }, function(reason) {
            reason = reason.jqXHR;
            self.set('initRegInProcess', false);
            node.errorMessage = node.ipAddress + ": " + self.getErrorMessageFromReason(reason);
            self.get('errorNodes').pushObject(node);
            self.doNextNodeRegistration();
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

  checkNodeIntrospection: function(node) {
    var self = this;

    var promiseFunction = function(resolve) {
      var checkForDone = function() {
        //ic-ajax request
        console.log('action: checkNodeIntrospection');
        console.log('GET /fusor/api/openstack/deployments/' + self.get('deploymentId') + '/nodes/' + node.uuid + '/ready');

        request({
          url: '/fusor/api/openstack/deployments/' + self.get('deploymentId') + '/nodes/' + node.uuid + '/ready',
          type: 'GET',
          contentType: 'application/json'
        }).then(function(results) {
            //refresh model if ready is true
            if (results.node.ready) {
              self.send('refreshNodesAndFlavors');
            }
            resolve({done: results.node.ready});
          },  function(results) {
                results = results.jqXHR;
                if (results.status === 0) {
                  // Known problem during introspection, return response is empty, keep trying
                  resolve({done: false});
                }
                else if (results.status === 500) {
                  var error = self.getErrorMessageFromReason(results);
                  if (error.indexOf('timeout') >= 0) {
                    resolve({done: false});
                  }
                  else {
                    resolve({done: true, errorResults: results});
                  }
                }
                else {
                  resolve({done: true, errorResults: results});
                }
              }
        );
      };

      Ember.run.later(checkForDone, 15 * 1000);
    };

    var fulfill = function(results) {
      if (results.done)
      {
        var introspectionNodes = self.get('introspectionNodes');
        introspectionNodes.removeObject(node);
        self.set('introspectionNodes', introspectionNodes);
        if (introspectionNodes.get('length') === 0 && self.get('newNodes.length') === 0) {
          self.set('registrationInProgress', false);
          self.set('introspectionInProgress', false);
        }

        if (results.errorResults) {
          var nodeID;
          if (node.driver === 'pxe_ssh' ) {
            nodeID = node.driver_info.ssh_address;
          }
          else if (node.driver === 'pxe_ipmitool')
          {
            nodeID = node.driver_info.ipmi_address;
          }
          node.errorMessage = nodeID + ": " + self.getErrorMessageFromReason(results.errorResults);
          node.isIntrospectionError = true;
          self.get('errorNodes').pushObject(node);
        }
        self.updateAfterRegistration();
      }
      else {
        var promise = new Ember.RSVP.Promise(promiseFunction);
        promise.then(fulfill);
      }
    };

    var promise = new Ember.RSVP.Promise(promiseFunction);
    promise.then(fulfill);
  }
});
