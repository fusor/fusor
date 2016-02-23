import Ember from 'ember';

export default Ember.Component.extend({

  classNames: ['row'],

  deleteEnabled: true,

  label: Ember.computed('node', 'ospPorts', function() {
    let ospPorts = this.get('ospPorts');
    if (!ospPorts) {
      return null;
    }

    let port = ospPorts.findBy('node_uuid', this.get('node.id'));
    return port && port.address ? port.address : this.get('node.id');
  }),

  safeLabel: Ember.computed('label', function() {
    let label = this.get('label');
    return label ? label.replace(/[^A-Z0-9]/ig, '') : '';
  }),

  status: Ember.computed('node', function() {
    if (this.get('node.last_error')) {
      return 'Error';
    }

    if (Ember.isPresent(this.get('node.provision_state'))) {
      return 'node.provision_state';
    }

    return 'Free';
  }),

  introspectionTask: Ember.computed('node.id', 'introspectionTasks.@each', function() {
    let nodeId = this.get('node.id');
    let introspectionTasks = this.get('introspectionTasks');

    if (!nodeId || !introspectionTasks) {
      return null;
    }

    return this.get('introspectionTasks').findBy('node_uuid', nodeId);
  }),

  foremanTask: Ember.computed('introspectionTask.task_id', 'foremanTasks.@each', function() {
    let introspectionTask = this.get('introspectionTask');
    let foremanTasks = this.get('foremanTasks');

    if (!introspectionTask || !foremanTasks) {
      return null;
    }

    return this.get('foremanTasks').findBy('id', introspectionTask.get('task_id'));
  }),

  isNodeReady: Ember.computed('node.properties.cpu', 'node.properties.memory_mb', 'node.properties.local_gb', function() {
    return this.get('node.ready');
  }),

  isNodeInspecting: Ember.computed('node.ready', 'foremanTask', 'foremanTask.state', 'foremanTask.result', function() {
    return !this.get('node.ready') &&
      this.get('foremanTask') &&
      this.get('foremanTask.state') === 'running' &&
      this.get('foremanTask.result') === 'pending';
  }),

  isNodeError: Ember.computed('isNodeReady', 'isNodeInspecting', 'foremanTask', 'foremanTask.state', 'foremanTask.result', function() {
    return !this.get('isNodeReady') && !this.get('isNodeInspecting') && this.get('foremanTask.result') === 'error';
  }),

  progressWidth: Ember.computed('foremanTask.progress', function() {
    let progressPercent = Math.floor((parseFloat(this.get('foremanTask.progress')) || 0) * 100);
    return `${progressPercent}%`;
  }),

  progressBarClass: Ember.computed('isNodeError', function() {
    if (this.get('isNodeError')) {
      return 'progress-bar progress-bar-danger osp-node-progress-bar';
    }
    return 'progress-bar osp-node-progress-bar';
  }),


  actions: {
    onDeleteClicked() {
      this.sendAction('deleteNode', this.get('node'), this.get('label'));
    }
  }

});
