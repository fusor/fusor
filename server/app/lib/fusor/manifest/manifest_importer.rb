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

        Rails.logger.debug "------------------------------------"
        Rails.logger.debug "Subscription Name: #{entitlement['pool']['productName']}"
        Rails.logger.debug "Subscription Name2: #{entitlement['pool']['branding'].first['name']}"
        Rails.logger.debug "Contract Number: #{entitlement['pool']['contractNumber']}"
        Rails.logger.debug "System Type: N/A"
        Rails.logger.debug "Start Date: #{entitlement['startDate']}"
        Rails.logger.debug "End Date: #{entitlement['endDate']}"
        Rails.logger.debug "Attached: #{entitlement['quantity']}"
        Rails.logger.debug "Available: #{available}"
        Rails.logger.debug "Quantity: #{entitlement['pool']['quantity']}"
        Rails.logger.debug "------------------------------------"

        return entitlement
      end

      def prepare_manifest(manifest, deployment_id)
        Rails.logger.debug "XXX ------------- Entered prepare_manifest -------------"
        tmp_dir = "#{Rails.root}/tmp/deployment-#{deployment_id}"
        FileUtils.rmtree(tmp_dir) if File.exist?(tmp_dir)
        FileUtils.mkdir_p tmp_dir

        zip_file = Zip::File.open(manifest)
        entry = zip_file.glob('*.zip').first
        entry.extract(File.join(tmp_dir, "consumer.zip"))
        zip_file.close

        subscription = nil
        consumer_zip = Zip::File.open(File.join(tmp_dir, "consumer.zip"))
        consumer_zip.glob("export/entitlements/*.json") do |entitlement|
          Rails.logger.debug entitlement.name
          subscription = parse_entitlement_json(entitlement.get_input_stream.read(entitlement.size))
        end

        consumer_zip.close

        Rails.logger.debug "XXX ------------- Leaving prepare_manifest -------------"
        return subscription
      end
    end
  end
end
