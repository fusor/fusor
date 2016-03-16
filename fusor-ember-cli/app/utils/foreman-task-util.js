// ForemanTaskUtil: Wrappers around driving foreman tasks

import Ember from 'ember';
import request from 'ic-ajax';
let Promise = Ember.RSVP.Promise;

class ForemanTaskUtil {
  constructor(csrfToken) {
    this._csrfToken = csrfToken;
    this._uriRoot = `${window.location.protocol}//${window.location.host}`;
    this._foremanApiPath = '/foreman_tasks/api';
    this._foremanApiUri = `${this._uriRoot}${this._foremanApiPath}`;
    this._resumePath = `/tasks/bulk_resume`;
    this._resumeUri = `${this._foremanApiUri}${this._resumePath}`;
  }
  resume(taskId) {
    return request({
      url: this._resumeUri,
      type: 'POST',
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "X-CSRF-Token": this._csrfToken,
      },
      data: JSON.stringify({ 'search': taskId })
    });
  }
}

export default ForemanTaskUtil;
