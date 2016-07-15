module Foreman
  class LoggingImpl
    def logger(name)
      FilteredLogger::Log.new(::Logging.logger[name])
    end
  end
end
