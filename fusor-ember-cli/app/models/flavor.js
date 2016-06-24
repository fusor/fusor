import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  ram: DS.attr('number'),
  vcpus: DS.attr('number'),
  disk: DS.attr('number'),
  extra_specs: DS.attr(),

  matchingNodeCount(nodes) {
    return nodes.reduce((nodeCount, node) => nodeCount + (node.matchesProfile(this) ? 1 : 0), 0);
  }
});


