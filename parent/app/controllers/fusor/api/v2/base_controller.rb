module Fusor
  module Api
    module V2
      class BaseController < ::Api::V2::BaseController

        resource_description do
          api_version 'v2'
          api_base_url '/fusor/api'
        end

      end
    end
  end
end
