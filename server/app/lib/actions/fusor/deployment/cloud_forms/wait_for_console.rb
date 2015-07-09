#
# Copyright 2015 Red Hat, Inc.
#
# This software is licensed to you under the GNU General Public
# License as published by the Free Software Foundation; either version
# 2 of the License (GPLv2) or (at your option) any later version.
# There is NO WARRANTY for this software, express or implied,
# including the implied warranties of MERCHANTABILITY,
# NON-INFRINGEMENT, or FITNESS FOR A PARTICULAR PURPOSE. You should
# have received a copy of GPLv2 along with this software; if not, see
# http://www.gnu.org/licenses/old-licenses/gpl-2.0.txt.

module Actions
  module Fusor
    module Deployment
      module CloudForms
        class WaitForConsole < Actions::Base
          include Actions::Base::Polling

          input_format do
            param :ip
          end

          def humanized_name
            _("Wait for CloudForms Management Console")
          end

          def plan(ip)
            plan_self(ip: ip)
          end

          def done?
            external_task
          end

          def invoke_external_task
            Rails.logger.info "================ CloudForms::WaitForConsole invoke_external_task method ===================="
            is_up? input[:ip]
          end

          def poll_external_task
            Rails.logger.info "================ CloudForms::WaitForConsole poll_external_task method ===================="
            is_up? input[:ip]
          end

          private

          def is_up?(ip)
            Rails.logger.info "================ CloudForms::WaitForConsole is_up method ===================="
            # possibly make a GET call to the webui
            begin
              output = open(smart_add_url_protocol(ip), { ssl_verify_mode: OpenSSL::SSL::VERIFY_NONE })
              return true if output.status.first == "200"
            rescue Exception => e
              Rails.logger.warn e
            end
            return false
          end

          def smart_add_url_protocol(url)
            url = "https://#{url}" unless url[/\Ahttp:\/\//] || url[/\Ahttps:\/\//]
            return url
          end
        end
      end
    end
  end
end
