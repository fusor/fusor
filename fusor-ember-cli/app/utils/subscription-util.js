import Ember from 'ember';
import request from 'ic-ajax';
let Promise = Ember.RSVP.Promise;

const validationUrlRoot =
  '/fusor/api/v21/subscriptions/validate?deployment_id=';

const SubscriptionUtil = {
  validate(deploymentId) {
    return request({
      url: validationUrlRoot + deploymentId,
      type: 'GET',
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      }
    }).then(body => {
      return body.valid;
    });
  }
};

export default SubscriptionUtil;
