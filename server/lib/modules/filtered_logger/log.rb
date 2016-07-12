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

#!/usr/bin/env ruby

module FilteredLogger
  class Log
    def initialize(logger)
      @logger = logger
      @filters ||= []
      add_config_paths
    end

    def method_missing(method, *args)
      # If it's a logging method, then we filter first.
      log_methods = [:warn, :info, :debug]
      if log_methods.include? method
        if filter
          return
        end
      end
      @logger.send(method, *args)
    end

    def filter
      @filters.each do |path|
        if @logger.name.eql? path
          return true
        end
      end
      return false
    end

    def add_config_paths
      if check_nested_key(SETTINGS, [:fusor, :system, :silenced_logging, :paths])
        if !SETTINGS[:fusor][:system][:silenced_logging][:paths].nil?
          SETTINGS[:fusor][:system][:silenced_logging][:paths].each do |entry|
            if !@filters.include? entry
              @filters << entry
            end
          end
        end
      end
    end

    def check_nested_key(hash, keys)
      k = keys.shift
      if keys.length == 0
        hash.key? k
      else
        (hash.key? k) && check_nested_key(hash[k], keys)
      end
    end
  end
end
