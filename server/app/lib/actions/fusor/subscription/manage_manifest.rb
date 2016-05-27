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
      class ManageManifest < Actions::Fusor::FusorBaseAction
        def humanized_name
          _("Manage Subscription Manifest")
        end

        def plan(deployment, customer_portal_credentials)
          super(deployment)
          upstream_consumer = deployment.organization.owner_details['upstreamConsumer']
          ::Fusor.log.debug "provider url #{deployment.organization.redhat_provider.repository_url}"
          if upstream_consumer.blank?
            # If there isn't an upstream consumer, a manifest has not yet been imported

            download_file_path = File.join("#{Rails.root}/tmp", "import_#{SecureRandom.hex(10)}.zip")
            if deployment.cdn_url?
              download_file_path = deployment.manifest_file
            end

            ::Fusor.log.debug("with no upstream_consumer: #{download_file_path}")

            sequence do
              # consider creating an UploadManifest which will get the file from
              # the client? Or just have ember upload it to a temp directory
              # automagically.
              # only download it if we didn't supply our own cdn_url
              if deployment.cdn_url.blank?
                ::Fusor.log.error("XXX DOWNLOAD manifest 1");
                plan_action(::Actions::Fusor::Subscription::DownloadManifest,
                            deployment,
                            customer_portal_credentials,
                            download_file_path)
              end
              ::Fusor.log.error("XXX IMPORT manifest 1");
              plan_action(::Actions::Katello::Provider::ManifestImport,
                          deployment.organization.redhat_provider,
                          download_file_path,
                          nil)
            end

            #
            # 2016/05/27 zeus:
            # we used to have an else condition that would refresh the manifest
            # if the deployment had an upstream uuid that matched the
            # organizations. If for some reason the uuid of the deployment did
            # not match the one from the organization we would download, delete
            # and import a new manifest.
            #
            # We no longer want to do any of this. Once a manifest has been
            # imported we don't want to allow new imports. Therefore the entire
            # else clause was wiped out.
            #
          end
        end
      end
    end
  end
end
