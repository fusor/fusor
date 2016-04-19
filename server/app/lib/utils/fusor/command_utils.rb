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

module Utils
  module Fusor
    class CommandUtils
      def self.run_command(cmd, log_on_success = false)
        # popen2e merges stdout and stderr, which we have put into
        # the the output variable
        stdin, stdout_err, wait_thr = Open3.popen2e(cmd)
        status = wait_thr.value.exitstatus

        # capture the output into a variable because once we close
        # it you can no longer read it.
        #
        # also need to capture it so that we can log any errors
        # that may have occurred otherwise we just log the class id
        # which is useless in a debugging scenario.
        #
        output = stdout_err.readlines

        if status > 0
          Rails.logger.error "Error running command: #{cmd}"
          Rails.logger.error "Status code: #{status}"
          Rails.logger.error "Command output: #{output}"
        elsif log_on_success
          Rails.logger.info "Command: #{cmd}"
          Rails.logger.info "Status code: #{status}"
          Rails.logger.info "Command output: #{output}"
        end

        # need to close these explicitly as per the docs
        stdin.close unless stdin.closed?
        stdout_err.close unless stdout_err.closed?

        return status, output
      end
    end
  end
end
