import Ember from 'ember';
import DeploymentControllerMixin from "../mixins/deployment-controller-mixin";

export default Ember.Controller.extend(DeploymentControllerMixin, {

  needs: ['deployment'],

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
      architecture: null,
      cpu: 0,
      ram: 0,
      disk: 0,

      isActiveClass: 'inactive',
      isError: false,
      errorMessage: ''
    });

    this.Profile = Ember.Object.extend({
      init: function() {
        this._super();
        this.set('assignedNodes', []);
      },
      name: function() {
        if (!Ember.isEmpty(this.get('_name'))) {
          return this.get('name');
        }
        else {
          return this.get('cpu') + '_cpus_' + this.get('ram') + 'MB_Memory_' + this.get('disk') + 'GB_Disk';
        }
      }.property('_name', 'cpu', 'ram', 'disk'),

      assignedNodes: [],

      controllerNodes: 0,
      computeNodes: 0,
      blockNodes: 0,
      objectNodes: 0,

      cpu: 0,
      ram: 0,
      disk: 0,

      addNode: function(node) {
        this.get('assignedNodes').pushObject(node);
        console.log('Adding node number: '  + this.get('assignedNodes').length + ' to ' + this.get('name'));
      },

      totalNodes: function() {
        console.log(this.get('name') + "has " + this.get('assignedNodes').length + ' total nodes');
        return this.get('assignedNodes').length;
      }.property('assignedNodes', 'assignedNodes.length'),

      freeNodes: function() {
        return this.get('totalNodes') - this.get('controllerNodes') - this.get('computeNodes') - this.get('blockNodes') - this.get('objectNodes');
      }.property('totalNodes', 'controllerNodes', 'computeNodes', 'blockNodes', 'objectNodes'),

      isControl: function() {
        return this.get('controllerNodes') > 0;
      }.property('controllerNodes'),

      isCompute: function() {
        return this.get('computeNodes') > 0;
      }.property('computeNodes'),

      isBlockStorage: function() {
        return this.get('blockNodes') > 0;
      }.property('blockNodes'),

      isObjectStorage: function() {
        return this.get('objectNodes') > 0;
      }.property('objectNodes')
    });

  },

  newNodes: [],
  errorNodes: [],
  edittedNodes: [],

  drivers: ['IPMI Driver', 'PXE + SSH'],
  architectures: ['amd64', 'x86', 'x86_64'],
  selectedNode: null,


  registrationInProgress: false,
  registerNodesModalOpened: false,
  registerNodesModalClosed: true,
  modalOpen: false,
  uploadFile: null,

  registrationError: function() {
    return this.get('errorNodes').length > 0;
  }.property('errorNodes', 'errorNodes.length'),

  registrationErrorMessage: function() {
    var count = this.get('errorNodes').length;
    if (count === 1) {
      return '1 node not registered';
    }
    else if (count > 1) {
      return count + ' nodes not registered';
    }
    else {
      return '';
    }
  }.property('errorNodes.length'),

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
  }.property('errorNodes', 'errorNodes.length'),

  preRegistered: 0,
  nodeRegComplete: function() {
    return  this.get('model.nodes').length + this.get('errorNodes').length - this.get('preRegistered');
  }.property('model.nodes.length', 'errorNodes.length', 'preRegistered'),

  nodeRegTotal: function() {
    var total = this.get('nodeRegComplete') + this.get('newNodes').length;
    if (this.get('registrationInProgress') && !this.get('registrationPaused')) {
      total++;
    }
    return total;
  }.property('nodeRegComplete', 'newNodes.length', 'registrationInProgress', 'registrationPaused'),

  nodeRegPercentComplete: function() {
    var nodeRegComplete = this.get('nodeRegComplete');
    var nodeRegTotal = this.get('nodeRegTotal');
    return Math.round(nodeRegComplete / nodeRegTotal * 100);
  }.property('nodeRegComplete', 'nodeRegTotal'),

  noRegisteredNodes: function() {
      return (this.get('model.nodes').length < 1);
  }.property('model.nodes', 'model.nodes.length'),

  hasSelectedNode: function() {
    return this.get('selectedNode') != null;
  }.property('selectedNode'),

  nodeFormStyle:function() {
    if (this.get('edittedNodes').length > 0 && this.get('hasSelectedNode') === true)
    {
      return 'visibility:visible;';
    }
    else {
      return 'visibility:hidden;';
    }
  }.property('edittedNodes.length', 'hasSelectedNode'),

  updateNodeSelection: function(profile) {
    var oldSelection = this.get('selectedNode');
    if (oldSelection) {
      oldSelection.set('isActiveClass', 'inactive');
    }

    if (profile)
    {
      profile.set('isActiveClass', 'active');
    }
    this.set('selectedNode', profile);
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

  actions: {
    showNodeRegistrationModal: function() {
      var newNodes = this.get('newNodes');
      var errorNodes = this.get('errorNodes');
      var edittedNodes = this.get('edittedNodes');

      edittedNodes.setObjects(errorNodes);
      newNodes.forEach(function(item) {
        edittedNodes.pushObject(item);
      });

      // Always start with at least one profile
      if (edittedNodes.length === 0) {
        var newNode = this.Node.create({});
        edittedNodes.pushObject(newNode);
      }

      this.set('edittedNodes', edittedNodes);
      this.updateNodeSelection(edittedNodes[0]);
      this.openRegDialog();
    },

    registerNodes: function() {
      this.closeRegDialog();
      var edittedNodes = this.get('edittedNodes');
      var errorNodes = this.get('errorNodes');
      var newNodes = this.get('newNodes');
      edittedNodes.forEach(function(item) {
        item.isError = false;
        item.errorMessage = '';
        errorNodes.removeObject(item);
      });

      newNodes.setObjects(edittedNodes);
      this.set('edittedNodes', []);
      this.set('newNodes', newNodes);
      this.registerNewNodes();
    },

    cancelRegisterNodes: function() {
      this.closeRegDialog();
      this.set('edittedNodes', []);
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

    readCSVFile: function(file, fileInput) {
      var me = this;
      if (file) {
        var reader = new FileReader();
        reader.onload = function() {
          var text = reader.result;
          var data = $.csv.toArrays(text);
          var edittedNodes = me.get('edittedNodes');

          for (var row in data) {
            var node_data = data[row];
            if (Array.isArray(node_data) && node_data.length >=9) {
              var memory_mb = parseInt(node_data[0]);
              var local_gb = parseInt(node_data[1]);
              var cpus = parseInt(node_data[2]);
              var cpu_arch = node_data[3].trim();
              var driver = node_data[4].trim();
              var ipmi_address = node_data[5].trim();
              var ipmi_username = node_data[6].trim();
              var ipmi_password = node_data[7].trim();
              var mac_address = node_data[8].trim();

              var newNode = me.Node.create({
                driver: driver,
                ipAddress: ipmi_address,
                ipmiUsername: ipmi_username,
                ipmiPassword: ipmi_password,
                nicMacAddress: mac_address,
                architecture: cpu_arch,
                cpu: cpus,
                ram: memory_mb,
                disk: local_gb
              });
              edittedNodes.insertAt(0, newNode);
              me.updateNodeSelection(newNode);
            }
          }
          fileInput.value = null;
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
    var nodeCount = 0;
    var profiles = this.get('model.profiles');
    for (var i = 0; i < profiles.length; i++ ) {
      nodeCount += profiles[i].totalNodes;
    }
    return (nodeCount < 4);
  }.property('model.profiles', 'model.profiles.length'),

  registerNewNodes: function() {
    var newNodes = this.get('newNodes');
    if (newNodes && newNodes.length > 0) {
      if (!this.get('registrationInProgress'))
      {
        this.set('preRegistered', this.get('model.nodes.length'));
        this.doNextNodeRegistration();
      }
      else if (this.get('registrationPaused')) {
        this.doNextNodeRegistration();
      }
    }
  },

  doNextNodeRegistration: function() {
    if (this.get('modalOpen') === true) {
      this.set('registrationPaused', true);
    }
    else
    {
      this.set('registrationPaused', false);

      var remaining = this.get('newNodes');
      if (remaining && remaining.length > 0)
      {
        this.set('registrationInProgress', true);
        var lastIndex = remaining.length - 1;
        var nextNode = remaining[lastIndex];
        this.set('newNodes', remaining.slice(0, lastIndex));
        this.registerNode(nextNode);
      }
      else
      {
        this.set('registrationInProgress', false);
      }
    }
  },

  registerNode: function(node) {
    var me = this;
    var iterationCount = 0;

    var promiseFunction = function(resolve) {
      var checkForDone = function() {
        if (iterationCount === 1) {
          resolve(true);
        }
        else {
          resolve(false);
        }
      };

      Ember.run.later(checkForDone, 3000);
    };

    var fulfill = function(isDone) {
      if (isDone) {
        var randomPercent = Math.round(Math.random() * 100);
        if (randomPercent <= 5) {
          node.isError = true;
          node.errorMessage = node.get('name') + " was not registered: node username/password is invalid.";
        }
        else if (randomPercent <= 10) {
          node.isError = true;
          node.errorMessage = node.get('name') + " was not registered: node IP address is invalid.";
        }

        if (node.isError) {
          var errorNodes = me.get('errorNodes');
          errorNodes.pushObject(node);
          me.set('errorNodes', errorNodes);
        }
        else {
          var nodes = me.get('model.nodes');
          nodes.pushObject(node);
          var nodeProfiles = me.get('model.profiles');
          var assigned = false;
          var index = 0;
          while(!assigned && index < nodeProfiles.length) {
            var nextProfile = nodeProfiles[index++];
            if ((nextProfile.get('cpu') === node.get('cpu')) &&
                (nextProfile.get('ram') === node.get('ram')) &&
                (nextProfile.get('disk') === node.get('disk'))) {
              console.log("Adding to existing profile");
              nextProfile.addNode(node);
              assigned = true;
            }
          }
          if (!assigned) {
            var newProfile = me.Profile.create({
              cpu: node.get('cpu'),
              ram: node.get('ram'),
              disk: node.get('disk')
            });
            console.dir(node);
            console.log("New Profile has " + newProfile.get('totalNodes') + ' nodes assigned');
            console.log("Adding to new profile");
            newProfile.addNode(node);
            nodeProfiles.pushObject(newProfile);
          }
        }
        me.doNextNodeRegistration();
      }
      else {
        iterationCount++;
        var promise = new Ember.RSVP.Promise(promiseFunction);
        promise.then(fulfill);
      }
    };

    var promise = new Ember.RSVP.Promise(promiseFunction);
    promise.then(fulfill);
  }
});
