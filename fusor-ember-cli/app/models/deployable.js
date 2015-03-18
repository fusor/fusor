import DS from 'ember-data';

export default DS.Model.extend({
  deployment: DS.belongsTo('deployment', {inverse: 'rhev_engine_host', async: true}),
  discovered_host: DS.belongsTo('discovered-host', {inverse: 'rhev_engine_host', async: true})
});
