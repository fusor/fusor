import Ember from 'ember';
import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  parameters: DS.attr(),
  roles: DS.attr(),

  getParam(fieldName) {
    return this.get('parameters')[fieldName];
  },

  getParamValue(fieldName) {
    let param =  this.getParam(fieldName);
    return param ? param.Default : undefined;
  }
});
