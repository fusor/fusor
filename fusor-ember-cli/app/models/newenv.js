import DS from 'ember-data';

var Newenv = DS.Model.extend({
  name: DS.attr('string'),
  label: DS.attr('string'),
  description: DS.attr('string'),
});

Newenv.reopenClass({
    FIXTURES: []
});

export default Newenv;