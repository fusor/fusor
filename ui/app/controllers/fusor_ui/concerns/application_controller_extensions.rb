module FusorUi
  module Concerns
    module ApplicationControllerExtensions
      extend ActiveSupport::Concern

      included do
        def welcome
          redirect_to new_fusor_deployment_path
        end
      end

    end
  end
end
