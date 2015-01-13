import DS from 'ember-data';

export default DS.FixtureAdapter.extend({
    latency: 300,
    queryFixtures: function(fixtures, query, type) {
      var key = Ember.keys(query)[0];
      return fixtures.filterBy(key, query[key]);
    }
});
