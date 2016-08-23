#
# Copyright 2016 Red Hat, Inc.
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
    module Host
      class WaitForPuppet < Actions::Fusor::FusorBaseAction
        include Actions::Base::Polling

        input_format do
          param :host_id
        end

        def humanized_name
          _("Wait for Puppet Run")
        end

        def plan(host_id, timeout = 3600)
          super()
          plan_self(host_id: host_id, timeout: timeout)
        end

        def done?
          external_task
        end

        def poll_intervals
          # 6m, 4m, 1m, 30s, 8s, 4s, 1s, .5s
          [360, 240, 60, 30, 8, 4, 1, 0.5]
        end

        def invoke_external_task
          schedule_timeout(input[:timeout])
          output[:out_of_sync] = 0
          is_done? input[:host_id]
        end

        def poll_external_task
          is_done? input[:host_id]
        end

        def process_timeout
          fail(::Foreman::Exception,
                "You've reached the timeout set for this action. If the " +
                "action is still ongoing, you can click on the " +
                "\"Resume Deployment\" button to continue.")
        end

        private

        def is_done?(host_id)
          ::Fusor.log.info "================ Host::WaitForPuppetRun is_done? method ===================="
          host = ::Host::Managed.find(host_id)
          fail _("====== Host is null! Cannot wait for host! ====== ") unless host

          ::Fusor.log.info "Waiting for host #{host.name}'s puppet run to complete"
          ::Fusor.log.debug("Current puppet run status is #{host.configuration_status_label}")

          if ['Failed', 'Error'].include?(host.configuration_status_label)
            logs = host.reports.map { |x| x.logs }.flatten
            error_message_ids = logs.select { |x| x.level == :err }.map { |x| x.message_id }.uniq
            messages = ::Message.where(:id => error_message_ids).map { |x| x.value }
            fail _("====== Puppet run for host #{host.name} status reported as #{host.configuration_status_label} ====== \n\n#{messages.uniq.join("\n")}")
          elsif host.configuration_status_label == 'Out of sync'
            output[:out_of_sync] += 1
            if output[:out_of_sync] > 10
              fail _("====== Puppet run for #{host.name} puppet run reported as out of sync for the last 10 polls - something may have gone wrong. ====== ")
            end
          elsif host.configuration_status_label == 'Active'
            true
          else
            false
          end

        end
      end
    end
  end
end
