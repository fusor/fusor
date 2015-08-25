import Ember from 'ember';
import DeploymentControllerMixin from "../mixins/deployment-controller-mixin";

export default Ember.Controller.extend(DeploymentControllerMixin, {

  needs: ['deployment'],

  deploymentModes: ['POC', 'Scale'],

  deploymentModeHelp: "Deployment mode to setup on this Undercloud.</br>Choices are POC and Scale:</br></br> POC will allow deployment of a single role to heterogenous hardware.</br></br>Scale will allow deployment of a single role only to homogenous hardware.",

  imagePathHelp: "Defines the path to the images used for deployment roles. Leave this as the default value, which sets the path to the stack user's current directory.",

  undercloudIPHelp: "The IP address defined for the director's Provisioning NIC. This is also the IP address the director uses for its DHCP and PXE boot services.</br></br>Leave this value as the default 192.0.2.1/24 unless your are using a different subnet for the Management network i.e. it conflicts with an existing IP address or subnet in your environment.",

  localInterfaceHelp: "The chosen interface for the director's Management NIC. This is also the device the director uses for its DHCP and PXE boot services. Change this value to your chosen device. To see which device is connected, use the ip addr.",

  masquerateNetworkHelp: "Defines the network to masquerade for external access. This is the Management network.</br></br>Leave this as the default 192.0.2.0/24 unless you are using a different subnet for the Management network.",

  dhcpRangeHelp: "The start and end of the DHCP allocation range for Overcloud nodes. Ensure this range contains enough IP addresses to allocate to your nodes",

  networkCidrHelp: "The network that the director uses to manage Overcloud instances. This is the Management network.</br></br>Leave this as the default 192.0.2.0/24 unless you are using a different subnet for the Management network.",

  networkGatewayHelp: "The gateway for the Overcloud instances. This is the discovery host, which forwards traffic to the External network.</br></br>Leave this as the default 192.0.2.1 unless you are using a different IP address for the director.",

  discoveryInterfaceHelp: "The bridge the director uses for node discovery. This is custom bridge that the director configuration creates. The LOCAL_INTERFACE attaches to this bridge.</br></br>Leave this as the default br-ctlplane.",

  discoveryIpRangeHelp: "A range of IP address that the director's discovery service uses during the PXE boot and provisioning process. Use comma-separated values to define the start and end of this range. For example, 192.0.2.100,192.0.2.120.</br></br>Make sure this range contains enough IP addresses for your nodes and does not conflict with the DHCP range.",

  discoveryRunBenchHelp: "Runs a set of benchmarks during node discovery. This option is necessary if you aim to perform benchmark analysis when inspecting the hardware of registered nodes in the Advanced Scenario.",

  undercloudDebugHelp: "Sets the log level of discovery services to DEBUG.",

  showAdvancedSettings: 'out',
  showAdvancedSettingsClass: function() {
    if (this.get('showAdvancedSettings') === 'in') {
      return '';
    }
    else
    {
      return 'collapsed';
    }
  }.property('showAdvancedSettings'),

  deployed: false,

  deployDisabled: function() {
    return this.get('deployed') && !this.get('isDirty');
  }.property('deployed', 'isDirty'),

  disableDeployUndercloudNext: function() {
    return !this.get('deployed');
  }.property('deployed'),

  disableTabRegisterNodes: function() {
    return !this.get('deployed');
  }.property('deployed'),

  disableTabAssignNodes: function() {
    return !this.get('deployed');
  }.property('deployed'),


  isDirty: false,

  watchModel: function() {
    this.set('isDirty', true);
  }.observes('model.deploymentMode', 'model.imagePath', 'model.undercloudIP', 'model.sshUser',
             'model.sshPassword', 'model.localInterface', 'model.masqueradeNetwork', 'model.dhcpStart',
             'model.dhcpEnd', 'model.networkCidr', 'model.networkGateway', 'model.discoveryInterface',
             'model.discoveryIpStart', 'model.discoveryIpEnd', 'model.discoveryRunbench', 'model.undercloudDebug'),

  actions: {
    toggleShowAdvancedSettings: function() {
      if (this.get('showAdvancedSettings') === 'in') {
        this.set('showAdvancedSettings', 'out');
      }
      else {
        this.set('showAdvancedSettings', 'in');
      }
    },

    deployUndercloud: function () {
      var me = this;
      var model = this.get('model');
      console.log('deployUndercloud');
      console.log("deploymentMode " + model.deploymentMode);
      console.log("imagePath " + model.imagePath);
      console.log("host " + model.undercloudIP);
      console.log("user " + model.sshUser);
      var deployment = this.controllerFor('deployment');
      var id = deployment.model.id;

      // TODO: Insert actual satellite url, org, key here
      var data = { 'underhost': model.undercloudIP,
	           'underuser': model.sshUser,
		   'underpass': model.sshPassword,
		   'deployment_id': id,
		   'satellite_url': 'http://www.yahoo.com',
		   'satellite_org': 'test',
		   'satellite_key': 'test'};

      var promiseFunction = function (resolve) {
        me.set('deploymentError', null);

	Ember.$.ajax({
            url: '/fusor/api/openstack/underclouds',
            type: 'POST',
	    data: JSON.stringify(data),
            contentType: 'application/json',
            success: function(response) {
                promise.then(fulfill);
		console.log('create success');
		console.log(response);
            },
            error: function(error) {
		me.set('deploymentError', error.responseJSON.errors);
		me.set('showLoadingSpinner', false);
		console.log('create failed');
		console.log(error);
            }
	});

	  // TODO: need to continue checks until the api
	  // returns deployed = true
          var checkForDone = function () {
	    console.log("running check for done for id " + id);
	    Ember.$.ajax({
	      url: '/fusor/api/openstack/underclouds/' + id,
	      type: 'GET',
	      contentType: 'application/json',
	      success: function(response) {
	        console.log('api check success');
	          console.log(response);
		  if (response['deployed']) {
		      console.log('deployment finished');
		      if (response['failed']) {
			  console.log('deployment failed');
			  me.set('deploymentError', 'Please check foreman logs.');
                          me.set('showLoadingSpinner', false);
		      } else {
			  console.log('deployment success');
                          me.set('deploymentError', null);
   		          resolve(true);
		      }
		  } else {
		      console.log('deployment ongoing');
	              Ember.run.later(checkForDone, 3000);
		  }
	      },
	      error: function(error) {
                 console.log('api check error');
                 console.log(error);
                 me.set('deploymentError', 'Status check failed');
                 me.set('showLoadingSpinner', false);
	      }
            });
	  };

        Ember.run.later(checkForDone, 3000);
      };

      var fulfill = function (isDone) {
        if (isDone)
          {
	      console.log("fulfill");
              me.set('showLoadingSpinner', false);
              me.set('deployed', true);
              me.set('isDirty', false);
          }
      };

      var promise = new Ember.RSVP.Promise(promiseFunction);
      me.set('loadingSpinnerText', "Detecting Undercloud...");
      me.set('showLoadingSpinner', true);

    }
  }
});
