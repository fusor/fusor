import DS from 'ember-data';

export default DS.Model.extend({
  deployment: DS.belongsTo('deployment'), //, {async: true}
  discovered_host: DS.belongsTo('discovered-host')
});
