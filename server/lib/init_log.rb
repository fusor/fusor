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


    if Rails.env.production?
      if deployment.nil?
        @log.attach(@default_log_file)
      else
        name = "#{deployment.name}".gsub!(/[^0-9A-Za-z.\-]/, '_')
        Dir.mkdir("#{Rails.root}/log/#{name}-#{deployment.id}") unless File.exist?("#{Rails.root}/log/#{name}-#{deployment.id}")
        @log.attach("#{Rails.root}/log/#{name}-#{deployment.id}/deployment.log")
      end
    end
  end
end
