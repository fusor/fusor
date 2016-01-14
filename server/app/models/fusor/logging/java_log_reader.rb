module Fusor
  module Logging
    class JavaLogReader < LogReader
      def parse_log_level(raw_text)
        return :error if /\sERROR\s|^Caused by:|^\s*at\s\w*\./.match(raw_text)
        return :warn if /\sWARN\s/.match(raw_text)
        return :info if /\sINFO\s/.match(raw_text)
        return :debug if /\sDEBUG\s|\sFINE\s|\sFINER\s|\sFINEST\s|\sTRACE\s/.match(raw_text)
        nil
      end
    end
  end
end
