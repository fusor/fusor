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
      class ManageManifest < Actions::Base
        def humanized_name
          _("Manage Subscription Manifest")
        end

        def plan(deployment, customer_portal_credentials)
          upstream_consumer = deployment.organization.owner_details['upstreamConsumer']
          if upstream_consumer.blank?
            # If there isn't an upstream consumer, a manifest has not yet been imported

            download_file_path = File.join("#{Rails.root}/tmp", "import_#{SecureRandom.hex(10)}.zip")

            sequence do
              plan_action(::Actions::Fusor::Subscription::DownloadManifest,
                          deployment,
                          customer_portal_credentials,
                          download_file_path)

              plan_action(::Actions::Katello::Provider::ManifestImport,
                          deployment.organization.redhat_provider,
                          download_file_path,
                          nil)
            end

          else
            # If there is an upstream consumer, a manifest has been previously imported in to the org;
            # therefore,if the user didn't associate a consumer with the deployment, use the existing upstream
            # consumer from the organization; otherwise, either refresh it or delete it and import another

            if deployment.upstream_consumer_uuid.nil?
              deployment.upstream_consumer_uuid = upstream_consumer['uuid']
              deployment.save!

            elsif upstream_consumer['uuid'] == deployment.upstream_consumer_uuid
              plan_action(::Actions::Katello::Provider::ManifestRefresh,
                          deployment.organization.redhat_provider,
                          upstream_consumer)

            else
              download_file_path = File.join("#{Rails.root}/tmp", "import_#{SecureRandom.hex(10)}.zip")

              sequence do
                plan_action(::Actions::Fusor::Subscription::DownloadManifest,
                            deployment,
                            customer_portal_credentials,
                            download_file_path)

                plan_action(::Actions::Katello::Provider::ManifestDelete,
                            deployment.organization.redhat_provider)

                plan_action(::Actions::Katello::Provider::ManifestImport,
                            deployment.organization.redhat_provider,
                            download_file_path,
                            nil)
              end
            end
          end
        end
      end
    end
  end
end
