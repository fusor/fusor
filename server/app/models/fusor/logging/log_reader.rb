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

module Fusor
  module Logging
    class LogReader

      MAX_NUM_LINES = 40_000

      def read_full_log(path)
        log_length = get_file_length(path)
        lower_boundary = log_length > MAX_NUM_LINES ? log_length - MAX_NUM_LINES : 0
        tail_log_since(path, lower_boundary)
      end

      def parse_entry(raw_text, line_number, previous_entry = nil)
        entry = Fusor::Logging::LogEntry.new
        entry.line_number = line_number
        entry.text = raw_text[-1] == "\n" ? raw_text[0..-2] : raw_text
        entry.level = (is_continuation(raw_text) && previous_entry) ? previous_entry.level : parse_log_level(raw_text)
        entry
      end

      def is_continuation(_raw_text)
        false
      end

      def parse_log_level(_raw_text)
        nil
      end

      def tail_log_since(path, lower_boundary)
        tail_log(path, lower_boundary, get_file_length(path) - lower_boundary)
      end

      # on a 4gb file with 4.4mil lines, wc -l and tail ~= 1s, awk ~= 11s, ruby file.readlines ~= 100s
      def tail_log(path, lower_boundary, num_lines)
        log = Fusor::Logging::Log.new
        log.path = path
        return log if num_lines <= 0

        line_number = lower_boundary
        entry_text = tail_lines(num_lines, log.path)
        lines = entry_text.split("\n")
        previous_entry = nil
        lines.each do |line|
          entry = parse_entry(line, line_number += 1, previous_entry)
          log.entries.push(entry)
          previous_entry = entry
        end
        log
      end

      def get_file_length(path)
        `wc -l "#{path}"`.strip.split(' ')[0].to_i
      end

      def tail_lines(num_lines, path)
        `tail -n #{num_lines} #{path}`
      end
    end
  end
end
