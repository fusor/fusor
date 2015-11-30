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
      def read_full_log(path)
        log = Fusor::Logging::Log.new
        log.path = path
        log.entries = []
        File.open(log.path).each { |line| log.entries.push(parse_entry(line)) }
        log
      end

      def parse_entry(raw_text)
        entry = Fusor::Logging::LogEntry.new
        entry.date_time = parse_date raw_text
        entry.level = parse_log_level raw_text
        entry.text = raw_text[-1] == "\n" ? raw_text[0..-2] : raw_text
        entry
      end

      def parse_date(raw_text)
        date_str = /\d+-\d+-\d+\s\d+:\d+:\d+/.match(raw_text).to_s
        begin
          DateTime.strptime(date_str, '%Y-%m-%d %H:%M:%S')
        rescue ArgumentError
          return nil
        end
      end

      def parse_log_level(raw_text)
        level_str = /\[[A-Z]\]/.match(raw_text).to_s
        return nil unless level_str && level_str.size > 2
        level_str[1..-2]
      end

      def tail_log_since(path, date_time, num_lines = 1000, num_lines_limit = 16_000)
        # TODO - implement File.reverse_each then we could do something like:
        # File.open(log.path).reverse_each{|line| entry = parse(line); break if entry.date_time < date_time}
        # to read the file backwards and parse it line by line

        log = Fusor::Logging::Log.new
        log.path = path
        tail_n = [num_lines, num_lines_limit].min
        enough_lines = false

        # unfortunately, file.readlines[-200..-1] would read the whole file
        # so instead, grab enough tail of the log to parse
        until enough_lines
          entry_text = `tail -n #{tail_n} #{log.path}`
          lines = entry_text.split("\n")

          # check to see if we grabbed enough of the log
          first_date = nil
          lines.each do |line|
            d = parse_date line
            unless d.nil?
              first_date = d
              break
            end
          end

          if first_date < date_time || tail_n >= num_lines_limit
            enough_lines = true
          end

          # get 4x more of the log up to the limit on the next iteration
          tail_n = [tail_n * 4, num_lines_limit].min
        end

        # Add lines from the bottom of the log until
        # we reach one from earlier than the requested date_time
        log.entries = []
        lines.reverse_each do |text|
          entry = parse_entry text
          break if !entry.date_time.nil? && entry.date_time < date_time
          log.entries.unshift entry
        end

        # Pop off any lines at the beginning with no date.
        # They were part of a log line with a date earlier than we want.
        while log.entries.length > 0 && log.entries[0].date_time.nil?
          log.entries.shift
        end
        log
      end
    end
  end
end
