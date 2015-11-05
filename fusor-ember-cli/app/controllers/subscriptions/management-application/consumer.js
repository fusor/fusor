import Ember from 'ember';

export default Ember.Controller.extend({

//  queryParams: ['cuuid'],

 cuuid: Ember.computed.alias("controllers.deployment.upstream_consumer_uuid")

});
