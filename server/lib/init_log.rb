require "fusor/multilog"

module Fusor
  if Rails.root.nil?
    @default_log_file = nil
  else
    @default_log_file = File.join(Rails.root, "log/fusor.log")
  end

  def self.log
    @log ||= MultiLogger.new(Rails.logger)
  end

  def self.log_change_deployment(deployment = nil)
    self.log

    if deployment.nil?
      @log.attach(@default_log_file)
    else
      Dir.mkdir(self.log_file_dir(deployment)) unless File.exist?(self.log_file_dir(deployment))
      @log.attach(self.log_file_path(deployment))
    end
  end

  def self.log_file_dir(deployment)
    return File.join(Rails.root, 'log') if deployment.nil?
    File.join(Rails.root, 'log', "#{deployment.name.gsub(/[^0-9A-Za-z\-]/, '_')}-#{deployment.id}")
  end

  def self.log_file_name(deployment)
    return 'fusor.log' if deployment.nil?
    'deployment.log'
  end

  def self.log_file_path(deployment)
    File.join(self.log_file_dir(deployment), self.log_file_name(deployment))
  end
end
