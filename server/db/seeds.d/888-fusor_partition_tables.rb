# Partition tables
organizations = Organization.all
locations = Location.all
Ptable.without_auditing do
  [
    { :name => 'rhev_self_hosted', :os_family => 'Redhat', :source => 'kickstart/rhev/self_hosted_ptable.erb' }
  ].each do |input|
    next if Ptable.find_by_name(input[:name])
    next if audit_modified? Ptable, input[:name]
    p = Ptable.create({
      :layout => File.read(File.join("#{Fusor::Engine.root}/app/views/unattended/", input.delete(:source)))
    }.merge(input.merge(:default => true)))

    if p.default?
      p.organizations = organizations if SETTINGS[:organizations_enabled]
      p.locations = locations if SETTINGS[:locations_enabled]
    end

    raise "Unable to create partition table: #{format_errors p}" if p.nil? || p.errors.any?
  end
end
