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
    module Subscription
      class DownloadManifest < Actions::Fusor::FusorBaseAction
        def humanized_name
          _("Download Subscription Manifest from Customer Portal")
        end

        def plan(deployment, customer_portal_credentials, download_file_path)
          super(deployment)
          unless customer_portal_credentials[:username] && customer_portal_credentials[:password]
            fail _("Customer portal credentials are not available.")
          end
          fail _("Deployment does not have an upstream consumer UUID.") unless deployment.upstream_consumer_uuid

          plan_self(username: customer_portal_credentials[:username],
                    password: customer_portal_credentials[:password],
                    upstream_consumer_uuid: deployment.upstream_consumer_uuid,
                    download_file_path: download_file_path,
                    user_id: ::User.current.id)
        end

        def run
          ::User.current = ::User.find(input[:user_id])

          consumer = ::Fusor::Resources::CustomerPortal::Consumer.get(input[:upstream_consumer_uuid],
                                                                      { username: input[:username],
                                                                        password: input[:password] })

          export = ::Fusor::Resources::CustomerPortal::Consumer.export(input[:upstream_consumer_uuid],
                                                                       { client_cert: consumer['idCert']['cert'],
                                                                         client_key: consumer['idCert']['key'] })

          File.open(input[:download_file_path], 'w') do |f|
            f.binmode
            f.write export
          end

        ensure
          ::User.current = nil
        end
      end
    end
  end
end
