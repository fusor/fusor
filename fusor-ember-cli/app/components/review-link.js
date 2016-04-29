import Ember from 'ember';

export default Ember.Component.extend({

  // all these values can be overwritten
  isRequired: false,
  isDefault: false,
  useYieldInstead: false,
  isExternalURL: false,
  validationMessage: 'required field',
  defaultMessage: 'default',

  eyeIcon: 'fa-eye',
  isEyeOpen: true,

  showValidationMessage: Ember.computed('isRequired', 'value', function() {
    return (this.get('isRequired') && Ember.isBlank(this.get('value')));
  }),

  showDefaultMessage: Ember.computed('isDefault', 'value', function() {
    return (this.get('isDefault') && Ember.isBlank(this.get('value')));
  }),

  valueFormatted: Ember.computed('isPassword', 'isEyeOpen', 'value', function() {
    if (this.get('isPassword') && this.get('isEyeOpen') && Ember.isPresent(this.get('value'))) {
      return '********';
    } else {
      return this.get('value');
    }
  }),

  isNotALink: Ember.computed('isExternalURL', 'routeName', function() {
    return (Ember.isBlank(this.get('routeName')) && !(this.get('isExternalURL')));
  }),

  title: 'Alternative IP Address',
  helpTextIpAddress: Ember.computed('ipAddress', function() {
    return '<a href=' + this.get('ipAddress') + ' target="_blank">' + this.get('ipAddress') + '</a>';
  }),

  didInsertElement() {
    return Ember.$('[data-toggle="popover"]').popover({html: true,
                                                       trigger: 'click hover',
                                                       title: this.get('title'),
                                                       placement: 'right'
                                                      });
  },

  willDestroyElement() {
    return Ember.$('[data-toggle="popover"]').popover('destroy');
  },

  actions: {
    showPassword() {
      this.set('isEyeOpen', this.toggleProperty('isEyeOpen'));
      if (this.get('isEyeOpen')) {
        this.set('eyeIcon', "fa-eye");
      } else {
        this.set('eyeIcon', "fa-eye-slash");
      }
    },

    doNothing() {
      return false;
    }

  }

});
