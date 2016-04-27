#
# Copyright 2014 Red Hat, Inc.
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
      class WaitUntilOseProvisioned < Actions::Fusor::FusorBaseAction

        TIMEOUT = 7200

        middleware.use Actions::Fusor::Middleware::AsCurrentUser
        # Using the Timeout middleware to make sure input[:timeout] is
        # set. The actual timeout check is performed separately for
        # the WaitUntilProvisioned because it's not a polling action.
        middleware.use Actions::Fusor::Middleware::Timeout

        def plan(deployment_id)
          super()
          plan_self deployment_id: deployment_id
        end

        def run(event = nil)
          deployment = ::Fusor::Deployment.find(input[:deployment_id])
          fail _('====== Deployment is null! Cannot wait for host! ====== ') unless deployment

          watched_hosts = deployment.ose_master_hosts + deployment.ose_worker_hosts
          watched_hosts.each do |host|
            fail _("Failed to provision host '%s'.") % host.name if host.error?
          end

          watched_host_ids = watched_hosts.map{|host| host.id}

          # Handle event
          case event
          when nil # First run
            ::Fusor.log.info 'Waiting for the following hosts to begin provisioning...'
            watched_hosts.each do |host|
              ::Fusor.log.info "ID: #{host.id}, Name: #{host.name}"
            end

            suspend do |suspended_action|
              # schedule timeout
              world.clock.ping suspended_action, input[:timeout], "timeout"
              watched_host_ids.each{|host_id| set_host_trigger(suspended_action, host_id)}
            end
          when Hash
            # One of the OSE hosts triggered this event via its 'before_provision'
            # hook. Mark its completion state and perform set difference to deterine
            # what hosts are still outstanding. If we still haven't heard from all
            # of them, go back to sleep and alert outstanding hooks of the new
            # suspension info
            completed_host_id = event.fetch(:host_id)
            ::Fusor.log.info "Done waiting for host #{completed_host_id}, beginning provisioning..."

            if output.key?(:completed_ose_hosts)
              output[:completed_ose_hosts] << completed_host_id
            else
              output[:completed_ose_hosts] = [completed_host_id]
            end

            outstanding_host_ids = watched_host_ids - output[:completed_ose_hosts]

            if outstanding_host_ids.length == 0
              # There are no more outstanding hosts, we're done here.
              ::Fusor.log.info '====== WaitingForOseProvisioned has completed! ======'
            else
              # Go back to sleep and wait for the other hosts
              suspend do |suspended_action|
                world.clock.ping suspended_action, input[:timeout], "timeout"
                outstanding_host_ids.each{|host_id| set_host_trigger(suspended_action, host_id)}
              end
            end
          when "timeout"
            # clear timeout_start so that the action can be resumed/skipped
            output[:timeout_start] = nil
            fail(::Foreman::Exception,
                 "You've reached the timeout set for this action. If the " +
                 "action is still ongoing, you can click on the " +
                 "\"Resume Deployment\" button to continue.")
          when Dynflow::Action::Skip
            output[:installed_at] = Time.now.utc.to_s
          else
            raise TypeError
          end
        end

        def run_progress_weight
          4
        end

        def run_progress
          0.1
        end

        def set_host_trigger(suspended_action, host_id)
          # Configure host to trigger event when 'before_provision' is fired
          # by caching this suspended action's info.
          Rails.cache.write(
            ::Fusor::Concerns::HostOrchestrationBuildHook.cache_id(host_id),
            { execution_plan_id: suspended_action.execution_plan_id,
              step_id:           suspended_action.step_id })
        end

      end
    end
  end
end
