module Welder

  # Example: Plugin's HostsController inherits from Foreman's HostsController
  class HostsController < ::HostsController

    # change layout if needed
    # layout 'Welder/layouts/new_layout'

    def new_action
      # automatically renders view/welder/hosts/new_action
    end

  end
end
