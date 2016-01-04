require 'logger'

class MultiLogger
  attr_reader :logdev

  def initialize(logger)
    @original = logger
    @default_log_level ||= Logger::DEBUG
    @watchlist ||= {}
  end

  # Creates and write to additional log file(s).
  def attach(name)
    @logdev ||= {}
    if !name.nil? and !@logdev.key? name
      logger = Logger.new(name)
      logger.level = log_level
      @logdev[name] = logger
    end
  end

  # Closes a secondary log file.
  def detach(name)
    @logdev ||= {}
    if !name.nil? and @logdev.key? name
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

  def collect(base_path)
    if check_nested_key(SETTINGS, [:fusor, :system, :logging, :watch])
      SETTINGS[:fusor][:system][:logging][:watch].each do |entry|
        file = entry[:file]

        if !@watchlist.key? file
          # make containing folder
          path = File.join(base_path, File.dirname(file))
          FileUtils.mkdir_p(path) unless File.exist?(path)

          # spawn tail process and add to @watchlist
          pid = Process.spawn("tail -f #{file} >> " + File.join(base_path, file))
          @watchlist[file] = {:path => File.join(base_path, file), :pid => pid}
        end
      end
    else
      self.info("No log watchlist defined in configuration, nothing to do...")
    end
  end

  def stop_collect
    @watchlist.each do |p|
      Process.kill("HUP", p[:pid])
    end
  end

  def method_missing(method, *args)
    @original.send(method, *args)

    @logdev ||= {}
    @logdev.each do |name, dev|
      dev.send(method, *args)
    end
  end

  def log_level
    levels = { ":debug" => Logger::DEBUG,
               ":info" => Logger::INFO,
               ":warn" => Logger::WARN,
               ":error" => Logger::ERROR,
               ":fatal" => Logger::FATAL,
               ":unknown" => Logger::UNKNOWN }
    if !check_nested_key(SETTINGS, [:fusor, :system, :logging, :level])
      @default_log_level
    else
      levels[SETTINGS[:fusor][:system][:logging][:level]]
    end
  end

  def check_nested_key(hash, keys)
    k = keys.shift
    if keys.length == 0
      hash.key? k
    else
      (hash.key? k) && check_nested_key(hash[k], keys)
    end
  end
end
