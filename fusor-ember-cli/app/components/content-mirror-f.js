import Ember from 'ember';
import TextFComponent from './text-f';
import request from 'ic-ajax';

const CDN_VERIFY_TIMEOUT = 3000;

export default TextFComponent.extend({
  responseCounter: 0,
  validationTrigger: null,
  isVerifyingContentMirror: false,
  dirty: false,

  didInsertElement: function (){
    if(this.get('cdnUrl')) {
      this.queueValidation();
    }
  },

  contentMirrorObserver: Ember.observer('cdnUrl', function() {
    this.queueValidation();
  }),

  queueValidation: function() {
    if(this.get('isVerifyingContentMirror') === false) {
      this.setIsVerifyingContentMirror(true);
    }

    this.set('dirty', true);
    const validationTrigger = this.get('validationTrigger');

    if(validationTrigger) {
      Ember.run.cancel(validationTrigger);
    }

    this.set(
      'validationTrigger',
      Ember.run.later(this, () => this.onValidate(), CDN_VERIFY_TIMEOUT)
    );
  },

  onValidate: function() {
    const cdnUrl = this.get('cdnUrl');
    const protocolCheckRx = /^https?:\/\//;
    const whitespaceCheckRx = /\s/;

    if(whitespaceCheckRx.test(cdnUrl)) {
      this.setIsVerifyingContentMirror(false);
      this.setContentMirrorValidation(false, 'URL contains whitespace');
      return;
    }

    if(!protocolCheckRx.test(cdnUrl)) {
      this.setIsVerifyingContentMirror(false);
      this.setContentMirrorValidation(false, 'Missing http protocol');
      return;
    }

    // Guard against race condition of newer responses returning faster
    // than old responses that could result in valid content mirrors
    // being marked invalid, or vice versa
    const responseCounter = this.get('responseCounter') + 1;
    this.set('responseCounter', responseCounter);

    const token = Ember.$('meta[name="csrf-token"]').attr('content');
    const deploymentId = this.get('deploymentId');

    const shouldUpdate = () => {
      return responseCounter === this.get('responseCounter') &&
        !this.get('dirty');
    };

    this.set('dirty', false);
    this.set('validationTrigger', null);

    request({
      url: `/fusor/api/v21/deployments/${deploymentId}/validate_cdn`,
      headers: {
        "Accept": "application/json",
        "X-CSRF-Token": token
      },
      data: {
        cdn_url: encodeURIComponent(cdnUrl)
      }
    }).then((res) => {
      // If the response is not the newest response local responseCounter
      // will be less than the responseCounter member field),
      // we want throw away the result since we know a more accurate
      // result is incoming or already has updated our state
      if(shouldUpdate()) {
        this.setContentMirrorValidation(res.cdn_url_code === '200');
      }
    }).catch((err) => {
      if(shouldUpdate()) {
        this.setContentMirrorValidation(false);
      }
    }).finally(() => {
      if(shouldUpdate()) {
        this.setIsVerifyingContentMirror(false);
      }
    });
  },

  setContentMirrorValidation: function(isValid, validationMsg) {
    this.set('isContentMirrorValid', isValid);

    if(isValid) {
      if(!validationMsg) {
        this.set(
          'contentMirrorValidationMsg',
          'Content mirror verified'
        );
      }
      this.sendAction('mirrorStatusUpdate', this.get('MirrorStatus').VALID);
    } else {
      if(!validationMsg) {
        this.set(
          'contentMirrorValidationMsg',
          'Invalid content mirror'
        );
      }
      this.sendAction('mirrorStatusUpdate', this.get('MirrorStatus').INVALID);
    }

    if(validationMsg) {
      this.set(
        'contentMirrorValidationMsg',
        validationMsg
      );
    }
  },
  setIsVerifyingContentMirror: function(isVerifying) {
    this.set('isVerifyingContentMirror', isVerifying);

    if(isVerifying) {
      this.sendAction(
        'mirrorStatusUpdate', this.get('MirrorStatus').VALIDATING);
    }
  }
});
