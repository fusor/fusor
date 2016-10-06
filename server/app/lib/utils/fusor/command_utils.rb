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
        # popen2e merges stdout and stderr, which we have put into
        # the the output variable
        stdin, stdout_err, wait_thr = Open3.popen2e(environment, cmd)
        status = wait_thr.value.exitstatus

        # capture the output into a variable because once we close
        # it you can no longer read it.
        #
        # also need to capture it so that we can log any errors
        # that may have occurred otherwise we just log the class id
        # which is useless in a debugging scenario.
        #
        output = stdout_err.readlines

        cmd_filtered = cmd
        output_filtered = output

        # run password filtering code if we're going to log something
        if status > 0 || log_on_success
          cmd_filtered = PasswordFilter.filter_passwords(cmd.clone)
          output_filtered = PasswordFilter.filter_passwords(output.clone)
        end

        if status > 0
          ::Fusor.log.error "Error running command: #{cmd_filtered}"
          ::Fusor.log.error "Status code: #{status}"
          ::Fusor.log.error "Command output: #{output_filtered}"
        elsif log_on_success
          ::Fusor.log.info "Command: #{cmd_filtered}"
          ::Fusor.log.info "Status code: #{status}"
          ::Fusor.log.info "Command output: #{output_filtered}"
        end

        # need to close these explicitly as per the docs
        stdin.close unless stdin.closed?
        stdout_err.close unless stdout_err.closed?

        return status, output
      end
    end
  end
end
