import Ember from 'ember';

export default Ember.Component.extend({
  selectedFile: null,

  formId: function() {
    return this.getWithDefault('fileChooserFormId', 'fileChooserForm');
  }.property(),
  acceptValue: function() {
    return this.getWithDefault('accept', '*');
  }.property(),
  actions: {
    fileChosen: function() {
      var idValue = this.get('fileChooserButtonId');
      var fileInput = this.$('#' + idValue)[0];
      this.set('selectedFile', fileInput.files[0]);
    },
    doUpload: function() {
      var idValue = this.get('fileChooserButtonId');
      var fileInput = this.$('#' + idValue)[0];
      this.sendAction('doUpload', this.get('selectedFile'), fileInput);

    }
  }
});
