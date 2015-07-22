import Ember from 'ember';
import DeploymentControllerMixin from "../mixins/deployment-controller-mixin";

export default Ember.Controller.extend(DeploymentControllerMixin, {

  needs: ['deployment'],

  deploymentModes: ['POC', 'Scale'],

  deploymentModeHelp: "Deployment mode to setup on this Undercloud.\nChoices are POC and Scale:\n\n POC will allow deployment of a single role to heterogenous hardware.\n\nScale will allow deployment of a single role only to homogenous hardware.",

  imagePathHelp: "Local file path to the downloaded images.\n\nThe path should be a directory readable by the current user that contains the full set of downloaded images.",

  localIPHelp: "IP address to assign to the interface on the Undercloud that will be handling the PXE boots and DHCP for Overcloud instances.\n\nLocal IP will be assigned to Local Interface",

  localInterfaceHelp: "Network interface on the Undercloud that will be handling the PXE boots and DHCP for Overcloud instances.\n\nLocal Interface will be assigned the address from Local IP",

  masquerateNetworkHelp: "Network that will be masqueraded for external access if required.",

  dhcpStartHelp: "Start of DHCP Allocation range for PXE and DHCP of Overcloud instances",

  dhcpEndHelp: "End of DHCP Allocation range for PXE and DHCP of Overcloud instances",

  networkCidrHelp: "Network CIDR for neutron managed network for Overcloud instances",

  networkGatewayHelp: "Network gateway for neturon managed network for Overcloud instances",

  discoveryInterfaceHelp: "Network interface on which discovery dnsmasq will listen.\n\nIf in doubt, do not change",

  discoveryIpRangeHelp: "Temporary IP range that will be given to nodes during discovery process.\n\nShould not overlap with Neutron range, but should be in the same network",

  discoveryPxeIDHelp: "IP address of TFTP server for discovery, chances are high that it is Local IP",

  adminTokenHelp: "Keystone admin token.\n\nIf left unset, one will be automatically generated",

  adminPasswordHelp: "Keystone admin password.\n\nIf left unset, one will be automatically generated",

  databasePasswordHelp: "Password used for MySQL databases.\n\nIf left unset, one will be automatically generated",

  glancePasswordHelp: "Glance service password.\n\nIf left unset, one will be automatically generated",

  heatPasswordHelp: "Heat service password.\n\nIf left unset, one will be automatically generated",

  neutronPasswordHelp: "Neutron service password.\n\nIf left unset, one will be automatically generated",

  novaPasswordHelp: "Nova service password.\n\nIf left unset, one will be automatically generated",

  ironicPasswordHelp: "Ironic service password.\n\nIf left unset, one will be automatically generated",

  tuskarPasswordHelp: "Tuskar service password.\n\nIf left unset, one will be automatically generated",

  ceilometerPasswordHelp: "Ceilometer service password.\n\nIf left unset, one will be automatically generated",

  ceilometerSnpmdPasswordHelp: "Ceilometer snmpd password.\n\nIf left unset, one will be automatically generated",

  showAdvancedSettings: false,
  showAdvancedSettingsClass: function() {
    if (this.get('showAdvancedSettings')) {
      return '';
    }
    else
    {
      return 'collapsed';
    }
  }.property('showAdvancedSettings'),

  actions: {
    toggleShowAdvancedSettings: function() {
      this.set('showAdvancedSettings', !this.get('showAdvancedSettings'));
    }
  }});
