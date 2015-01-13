import DS from 'ember-data';

var Hostgroup = DS.Model.extend({
  name: DS.attr('string'),
  // hostgroup: DS.attr('string'),
  // mac: DS.attr('string'),
  // domain: DS.attr('string'),
  // subnet: DS.attr('string'),
  // operatingsystem: DS.attr('string'),
  // environment: DS.attr('string'),
  // model: DS.attr('string'),
  // location: DS.attr('string'),
  // organization: DS.attr('string')
});

// Hostgroup.reopenClass({
//     FIXTURES: [
//        {
//           id: 1,
//           parent: null,
//           name: 'RHEV Self Hosted Engine',
//           title: 'RHEV Self Hosted Engine',
//           domain: 'example.com',
//           subnet: '10.0.3.100',
//           operatingsystem: 'Fedora 19',
//           environment: 'Development',
//           location: 'Tel Aviv',
//           organization: 'Default_Organization'
//        },
//        {
//           id: 2,
//           parent: null,
//           name: 'RHEV Host',
//           title: 'RHEV Host',
//           domain: 'example.com',
//           subnet: '10.0.4.100',
//           operatingsystem: 'Fedora 19',
//           environment: 'Development',
//           location: 'Tel Aviv',
//           organization: 'Default_Organization'
//        },
//     ]
// });

export default Hostgroup;