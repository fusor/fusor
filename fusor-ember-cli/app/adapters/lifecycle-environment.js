import ApplicationAdapter from './application';

export default ApplicationAdapter.extend({
  namespace: 'katello/api/v2',
  pathForType: function(type) {
    return "environments";
  }
});
