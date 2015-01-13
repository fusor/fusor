import DS from 'ember-data';

export default DS.ActiveModelAdapter.extend({
  namespace: 'api/v3',
  host: 'http://localhost:3000'
});
