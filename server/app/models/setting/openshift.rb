module Fusor
  class Setting::Openshift < ::Setting

    def self.load_defaults
      return unless super

      self.transaction do
        [
          self.set('openshift_master_vcpu', N_("Number of vCPU's for each OSE Master Node"), 2),
          self.set('openshift_master_ram', N_("Amount of RAM (GB) for each OSE Master Node"), 8),
          self.set('openshift_master_disk', N_("Amount of Storage (GB) for each OSE Master Node"), 30),
          self.set('openshift_node_vcpu', N_("Number of vCPU's for each OSE Worker Node"), 1),
          self.set('openshift_node_ram', N_("Amount of RAM (GB) for each OSE Worker Node"), 8),
          self.set('openshift_node_disk', N_("Amount of Storage (GB) for each OSE Worker Node"), 15),
        ].each { |s| self.create! s.update(:category => "Setting::Openshift") }
      end
      true
    end

  end
end
