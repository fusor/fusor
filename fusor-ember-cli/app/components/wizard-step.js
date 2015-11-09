import Ember from 'ember';

export default Ember.Component.extend({

  minHeightStyle: Ember.computed('minHeight', function() {
      return new Ember.Handlebars.SafeString('min-height: ' + this.get('minHeight') + 'px;');
  }),

  resizeWizard: Ember.on('didInsertElement', function() {
    var self = this;
    this.resizeHandler = function() {
            // Rob's jquery code for resizing in
            // https://github.com/patternfly/rcue-rdom/blob/master/html/assign-roles-rhci.html
            var documentHeight = 0;
            var navbarOuterHeight = 0;
            var navbarInnerHeight = 0;
            var pageheaderrhciHeight = 0;
            var rowHeight = 0;
            if (Ember.$('.sidebar-pf').length > 0 && matchMedia('only screen and (min-width: 768px)').matches) {
              documentHeight = Ember.$(document).height();
              navbarOuterHeight = Ember.$('.navbar-outer').outerHeight();
              navbarInnerHeight = Ember.$('.navbar-inner').outerHeight();
              pageheaderrhciHeight = Ember.$('.page-header-rhci').outerHeight();
              rowHeight = documentHeight - navbarInnerHeight - navbarOuterHeight - pageheaderrhciHeight;
            }
            // set height of attribute in controller
            return self.set('minHeight', rowHeight);
    }.bind(this);

    Ember.$(window).on('resize', this.resizeHandler);
    this.resizeHandler();

  }),

  removeResize: Ember.on('willDestroyElement', function() {
    Ember.$(window).off('resize', this.resizeHandler);
  })

});
