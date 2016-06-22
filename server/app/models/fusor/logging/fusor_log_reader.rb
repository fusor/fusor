module Fusor
  module Logging
    class FusorLogReader < LogReader

      def is_continuation(raw_text)
        raw_text[0] == '/'
      end

      def parse_log_level(raw_text)
        return nil unless raw_text && raw_text.size > 2
        case raw_text[0..1]
          when 'D,'
            :debug
          when 'I,'
            :info
          when 'W,'
            :warn
          when 'E,'
            :error
        end
      end
    end
  end
end
