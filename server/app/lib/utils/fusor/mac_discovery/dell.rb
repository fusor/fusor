require 'rubyipmi'

module Utils
  module Fusor
    module MacDiscovery
      class Dell < Rubyipmi::Ipmitool::BaseCommand

        def initialize(opts = ObservableHash.new)
          super("ipmitool", opts)
        end

        def getmacs
          @options["cmdargs"] = "delloem mac list"
          runcmd
          result
        end
      end
    end
  end
end
