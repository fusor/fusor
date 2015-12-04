require 'logger'

class MultiLogger
  attr_reader :logdev

  def initialize(logger)
    @original = logger
  end

  # Creates and write to additional log file(s).
  def attach(name)
    @logdev ||= {}
    if !@logdev.key? name
      @logdev[name] = Logger.new(name)
    end
  end

  # Closes a secondary log file.
  def detach(name)
    @logdev ||= {}
    if @logdev.key? name
      @logdev[name].close
      @logdev.delete(name)
    end
  end

  def detach_all
    @logdev ||= {}

    @logdev.each do |name, dev|
      detach(name)
    end
  end

  def method_missing(method, *args)
    @original.send(method, *args)

    @logdev ||= {}
    @logdev.each do |name, dev|
      dev.send(method, *args)
    end
  end
end
#end
