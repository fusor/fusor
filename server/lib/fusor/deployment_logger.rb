require 'logger'
require 'fusor/password_filter'

##
# DeploymentLogger
# ================
# Child of Ruby base logging class. Filters passwords from logs using context
# provided by a Deployment object.
#
class DeploymentLogger < Logger

  def initialize(*args, deployment)
    super(*args)
    if !deployment.nil?
      PasswordFilter.extract_deployment_passwords(deployment)
    end
  end

  def add(severity, message = nil, progname = nil)
    if !message.nil?
      message = PasswordFilter.filter_passwords(message.clone)
    end
    if !progname.nil?
      progname = PasswordFilter.filter_passwords(progname.clone)
    end
    super(severity, message, progname)
  end
end
