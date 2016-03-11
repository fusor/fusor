import Ember from 'ember';

export default Ember.Component.extend({

  setIsDisabledCfmeAndOpenshift: Ember.observer('isRhev', 'isOpenStack', function() {
    if (this.get('isRhev') || this.get('isOpenStack')) {
      this.set('isDisabledOpenShift', false);
      return this.set('isDisabledCfme', false);
    } else {
      this.set('isOpenShift', false);
      this.set('isCloudForms', false);
      this.set('isDisabledOpenShift', true);
      return this.set('isDisabledCfme', true);
    }
  }),

  descRhev: 'Complete virtualization management ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris. Fusce nec',
  descOpenstack: 'Flexible, secure foundations to build a massively scalable private or public coud. ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris. Fusce nec',
  descCfme: 'Manage your virtual, private, and hybrid cloud infrasctructures. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris. Fusce nec',
  descOpenshift: 'Manage your Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris. Fusce nec',

});
