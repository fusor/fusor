require "fusor/multilog"

module Fusor
  if Rails.env.production?
    @@default_log_file = "/var/log/foreman/fusor.log"
  else
    @@default_log_file = "#{Rails.root}/log/fusor.log"
  end
  def self.log
    @@log ||= MultiLogger.new(Rails.logger)
  end
  def self.log_change_deployment(deployment=nil)
    self.log

    @@log.detach_all

    if deployment.nil?
      @@log.attach(@@default_log_file)
    else
      if Rails.env.production?
        Dir.mkdir("/var/log/foreman/#{deployment.name}-#{deployment.id}") unless File.exist?("/var/log/foreman/#{deployment.name}-#{deployment.id}")
        @@log.attach("/var/log/foreman/#{deployment.name}-#{deployment.id}/deployment.log")
      else
        Dir.mkdir("#{Rails.root}/log/#{deployment.name}-#{deployment.id}") unless File.exist?("#{Rails.root}/log/#{deployment.name}-#{deployment.id}")
        @@log.attach("#{Rails.root}/log/#{deployment.name}-#{deployment.id}/deployment.log")
      end
    end
  end
end
