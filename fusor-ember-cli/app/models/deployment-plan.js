import Ember from 'ember';
import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  uuid: DS.attr('string'),
  roles: DS.hasMany('deployment-role', {inverse: null, async: false}),
  parameters: DS.hasMany('deployment-plan-parameter', {inverse: null, async: false}),

  externalNetworkInterface: Ember.computed('parameters.@each.value', {
    get(key) {
      return this.getParamValue('Controller-1::NeutronPublicInterface');
    },
    set(key, value) {
      this.updateParam('Controller-1::NeutronPublicInterface', value);
    }
  }),

  overcloudPassword: Ember.computed('parameters.@each.value', {
    get(key) {
      return this.getParamValue('Controller-1::AdminPassword');
    },
    set(key, value) {
      this.updateParam('Controller-1::AdminPassword', value);
    }
  }),

  computeRoleFlavor: Ember.computed('parameters.@each.value', {
    get(key) {
      return this.getParamValue('Compute-1::Flavor');
    },
    set(key, value) {
      this.updateParam('Compute-1::Flavor', value);
    }
  }),

  computeRoleCount: Ember.computed('parameters.@each.value', {
    get(key) {
      return this.getParamValue('Compute-1::count');
    },
    set(key, value) {
      this.updateParam('Compute-1::count', value);
    }
  }),

  controllerRoleFlavor: Ember.computed('parameters.@each.value', {
    get(key) {
      return this.getParamValue('Controller-1::Flavor');
    },
    set(key, value) {
      this.updateParam('Controller-1::Flavor', value);
    }
  }),

  controllerRoleCount: Ember.computed('parameters.@each.value', {
    get(key) {
      return this.getParamValue('Controller-1::count');
    },
    set(key, value) {
      this.updateParam('Controller-1::count', value);
    }
  }),

  cephStorageRoleFlavor: Ember.computed('parameters.@each.value', {
    get(key) {
      return this.getParamValue('Ceph-Storage-1::Flavor');
    },
    set(key, value) {
      this.updateParam('Ceph-Storage-1::Flavor', value);
    }
  }),

  cephStorageRoleCount: Ember.computed('parameters.@each.value', {
    get(key) {
      return this.getParamValue('Ceph-Storage-1::count');
    },
    set(key, value) {
      this.updateParam('Ceph-Storage-1::count', value);
    }
  }),

  cinderStorageRoleFlavor: Ember.computed('parameters.@each.value', {
    get(key) {
      return this.getParamValue('Cinder-Storage-1::Flavor');
    },
    set(key, value) {
      this.updateParam('Cinder-Storage-1::Flavor', value);
    }
  }),

  cinderStorageRoleCount: Ember.computed('parameters.@each.value', {
    get(key) {
      return this.getParamValue('Cinder-Storage-1::count');
    },
    set(key, value) {
      this.updateParam('Cinder-Storage-1::count', value);
    }
  }),

  swiftStorageRoleFlavor: Ember.computed('parameters.@each.value', {
    get(key) {
      return this.getParamValue('Swift-Storage-1::Flavor');
    },
    set(key, value) {
      this.updateParam('Swift-Storage-1::Flavor', value);
    }
  }),

  swiftStorageRoleCount: Ember.computed('parameters.@each.value', {
    get(key) {
      return this.getParamValue('Swift-Storage-1::count');
    },
    set(key, value) {
      this.updateParam('Swift-Storage-1::count', value);
    }
  }),

  getParam(paramName, paramsOverride) {
    var params = paramsOverride || this.get('parameters');
    return params ? params.findBy('id', paramName) : null;
  },

  getParamValue(paramName, paramsOverride) {
    var param = this.getParam(paramName, paramsOverride);
    return param ? param.get('value') : null;
  },

  updateParam(name, value) {
    var param = this.getParam(name);

    if (param) {
      param.set('value', value);
    }
  }
});
