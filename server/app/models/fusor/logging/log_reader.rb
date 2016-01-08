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

      MAX_NUM_LINES = 10_000

      def read_full_log(path)
        num_lines = get_num_lines(path)
        return tail_log(path, num_lines - MAX_NUM_LINES, MAX_NUM_LINES) if num_lines > MAX_NUM_LINES

        log = Fusor::Logging::Log.new
        log.path = path
        line_number = 0
        File.open(log.path).each { |line| log.entries.push(parse_entry(line, line_number += 1)) }
        log
      end

      def parse_entry(raw_text, line_number)
        entry = Fusor::Logging::LogEntry.new
        entry.line_number = line_number
        entry.level = parse_log_level raw_text
        entry.text = raw_text[-1] == "\n" ? raw_text[0..-2] : raw_text
        entry
      end

      def parse_log_level(_raw_text)
        nil
      end

      def tail_log_since(path, lower_boundary)
        tail_log(path, lower_boundary, get_num_lines(path) - lower_boundary)
      end

      # on a 4gb file with 4.4mil lines, wc -l and tail ~= 1s, awk ~= 11s, ruby file.readlines ~= 100s
      def tail_log(path, lower_boundary, num_lines)
        log = Fusor::Logging::Log.new
        log.path = path
        return log if num_lines <= 0

        line_number = lower_boundary
        entry_text = `tail -n #{num_lines} #{log.path}`
        lines = entry_text.split("\n")
        lines.each { |line| log.entries.push(parse_entry(line, line_number += 1)) }
        log
      end

      def get_num_lines(path)
        `wc -l "#{path}"`.strip.split(' ')[0].to_i
      end
    end
  end
end
