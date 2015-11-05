import Ember from 'ember';

export function hostType(host) {
    if (host.get('is_virtual')) {
      return new Ember.Handlebars.SafeString('<center><img src="/assets/r/vm-icon-16.png" class="img-responsive" style="margin-top: 3px"></center>');
    } else {
      return new Ember.Handlebars.SafeString('<span class="pficon pficon-screen" style="font-size: 16px; margin-top: 3px"></span>');
    }
}

export default Ember.HTMLBars.makeBoundHelper(hostType);
