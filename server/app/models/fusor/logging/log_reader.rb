module Fusor
  module Logging
    class LogReader
      def read_full_log(path)
        log = Fusor::Logging::Log.new
        log.path = path
        log.entries = []

        File.open(log.path).each do |line|
          entry = Fusor::Logging::LogEntry.new
          entry.date_time = parse_date line
          entry.level = parse_log_level line
          entry.text = line[0..-2] #strip newlines
          log.entries.push entry
        end

        log
      end

      def parse_date(raw_text)
        date_str = /\d+-\d+-\d+\s\d+:\d+:\d+/.match(raw_text).to_s
        return nil if date_str.empty?
        DateTime.strptime(date_str, '%Y-%m-%d %H:%M:%S')
      end

      def parse_log_level(raw_text)
        level_str = /\[.\]/.match(raw_text).to_s
        return nil unless level_str && level_str.size > 2
        level_str[1..-2]
      end

      def tail_log_since(path, date_time)
        # TODO - implement File.reverse_each then we could do something like:
        # File.open(log.path).reverse_each{|line| entry = parse(line); break if entry.date_time < date_time}
        # to read the file backwards and parse it line by line

        log = Fusor::Logging::Log.new
        log.path = path
        n_value = 1000
        n_value_limit = 16_000
        enough_lines = false

        # unfortunately, file.readlines[-200..-1] would read the whole file
        # so instead, grab enough tail of the log to parse
        until enough_lines || n_value > n_value_limit
          entry_text = `tail -n #{n_value} #{log.path}`
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

          if first_date < date_time
            enough_lines = true
          else
            # if we don't have enough get 4x more log
            n_value *= 4
          end
        end

        # Add lines from the bottom of the log until
        # we reach one from earlier than the requested date_time
        log.entries = []
        lines.reverse_each do |text|
          entry = Fusor::Logging::LogEntry.new
          entry.date_time = parse_date text
          break if !entry.date_time.nil? && entry.date_time < date_time

          entry.level = parse_log_level text
          entry.text = text

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
