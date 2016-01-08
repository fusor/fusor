module Fusor
  module Logging
    class ProxyLogReader < LogReader
      def parse_log_level(raw_text)
        return :error if /\sERROR\s/.match(raw_text)
        return nil if raw_text.strip.empty?
        :info
      end
    end
  end
end
