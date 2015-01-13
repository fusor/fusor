import Ember from 'ember';

export default Ember.Controller.extend({
  applicationModes: ['Both', 'Virt', 'Gluster'],
  engineLocation: ['Local', 'Remote'],
  dbSetup: ['Automatic', 'Manual'],
  yesNo: ['Yes', 'No'],
  applicationModes2: [
       {
          id: 1,
          name: 'Both',
       },
       {
          id: 2,
          name: 'Virt',
       },
       {
          id: 3,
          name: 'Gluster',
       }
     ],
  datacenterName: null,
  clusterName: null,
  hostName: null,
  hostAddress: null,
  storageName: null,

});

