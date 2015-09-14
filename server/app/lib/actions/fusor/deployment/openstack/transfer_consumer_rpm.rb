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
require 'net/scp'

module Actions::Fusor::Deployment::OpenStack
  class TransferConsumerRpm < Actions::Base
    def humanized_name
      _("Transfer Satellite's consumer rpm to Undercloud machine")
    end

    def plan(deployment)
      plan_self(deployment_id: deployment.id)
    end

    def run
      Rails.logger.debug "================ TransferConsumerRpm run method ===================="

      deployment = ::Fusor::Deployment.find(input[:deployment_id])

      latest_consumer_rpm = '/var/www/html/pub/katello-ca-consumer-latest.noarch.rpm'
      scp_file(deployment, latest_consumer_rpm)


      Rails.logger.debug "================ Leaving TransferConsumerRpm run method ===================="
    end

    private

    def scp_file(deployment, image_file)
      host_address = deployment.openstack_undercloud_ip_addr
      user = deployment.openstack_undercloud_user
      password = deployment.openstack_undercloud_user_password
      Net::SCP.start(host_address, user, :password => password, :paranoid => false) do |scp|
        scp.upload!(image_file, "/tmp/")
      end
    end

  end
end
