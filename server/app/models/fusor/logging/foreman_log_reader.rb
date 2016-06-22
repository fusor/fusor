module Fusor
  module Logging
    class ForemanLogReader < LogReader

      def is_continuation(raw_text)
        raw_text[0..2] == ' | '
      end

      def parse_log_level(raw_text)
        level_str = /\[[A-Z]\]/.match(raw_text).to_s
        return nil unless level_str && level_str.size > 2
        case level_str[1..-2]
          when 'D'
            :debug
          when 'I'
            :info
          when 'W'
            :warn
          when 'E'
            :error
        end
      end

      def tail_lines(num_lines, path)
        remove_color_cmd = Rails.env.development? ? '| sed -r "s/\x1B\[([0-9]{1,2}(;[0-9]{1,2})?)?[m|K]//g"' : ''
        `tail -n #{num_lines} #{path} #{remove_color_cmd}`
      end
    end
  end
end
