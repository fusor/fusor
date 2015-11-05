import Ember from 'ember';
import request from 'ic-ajax';
import NeedsDeploymentMixin from "../../mixins/needs-deployment-mixin";

export default Ember.Controller.extend(NeedsDeploymentMixin, {

  deploymentId: Ember.computed.alias("controllers.deployment.model.id"),
  upstreamConsumerUuid: Ember.computed.alias("controllers.deployment.model.upstream_consumer_uuid"),
  upstreamConsumerName: Ember.computed.alias("controllers.deployment.model.upstream_consumer_name"),
  cdnUrl: Ember.computed.alias("controllers.deployment.model.cdn_url"),
  manifestFile: Ember.computed.alias("controllers.deployment.model.manifest_file"),

  isRhev: Ember.computed.alias("controllers.deployment.model.deploy_rhev"),
  isOpenStack: Ember.computed.alias("controllers.deployment.model.deploy_openstack"),
  isCloudForms: Ember.computed.alias("controllers.deployment.model.deploy_cfme"),

  //overwritten by setupController
  organizationUpstreamConsumerUUID: null,
  organizationUpstreamConsumerName: null,

  validCredentials: function() {
    // password is not saved in the model
    return (Ember.isPresent(this.get('model.identification')) && Ember.isPresent(this.get('password')));
  }.property('model.identification', 'password'),

  enableCredentialsNext: function() {
    return this.get('validCredentials') || this.get('model.isAuthenticated');
  }.property('validCredentials', 'model.isAuthenticated'),
  disableCredentialsNext: Ember.computed.not('enableCredentialsNext'),

  hasUpstreamConsumerUuid: function() {
    return Ember.isPresent(this.get('upstreamConsumerUuid'));
  }.property('upstreamConsumerUuid'),

  hasOrganizationUpstreamConsumerUUID: function() {
    return Ember.isPresent(this.get('organizationUpstreamConsumerUUID'));
  }.property('organizationUpstreamConsumerUUID'),

  backRouteNameonCredentials: function() {
    if (this.get('isCloudForms')) {
      return 'cloudforms.cfme-configuration';
    } else if (this.get('isOpenStack')) {
      return 'assign-nodes';
    } else if (this.get('isRhev')) {
      return 'storage';
    } else {
      return 'configure-environment';
    }
  }.property('isRhev', 'isOpenStack', 'isCloudForms'),

  nextButtonTitle: 'Next',

  actionCredentialsNext: function() {
    if (this.get('model.isAuthenticated')) {
      return 'redirectToManagementApplication';
    } else {
      return 'loginPortal';
    }
  }.property('model.isAuthenticated'),

  isDisconnected: Ember.computed.alias('controllers.deployment.model.is_disconnected'),
  hasManifestFile: Ember.computed.notEmpty('manifestFile'),
  noManifestFile: Ember.computed.empty('manifestFile'),

  contentProviderType: function() {
    return (this.get('isDisconnected') ? "disconnected" : "redhat_cdn");
  }.property('isDisconnected'),

  contentProviderTitle: function() {
    return (this.get('isDisconnected') ? "Disconnected" : "Red Hat CDN");
  }.property('isDisconnected'),

  isDisconnectedSelected: function() {
    return (this.get('contentProviderType') === 'disconnected');
  }.property('contentProviderType'),

  actions: {
    providerTypeChanged: function() {
      return this.set('isDisconnected', this.get('isDisconnectedSelected'));
    },

    uploadManifest: function() {
      var self = this;
      var manifestFile = document.getElementById('manifest-file-field').files[0];
      var formData = new FormData();
      var token = Ember.$('meta[name="csrf-token"]').attr('content');
      formData.append('manifest_file[name]', manifestFile.name);
      formData.append('manifest_file[file]', manifestFile);
      formData.append('manifest_file[deployment_id]', this.get('deploymentId'));

      console.log('action: uploadManifest, PUT /fusor/api/v21/subscriptions/upload');
      //ic-ajax request
      request({
        type: 'PUT',
        url: '/fusor/api/v21/subscriptions/upload',
        data: formData,
        processData: false,
        headers: {'X-CSRF-Token': token},
        contentType: false
      }).then( function(result) {
            self.get('controllers.deployment.model').set('manifest_file', result.manifest_file);
            self.get('controllers.deployment.model').save().then(function () {
              return console.log('Manifest successfully uploaded');
            });
        }, function(error) {
              console.log(error);
              return console.log('ERROR on uploadManifest');
        }
      );

    },

    uploadDifferentManifest: function() {
      return this.set("manifestFile", null);
    }
  }


});
