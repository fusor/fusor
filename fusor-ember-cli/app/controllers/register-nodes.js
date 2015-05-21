import Ember from 'ember';
import DeploymentControllerMixin from "../mixins/deployment-controller-mixin";

export default Ember.Controller.extend(DeploymentControllerMixin, {

  needs: ['deployment'],

  init: function() {
    this.Profile = Ember.Object.extend({
      name: null,
      driver: null,
      ipAddress: null,
      ipmiUsername: '',
      ipmiPassword: '',
      nicMacAddress: '',
      architecture: null,
      cpu: null,
      ram: null,
      disk: null,
      totalNodes: 0,

      controllerNodes: 0,
      computeNodes: 0,
      blockNodes: 0,
      objectNodes: 0,

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
      }.property('objectNodes'),

      isActiveClass: 'inactive',
      isError: false,
      errorMessage: ''
    });

  },

  newProfiles: [],
  errorProfiles: [],
  edittedProfiles: [],

  drivers: ['IPMI Driver', 'PXE + SSH'],
  architectures: ['amd64', 'x86', 'x86_64'],
  selectedProfile: null,


  registrationInProgress: false,
  registerNodesModalOpened: false,
  registerNodesModalClosed: true,
  modalOpen: false,

  registrationError: function() {
    return this.get('errorProfiles').length > 0;
  }.property('errorProfiles', 'errorProfiles.length'),

  registrationErrorMessage: function() {
    var count = this.get('errorProfiles').length;
    if (count === 1) {
      return '1 node not registered';
    }
    else if (count > 1) {
      return count + ' nodes not registered';
    }
    else {
      return '';
    }
  }.property('errorProfiles.length'),

  registrationErrorTip: function() {
    var tip = '';
    var errorProfiles = this.get('errorProfiles');

    errorProfiles.forEach(function(item, index) {
      if (index > 0) {
        tip += '\n';
      }
      tip += item.errorMessage;
    });
    return tip;
  }.property('errorProfiles', 'errorProfiles.length'),

  preRegistered: 0,
  nodeRegComplete: function() {
    return  this.get('model.nodeProfiles').length + this.get('errorProfiles').length - this.get('preRegistered');
  }.property('model.nodeProfiles.length', 'errorProfiles.length', 'preRegistered'),

  nodeRegTotal: function() {
    var total = this.get('nodeRegComplete') + this.get('newProfiles').length;
    if (this.get('registrationInProgress') && !this.get('registrationPaused')) {
      total++;
    }
    return total;
  }.property('nodeRegComplete', 'newProfiles.length', 'registrationInProgress', 'registrationPaused'),

  nodeRegPercentComplete: function() {
    var nodeRegComplete = this.get('nodeRegComplete');
    var nodeRegTotal = this.get('nodeRegTotal');
    return Math.round(nodeRegComplete / nodeRegTotal * 100);
  }.property('nodeRegComplete', 'nodeRegTotal'),

  noRegisteredNodes: function() {
      return (this.get('model.nodeProfiles').length < 1);
  }.property('model.nodeProfiles', 'model.nodeProfiles.length'),

  hasSelectedProfile: function() {
    return this.get('selectedProfile') != null;
  }.property('selectedProfile'),

  nodeFormStyle:function() {
    if (this.get('edittedProfiles').length > 0 && this.get('hasSelectedProfile') === true)
    {
      return 'visibility:visible;';
    }
    else {
      return 'visibility:hidden;';
    }
  }.property('edittedProfiles.length', 'hasSelectedProfile'),

  updateProfileSelection: function(profile) {
    var oldSelection = this.get('selectedProfile');
    if (oldSelection) {
      oldSelection.set('isActiveClass', 'inactive');
    }

    if (profile)
    {
      profile.set('isActiveClass', 'active');
    }
    this.set('selectedProfile', profile);
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
      var newProfiles = this.get('newProfiles');
      var errorProfiles = this.get('errorProfiles');
      var edittedProfiles = this.get('edittedProfiles');

      edittedProfiles.setObjects(errorProfiles);
      newProfiles.forEach(function(item, index) {
        edittedProfiles.pushObject(item);
      });
      this.set('edittedProfiles', edittedProfiles);
      this.updateProfileSelection(edittedProfiles[0]);
      this.openRegDialog();
    },

    registerNodes: function() {
      this.closeRegDialog();
      var edittedProfiles = this.get('edittedProfiles');
      var errorProfiles = this.get('errorProfiles');
      var newProfiles = this.get('newProfiles');
      edittedProfiles.forEach(function(item, index) {
        item.isError = false;
        item.errorMessage = '';
        errorProfiles.removeObject(item);
      });
      newProfiles.setObjects(edittedProfiles);
      this.set('edittedProfiles', []);
      this.set('newProfiles', newProfiles);
      this.registerNewNodes();
    },

    cancelRegisterNodes: function() {
      this.closeRegDialog();
      this.set('edittedProfiles', []);
      // Unpause if necessary
      if (this.get('registrationPaused'))
      {
        this.doNextNodeRegistration();
      }
    },

    selectProfile: function(profile) {
      this.updateProfileSelection(profile);
    },

    addProfile: function() {
      var edittedProfiles = this.get('edittedProfiles');
      var nodeCount = edittedProfiles.length + this.get('model.nodeProfiles').length + this.get('errorProfiles').length;
      if (this.get('registrationInProgress') && !this.get('registrationPaused')) {
        nodeCount++;
      }
      var newProfile = this.Profile.create({
        name: 'Node ' + (nodeCount + 1),
        totalNodes: 5
      });
      edittedProfiles.insertAt(0, newProfile);
      this.updateProfileSelection(newProfile);
    },

    removeProfile: function(profile) {
      var profiles = this.get('edittedProfiles');
      profiles.removeObject(profile);
      this.set('edittedProfiles', profiles);

      if (this.get('selectedProfile') == profile) {
        this.updateProfileSelection(profiles[0]);
      }
    }
  },

  disableRegisterNodesNext: function() {
    var freeNodeCount = 0;
    var profiles = this.get('model.nodeProfiles');
    for (var i = 0; i < profiles.length; i++ ) {
      freeNodeCount += profiles[i].freeNodes;
    }
    return (freeNodeCount < 4);
  }.property('model.nodeProfiles', 'model.nodeProfiles.length'),

  registerNewNodes: function() {
    var newProfiles = this.get('newProfiles');
    if (newProfiles && newProfiles.length > 0) {
      if (!this.get('registrationInProgress'))
      {
        this.set('preRegistered', this.get('model.nodeProfiles.length'));
        this.doNextNodeRegistration();
      }
      else if (this.get('registrationPaused')) {
        this.doNextNodeRegistration();
      }
    }
  },

  doNextNodeRegistration: function() {
    if (this.get('modalOpen') === true) {
      ;this.set('registrationPaused', true)
    }
    else
    {
      this.set('registrationPaused', false);

      var remaining = this.get('newProfiles');
      if (remaining && remaining.length > 0)
      {
        this.set('registrationInProgress', true);
        var lastIndex = remaining.length - 1;
        var nextNode = remaining[lastIndex];
        this.set('newProfiles', remaining.slice(0, lastIndex));
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
        if (iterationCount == 1) {
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
          node.errorMessage = node.name + " was not registered: node username/password is invalid.";
        }
        else if (randomPercent <= 10) {
          node.isError = true;
          node.errorMessage = node.name + " was not registered: node IP address is invalid.";
        }

        if (node.isError) {
          var errorProfiles = me.get('errorProfiles');
          errorProfiles.pushObject(node);
          me.set('errorProfiles', errorProfiles);
        }
        else {
          var nodeProfiles = me.get('model.nodeProfiles');
          nodeProfiles.pushObject(node);
          me.set('model.nodeProfiles', nodeProfiles);
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
