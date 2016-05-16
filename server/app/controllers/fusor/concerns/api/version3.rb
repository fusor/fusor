module Fusor
  module Api
    module Version3
      extend ActiveSupport::Concern

      included do
        resource_description do
          api_version "v3"
          app_info N_("Fusor v3 is the only API version. You need to use v3 by either passing 'version=3' in the Accept Header or using api/v3/ in the URL.")
        end
      end

      def api_version
        '3'
      end

    end
  end
end
