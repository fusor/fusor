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
require 'open3'
require 'fusor/password_filter'

module Utils
  module Fusor
    class CommandUtils
      def self.run_command(cmd, log_on_success = false, environment = {})
        # capture2e merges stdout and stderr, which we have put into
        # the output variable
        output, status_object = Open3.capture2e(environment, cmd)
        status = status_object.exitstatus

        cmd_filtered = cmd
        output_filtered = output

        # run password filtering code if we're going to log something
        if status.nil? || status > 0 || log_on_success
          cmd_filtered = PasswordFilter.filter_passwords(cmd.clone)
          output_filtered = PasswordFilter.filter_passwords(output.clone)
        end

        if status.nil? || status > 0
          ::Fusor.log.error "Error running command: #{cmd_filtered}"
          ::Fusor.log.error "Status code: #{status}"
          ::Fusor.log.error "Command output: #{output_filtered}"
        elsif log_on_success
          ::Fusor.log.info "Command: #{cmd_filtered}"
          ::Fusor.log.info "Status code: #{status}"
          ::Fusor.log.info "Command output: #{output_filtered}"
        end

        return status, output
      end
    end
  end
end
