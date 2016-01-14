module Fusor
  module Logging
    class RailsLogReader < LogReader
      def parse_log_level(raw_text)
        level_str = /\[[A-Z]\]/.match(raw_text).to_s
        return nil unless level_str && level_str.size > 2
        case level_str[1..-2]
          when 'D'
            return :debug
          when 'I'
            return :info
          when 'W'
            return :warn
          when 'E'
            return :error
        end
        nil
      end
    end
  end
end
