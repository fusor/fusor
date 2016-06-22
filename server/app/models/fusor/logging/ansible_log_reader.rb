module Fusor
  module Logging
    class AnsibleLogReader < LogReader
      def parse_log_level(raw_text)
        return :error if /(\s\sERROR:)|(\s\sfatal:)/.match(raw_text)
        return nil if raw_text.strip.empty?
        :info
      end
    end
  end
end
