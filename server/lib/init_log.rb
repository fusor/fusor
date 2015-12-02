require "fusor/multilog"

module Fusor
  @@log 
  @@default_log_file = "/var/log/foreman/fusor.log"
  def self.log
    @@log ||= MultiLogger.new(Rails.logger)
  end
  def self.log_change_deployment(deployment=nil)
    self.log

    @@log.detach_all

    if deployment.nil?
      @@log.attach(@@default_log_file)
    else
      Dir.mkdir("#{Rails.root}/log/#{deployment.name}-#{deployment.id}") unless File.exists?("#{Rails.root}/log/#{deployment.name}-#{deployment.id}")
      @@log.attach("#{Rails.root}/log/#{deployment.name}-#{deployment.id}/deployment.log")
    end
  end
end
