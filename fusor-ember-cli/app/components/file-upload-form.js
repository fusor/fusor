import Ember from 'ember';

export default Ember.Component.extend({
  selectedFile: null,

  formId: function() {
    return this.getWithDefault('fileChooserFormId', 'fileChooserForm');
  }.property(),
  inputId: function() {
    return this.getWithDefault('fileChooserFormId', 'fileChooserInput');
  }.property(),
  acceptValue: function() {
    return this.getWithDefault('accept', '*');
  }.property(),
  getFileInput: function() {
    var idValue = this.get('inputId');
    return this.$('#' + idValue)[0];
  },
  actions: {
    fileChosen: function() {
      var fileInput = this.getFileInput();
      this.set('selectedFile', fileInput.files[0]);
    },
    doUpload: function() {
      var fileInput = this.getFileInput();
      this.sendAction('doUpload', this.get('selectedFile'), fileInput);

    },
    doCancel: function() {
      var fileInput = this.getFileInput();
      this.sendAction('doCancel', fileInput);

    }
  }
});
