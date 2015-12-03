require "fusor/multilog"

module Fusor
  @@default_log_file = "/var/log/foreman/fusor.log"

  def self.log
    @@log ||= MultiLogger.new(Rails.logger)
  end

  def self.log_change_deployment(deployment = nil)
    self.log

    @@log.detach_all

    if Rails.env.production?
      if deployment.nil?
        @@log.attach(@@default_log_file)
      else
        Dir.mkdir("/var/log/foreman/#{deployment.name}-#{deployment.id}") unless File.exist?("/var/log/foreman/#{deployment.name}-#{deployment.id}")
        @@log.attach("/var/log/foreman/#{deployment.name}-#{deployment.id}/deployment.log")
      end
    end
  end
end
