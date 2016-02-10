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

require 'zip'
require 'fileutils'
require 'json'

module Fusor
  module Manifest
    class ManifestImporter

      def parse_entitlement_json(ent_json)
        # stuff
        entitlement = JSON.parse(ent_json)
        available = entitlement['pool']['quantity'] - entitlement['quantity']

        ::Fusor.log.debug "------------------------------------"
        ::Fusor.log.debug "Subscription Name: #{entitlement['pool']['productName']}"
        ::Fusor.log.debug "Contract Number: #{entitlement['pool']['contractNumber']}"
        ::Fusor.log.debug "System Type: N/A"
        ::Fusor.log.debug "Start Date: #{entitlement['startDate']}"
        ::Fusor.log.debug "End Date: #{entitlement['endDate']}"
        ::Fusor.log.debug "Attached: #{entitlement['quantity']}"
        ::Fusor.log.debug "Available: #{available}"
        ::Fusor.log.debug "Quantity: #{entitlement['pool']['quantity']}"
        ::Fusor.log.debug "------------------------------------"

        return entitlement
      end

      def prepare_manifest(manifest, deployment_id)
        tmp_dir = "#{Rails.root}/tmp/deployment-#{deployment_id}"
        FileUtils.rmtree(tmp_dir) if File.exist?(tmp_dir)
        FileUtils.mkdir_p tmp_dir

        zip_file = Zip::File.open(manifest)
        entry = zip_file.glob('*.zip').first
        entry.extract(File.join(tmp_dir, "consumer.zip"))
        zip_file.close

        subscriptions = []
        consumer_zip = Zip::File.open(File.join(tmp_dir, "consumer.zip"))
        consumer_zip.glob("export/entitlements/*.json") do |entitlement|
          subscriptions.push(parse_entitlement_json(entitlement.get_input_stream.read(entitlement.size)))
        end

        consumer_zip.close

        return subscriptions
      end
    end
  end
end
