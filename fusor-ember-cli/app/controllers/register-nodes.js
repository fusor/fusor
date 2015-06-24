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

    this.Profile = Ember.Object.extend({
      init: function() {
        this._super();
        this.set('assignedNodes', []);
        this.set('assignedRoles', []);
      },
      name: function() {
        if (!Ember.isEmpty(this.get('_name'))) {
          return this.get('name');
        }
        else {
          return this.get('cpu') + '_cpus_' + this.get('ram') + 'MB_Memory_' + this.get('disk') + 'GB_Disk';
        }
      }.property('_name', 'cpu', 'ram', 'disk'),

      cpu: 0,
      ram: 0,
      disk: 0,

      assignedNodes: [],
      assignedRoles: [],

      assignRole: function(role) {
        var assignedRoles = this.getWithDefault('assignedRoles', []);
        assignedRoles.pushObject(role);
      },

      unassignRole: function(role) {
        var assignedRoles = this.getWithDefault('assignedRoles', []);
        var newRoles = [];
        var roleType = role.get('roleType');

        for (var i = 0; i<assignedRoles.length; i++) {
          if (assignedRoles[i].roleType !== role.roleType) {
            newRoles.pushObject(assignedRoles[i]);
          }
        }
        this.set('assignedRoles', newRoles);
      },

      getAssignedRole: function(roleType) {
        var roles = this.get('assignedRoles');
        if (!roles || !roles.length) {
          return null;
        }

        for (var i=0; i<roles.length; i++) {
          if (roles[i].roleType === roleType) {
            return roles[i];
          }
        }

        return null;
      },

      controllerNodes: function() {
        var role = this.getAssignedRole('controller');
        if (role !== null) {
          return role.numNodes;
        }
        else {
          return 0;
        }
      }.property('assignedRoles', 'assignedRoles.@each.numNodes'),

      computeNodes: function() {
        var role = this.getAssignedRole('compute');
        if (role !== null) {
          return role.numNodes;
        }
        else {
          return 0;
        }
      }.property('assignedRoles', 'assignedRoles.@each.numNodes'),

      blockNodes: function() {
        var role = this.getAssignedRole('block');
        if (role !== null) {
          return role.numNodes;
        }
        else {
          return 0;
        }
      }.property('assignedRoles', 'assignedRoles.@each.numNodes'),

      objectNodes: function() {
        var role = this.getAssignedRole('object');
        if (role !== null) {
          return role.numNodes;
        }
        else {
          return 0;
        }
      }.property('assignedRoles', 'assignedRoles.@each.numNodes'),

      addNode: function(node) {
        this.get('assignedNodes').pushObject(node);
      },

      totalNodes: function() {
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

  drivers: ['pxe_ipmitool', 'pxe_ssh'],
  architectures: ['amd64', 'x86', 'x86_64'],
  selectedNode: null,


  registrationInProgress: false,
  registerNodesModalOpened: false,
  registerNodesModalClosed: true,
  modalOpen: false,
  isUploadVisible: false,

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
      oldSelection.set('isSelected', false);
    }

    if (profile)
    {
      profile.set('isSelected', true);
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

  doCancelUpload: function(fileInput) {
    if (fileInput)
    {
      fileInput.value = null;
    }
    this.set('isUploadVisible', false);
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
        newNode.isDefault = true;
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

    toggleUploadVisibility: function() {
      if (this.get('isUploadVisible')) {
        this.doCancelUpload();
      }
      else {
        this.set('isUploadVisible', true);
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

          // If the default added node is still listed, remove it
          if (edittedNodes.length === 1 && edittedNodes[0].isDefault && Ember.isEmpty(edittedNodes[0].get('ipAddress'))) {
            edittedNodes.removeObject(edittedNodes[0]);
          }

          for (var row in data) {
            var node_data = data[row];
            if (Array.isArray(node_data) && node_data.length >=9) {
              var memory_mb = node_data[0].trim();
              var local_gb = node_data[1].trim();
              var cpus = node_data[2].trim();
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
          me.doCancelUpload(fileInput);
        };
        reader.onloadend = function() {
          if (reader.error) {
            console.log(reader.error.message);
          }
        };

        reader.readAsText(file);
      }
    },

    cancelUpload: function(fileInput) {
      this.doCancelUpload(fileInput);
    }
  },

  disableRegisterNodesNext: function() {
    var nodeCount = this.get('model.nodes.length');
    return (nodeCount < 2);
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

  getImage: function(imageName) {
    return Ember.$.getJSON('/fusor/api/openstack/images/show_by_name/' + imageName);
  },

  registerNode: function(node) {
    var me = this;
    var bmDeployKernelImage = null;
    var bmDeployRamdiskImage = null;

    this.getImage('bm-deploy-kernel').then(function(kernelImage) {
	bmDeployKernelImage = kernelImage;
    });
    this.getImage('bm-deploy-ramdisk').then(function(ramdiskImage) {
	bmDeployRamdiskImage = ramdiskImage;
    });

    var promiseFunction = function(resolve) {
      var checkForDone = function() {
        var driverInfo = {};
        if ( node.driver == 'pxe_ssh' ) {
          driverInfo = {
            ssh_address: node.ipAddress,
            ssh_username: node.ipmiUsername,
            ssh_key_contents: node.ipmiPassword,
            ssh_virt_type: 'virsh',
            deploy_kernel: bmDeployKernelImage.image.id,
            deploy_ramdisk: bmDeployRamdiskImage.image.id,
          }
        } else if (node.driver == 'pxe_ipmitool')  {
          driverInfo = {
            ipmi_address: node.ipAddress,
            ipmi_username: node.ipmiUsername,
            ipmi_password: node.ipmiPassword,
            pxe_deploy_kernel: bmDeployKernelImage.image.id,
            pxe_deploy_ramdisk: bmDeployRamdiskImage.image.id,
          }
        }
        var createdNode = me.store.createRecord('node', {
            driver: node.driver,
            driver_info: driverInfo,
            properties: {
              memory_mb: node.ram,
              cpus: node.cpu,
              local_gb: node.disk,
              cpu_arch: node.architecture,
              capabilities: 'boot_option:local',
            },
            address: node.nicMacAddress,
        });
        createdNode.save();
        resolve(true);
      };

      Ember.run.later(checkForDone, 3000);
    };

    var fulfill = function(isDone) {
      if (isDone) {
        var nodes = me.get('model.nodes');
        me.doNextNodeRegistration();
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
