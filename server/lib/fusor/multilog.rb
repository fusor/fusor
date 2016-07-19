require 'logger'

# rubocop:disable Eval
class MultiLogger
  attr_reader :logdev

  def initialize(logger)
    @original = logger
    @default_log_level ||= Logger::DEBUG
    @watchlist ||= {}
  end

  # Creates and writes to additional log file(s).
  def attach(name, deployment = nil)
    @logdev ||= {}
    if !name.nil? and !@logdev.key? name
      logger = DeploymentLogger.new(name, deployment)
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
    if Rails.env.development?
      self.info("in development fork")
      if check_nested_key(SETTINGS, [:fusor, :system, :logging, :watch, :development])
        SETTINGS[:fusor][:system][:logging][:watch][:development].each do |entry|
          file_entry = entry[:file]
          file = eval("\"" + file_entry + "\"") # this is to resolve #{} entries in yaml

          # some extra logic for devel env logging only.
          log_file ||= file
          if file.include? "development.log"
            log_file = "/var/log/foreman/development.log"
          end

          start_collect_procs(base_path, file, log_file)
        end
      end
    elsif Rails.env.production?
      self.info("in production fork")
      if check_nested_key(SETTINGS, [:fusor, :system, :logging, :watch, :production])
        SETTINGS[:fusor][:system][:logging][:watch][:production].each do |entry|
          file_entry = entry[:file]
          file = eval("\"" + file_entry + "\"") # this is to resolve #{} entries in yaml

          start_collect_procs(base_path, file, file)
        end
      end
    else
      self.info("No log watchlist defined in configuration, nothing to do...")
    end
  end

  def start_collect_procs(base_path, file, log_file)
    if !@watchlist.key? log_file
      # make containing folder
      path = File.join(base_path, File.dirname(log_file))
      FileUtils.mkdir_p(path) unless File.exist?(path)

      # spawn tail process and add to @watchlist
      self.info("tail -f #{file} >> " + File.join(base_path, log_file))
      pid = Process.spawn("tail -f #{file} >> " + File.join(base_path, log_file), :out => '/dev/null', :err => '/dev/null')
      @watchlist[file] = {:path => File.join(base_path, log_file), :pid => pid}
      Process.detach pid
    end
  end

  def stop_collect(base_path)
    if Rails.env.development?
      if check_nested_key(SETTINGS, [:fusor, :system, :logging, :watch, :development])
        terminate_collect_procs(base_path, SETTINGS[:fusor][:system][:logging][:watch][:development])
      end
    elsif Rails.env.production?
      if check_nested_key(SETTINGS, [:fusor, :system, :logging, :watch, :production])
        terminate_collect_procs(base_path, SETTINGS[:fusor][:system][:logging][:watch][:production])
      end
    end
  end

  def terminate_collect_procs(base_path, settings)
    settings.each do |entry|
      file = File.join(base_path, entry[:file])

      procs = `ps -elf | grep "#{file}" | grep -v "grep"`
      procs.split("\n").each do |p|
        pid = p.split(" ")[3].to_i
        terminate(pid)
      end

      procs = `ps -elf | grep "#{entry[:file]}" | grep -v "grep"`
      procs.split("\n").each do |p|
        pid = p.split(" ")[3].to_i
        terminate(pid)
      end
    end
  end

  def terminate(pid)
    begin
      Process.kill(9, pid)
    rescue => exception
      self.warn("Terminating log tail process #{pid} failed.")
      self.warn(exception)
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
