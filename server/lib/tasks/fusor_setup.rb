# These tasks require Satellite to be running
# but we need them completed before user login
# so we run it as a rake task after foreman-installer
class FusorSetup

  def self.setup
    organizations = Organization.all
    locations = Location.all
    proxy_id = SmartProxy.first.id

    settings = YAML.load(File.open('/etc/fusor-installer/fusor-installer.answers.yaml'))

    #Increase token liftetime
    Setting[:token_duration] = 2880

    #Change default download policy to on_demand
    Setting[:default_download_policy] = 'on_demand' unless Rails.env == "development"

    #Don't resict smart proxies in dev. It doesn't work using ProxyPass.
    Setting[:restrict_registered_smart_proxies] = false if Rails.env == "development"

    #Disable safemode in dev to prevent code reload issues breaking deployments
    Setting[:safemode_render] = false if Rails.env == "development"

    # Add the Domain if it does not exist
    [{ :name => settings["fusor"]["domain"], :dns_id => proxy_id }].each do |input|
      next if Domain.find_by_name(input[:name])
      d = Domain.create(input)
      d.organizations = organizations if SETTINGS[:organizations_enabled]
      d.locations = locations if SETTINGS[:locations_enabled]
      raise "Unable to create domain: #{format_errors d}" if d.nil? || d.errors.any?
    end

    # Add the Subnet if it does not exist
    domain_id = Domain.find_by_name(settings["fusor"]["domain"])['id']
    [{ :name => 'default',
       :mask => settings["fusor"]["netmask"],
       :network => settings["fusor"]["network"],
       :dns_primary => settings["fusor"]["ip"],
       :from => settings["fusor"]["subnet_from"],
       :to => settings["fusor"]["subnet_to"],
       :gateway => settings["fusor"]["gateway"],
       :domain_ids => [domain_id],
       :dns_id => proxy_id,
       :dhcp_id => proxy_id,
       :tftp_id => proxy_id,
       :boot_mode => 'DHCP'}
    ].each do |input|
      next if Subnet.find_by_name(input[:name])
      s = Subnet.create(input)
      s.organizations = organizations if SETTINGS[:organizations_enabled]
      s.locations = locations if SETTINGS[:locations_enabled]
      raise "Unable to create subnet: #{format_errors s}" if s.nil? || s.errors.any?
    end

    # Update the PXELinux global default for our needs and render the template
    [{ :name => 'PXELinux global default', :source => 'pxe/fusor_global_default.erb' }].each do |input|
      p = ProvisioningTemplate.find_by_name(input[:name])
      template = File.read(File.join("#{Fusor::Engine.root}/app/views/unattended/", input.delete(:source)))
      template = template.gsub('foreman_url', "https://#{settings['fusor']['fqdn']}")
      ProvisioningTemplate.update(p['id'], {:template => template}.merge(input.merge(:default => true)))
    end
    ProvisioningTemplate.build_pxe_default(ProvisioningTemplatesController.new)

    # Set up the Hostgroup to make use of the above resources
    subnet_id = Subnet.find_by_name('default')['id']
    [{:name => "Fusor Base", :domain_id => domain_id, :subnet_id => subnet_id}].each do |input|
      next if Hostgroup.find_by_name(input[:name])
      h = Hostgroup.create(input)
      h.organizations = organizations if SETTINGS[:organizations_enabled]
      h.locations = locations if SETTINGS[:locations_enabled]
      raise "Unable to create hostgroup: #{format_errors h}" if h.nil? || h.errors.any?
    end

    #Add the ntp-server parameter to the above Hostgroup
    hg_id = Hostgroup.find_by_name("Fusor Base")['id']
    [{:name => 'ntp-server', :reference_id => hg_id, :value => settings["fusor"]["fqdn"]}
    ].each do |input|
      next if GroupParameter.find_by_name(input[:name])
      GroupParameter.create(input)
    end
  end
end
