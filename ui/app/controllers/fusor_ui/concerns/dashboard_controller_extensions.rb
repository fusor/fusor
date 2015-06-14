module FusorUi
  module Concerns
    module DashboardControllerExtensions
      extend ActiveSupport::Concern

      included do
        def index
          redirect_to new_fusor_deployment_path
        end
      end

    end
  end
end
