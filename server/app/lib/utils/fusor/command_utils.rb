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

module Utils
  module Fusor
    class CommandUtils
      def self.run_command(cmd, log_on_success=false)
        # popen2e merges stdout and stderr, which we have put into
        # the the output variable
        stdin, stdout_err, wait_thr = Open3.popen2e(cmd)
        status = wait_thr.value.exitstatus
        #pid = wait_thr[:pid]
        if status > 0
            Rails.logger.error "Error running command: #{cmd}"
            Rails.logger.error "Status code: #{status}"
            Rails.logger.error "Command output: #{stdout_err}"
        elsif log_on_success
            Rails.logger.info "Command: #{cmd}"
            Rails.logger.info "Status code: #{status}"
            Rails.logger.info "Command output: #{stdout_err}"
        end

        # capture the output into a variable because once we close
        # it you can no longer read it.
        output = stdout_err.readlines

        # need to close these explicitly as per the docs
        stdin.close
        stdout_err.close

        return status, output
      end
    end
  end
end
