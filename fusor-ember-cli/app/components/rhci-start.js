import Ember from 'ember';

export default Ember.Component.extend({

  classNames: ['rhci-start-block'],

  isDisabledRhev: Ember.computed.alias('isDisabled'),
  isDisabledOpenStack: Ember.computed.alias('isDisabled'),

  isDisabledCfme: Ember.computed('isDisabled', 'isRhev', 'isOpenStack', function() {
    return this.get('isDisabled') || (!this.get('isRhev') && !this.get('isOpenStack'));
  }),

  isDisabledOpenShift: Ember.computed('isDisabled', 'isRhev', function() {
    return this.get('isDisabled') || !this.get('isRhev');
  }),

  clearInvalidSelections: Ember.observer('isRhev', 'isOpenStack', function() {
    Ember.run.once(this, () => {
      if (!this.get('isRhev')) {
        this.set('isOpenShift', false);
        if (!this.get('isOpenStack')) {
          this.set('isCloudForms', false);
        }
      }
    });
  }),

  reqDownloadLink: Ember.computed('isRhev', 'isOpenStack', 'isCloudForms', 'isOpenShift', function() {
    //TODO - (tech debt) Could be handled server-side. Rails could generate a text file using a template.
    //       This is the least impactful approach since we can just refer to different static files and
    //       and not require new routes and templates this close to release.
    let filenameArray = ['QCI_Requirements'];
    if (this.get('isRhev')) {
      filenameArray.push('rhv');
    }
    if (this.get('isOpenStack')) {
      filenameArray.push('osp');
    }
    if (this.get('isCloudForms')) {
      filenameArray.push('cfme');
    }
    if (this.get('isOpenShift')) {
      filenameArray.push('ose');
    }

    let filename = filenameArray.join('_');
    return `/fusor_ui/files/${filename}.txt`;
  }),

  // tagline names
  taglineRhev: "for Traditional Workloads",
  taglineOpenStack: "for Cloud Workloads",
  taglineCloudForms: "for Hybrid Cloud Management",
  taglineOpenShift: "for Private Platform as a Service",

  // desc
  descRhev: 'Complete enterprise virtualization management for servers and desktops on the same infrastructure',
  descOpenStack: 'Flexible, secure foundations to build a massively scalable private or public cloud',
  descCloudForms: 'Manage your virtual, private, and hybrid cloud infrastructures',
  descOpenShift: 'Develop, host, and scale applications in a cloud environment',

  actions: {
    saveAndCancelDeployment() {
      this.get('targetObject').send('saveAndCancelDeployment');
    },

    cancelAndDeleteDeployment() {
      this.get('targetObject').send('cancelAndDeleteDeployment');
    },

    cancelAndRollbackNewDeployment() {
      this.get('targetObject').send('cancelAndRollbackNewDeployment');
    }
  }
});
