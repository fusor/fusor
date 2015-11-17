module Fusor
  module Logging
    class Log
      attr_accessor :path, :entries

      def initialize
        @entries = []
      end
    end
  end
end
