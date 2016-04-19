import ApplicationAdapter from './application';

export default ApplicationAdapter.extend({
  namespace: 'fusor/api/v21',

  urlForQueryRecord(query, modelName) {
    if (query.id) {
      return `/${this.get('namespace')}/deployments/${query.id}`;
    }
    return this._super(query, modelName);
  }
});
