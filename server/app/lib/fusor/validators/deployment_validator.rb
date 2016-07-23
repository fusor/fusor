module Fusor
  module Validators
    # rubocop:disable ClassLength
    class DeploymentValidator < ActiveModel::Validator

      def validate(deployment)
        validate_only_one_deployment(deployment)

        unless deployment.deploy_rhev || deployment.deploy_cfme || deployment.deploy_openstack
          deployment.errors[:base] << _('You must deploy something...')
        end

        if deployment.deploy_rhev
          validate_rhev_parameters(deployment)
        end

        if deployment.deploy_cfme
          validate_cfme_parameters(deployment)
        end

        if deployment.deploy_openshift
          validate_openshift_parameters(deployment)
        end
      end

      def validate_only_one_deployment(deployment)
        other_running_deployments = ::Fusor::Deployment.joins(:foreman_task)
                                      .where.not(id: deployment.id)
                                      .where(foreman_tasks_tasks: {state: 'running'})

        unless other_running_deployments.empty?
          other = other_running_deployments.first
          deployment.errors[:foreman_task_uuid] << _("Deployment #{other.id}: #{other.name} is already running")
        end
      end

      def validate_rhev_parameters(deployment)
        # 1) must have a root password
        # 2) must have a rhev manager password
        # 2) must have valid storage type
        # 3) must have valid storage options to match that type
        # 4) must have engine
        # 5) must have at least one hypervisor
        # 6) must have valid mac address naming scheme
        if deployment.rhev_root_password.empty?
          deployment.errors[:rhev_root_password] << _('RHV deployments must specify a root password for the RHV machines')
        end

        if deployment.rhev_engine_admin_password.empty?
          deployment.errors[:rhev_engine_admin_password] << _('RHV deployments must specify an admin password for the RHV Engine')
        end

        if deployment.rhev_storage_type.empty? or !['NFS', 'Local', 'glusterfs'].include?(deployment.rhev_storage_type)
          deployment.errors[:rhev_storage_type] << _('RHV deployments must specify a valid storage type (NFS, Local, glusterfs)')
        end

        if deployment.rhev_storage_type == 'Local'
          if deployment.rhev_local_storage_path.empty?
            deployment.errors[:rhev_local_storage_path] << _('Local storage specified but missing local storage path')
          end
        else
          if deployment.rhev_share_path.empty?
            deployment.errors[:rhev_share_path] << _('RHV storage specified but missing path to the share')
          else
            error = validate_storage_path(deployment, deployment.rhev_share_path)
            if error
              deployment.errors[:rhev_share_path] << _(error)
            elsif deployment.rhev_storage_address.empty?
              deployment.errors[:rhev_storage_address] << _('RHV storage specified but missing address to the share')
            else
              validate_storage_share(deployment, deployment.rhev_storage_address, deployment.rhev_share_path, 36, 36)
            end
          end
        end

        if deployment.rhev_is_self_hosted
          if deployment.hosted_storage_path.empty?
            deployment.errors[:hosted_storage_path] << _('RHV self hosted deployments must specify hosted storage path')
          else
            error = validate_storage_path(deployment, deployment.hosted_storage_path)
            if error
              deployment.errors[:hosted_storage_path] << _(error)
            elsif deployment.hosted_storage_address.empty?
              deployment.errors[:hosted_storage_address] << _('RHV self hosted deployments must specify hosted storage address')
            else
              validate_storage_share(deployment, deployment.hosted_storage_address, deployment.hosted_storage_path, 36, 36)
            end
          end
        end

        if deployment.rhev_engine_host_id.nil? and !deployment.rhev_is_self_hosted
          deployment.errors[:rhev_engine_host_id] << _('RHV deployments must have an RHV Engine Host')
        end

        if deployment.rhev_hypervisor_hosts.count < 1
          deployment.errors[:rhev_hypervisor_hosts] << _('RHV deployments must have at least one Hypervisor')
        end

        validate_hostname(deployment)
        validate_storage_addresses(deployment)
      end

      def validate_cfme_parameters(deployment)
        # 1) must also deploy either rhev or openstack
        # 2) must have install location
        # 3) must have cfme root password
        if !(deployment.deploy_rhev or deployment.deploy_openstack)
          deployment.errors[:deploy_cfme] << _("CloudForms deployments must also deploy either RHV or OpenStack")
        end

        if deployment.cfme_install_loc.empty?
          deployment.errors[:cfme_install_loc] << _('CloudForms deployments must specify an install location')
        end

        if deployment.cfme_root_password.empty?
          deployment.errors[:cfme_root_password] << _('CloudForms deployments must specify a root password for the CloudForms machines')
        end

        if deployment.cfme_install_loc == 'RHEV'
          if deployment.rhev_export_domain_address.empty?
            deployment.errors[:rhev_export_domain_address] << _('NFS share specified but missing address of NFS server')
          else
            if deployment.rhev_export_domain_path.empty?
              deployment.errors[:rhev_export_domain_path] << _('NFS share specified but missing path to the share')
            else
              error = validate_storage_path(deployment, deployment.rhev_export_domain_path)
              if error
                deployment.errors[:rhev_export_domain_path] << _(error)
              end
              validate_storage_share(deployment, deployment.rhev_export_domain_address, deployment.rhev_export_domain_path, 36, 36)
            end
          end
        end
      end

      def validate_openshift_parameters(deployment)
        # 1) must also deploy either rhev or openstack
        # 2) must have install location
        # 3) must have at least one master node with valid resource requirements
        # 4) must have an OSE username
        # 5) must have a unique wildcard subdomain entry

        if !(deployment.deploy_rhev or deployment.deploy_openstack)
          deployment.errors[:deploy_openshift] << _("OpenShift deployments must also deploy either RHV or OpenStack")
        end

        if deployment.openshift_install_loc.empty?
          deployment.errors[:openshift_install_loc] << _('OpenShift deployments must specify an install location')
        end

        if deployment.openshift_number_master_nodes < 1
          deployment.errors[:openshift_number_master_nodes] << _("OpenShift deployments must have at least one master node")
        else
          if deployment.openshift_master_vcpu < 1 or deployment.openshift_master_ram < 1 or deployment.openshift_master_disk < 1
            deployment.errors[:openshift_master_vcpu] << _("OpenShift deployments must specify amount of resources to be used")
          end
        end

        if deployment.openshift_username.empty?
          deployment.errors[:openshift_username] << _("OpenShift deployments must specify an OSE user to be created")
        end

        if deployment.openshift_user_password.empty?
          deployment.errors[:openshift_user_password] << _("OpenShift deployments must specify a password for the OpenShift user")
        end

        if deployment.openshift_subdomain_name.empty?
          deployment.errors[:openshift_subdomain_name] << _("Openshift deployments must specify a wildcard subdomain region")
        else
          subdomain = Net::DNS::ARecord.new({:ip => "0.0.0.0",
                                             :hostname => "*.#{deployment.openshift_subdomain_name}.#{Domain.find(Hostgroup.find_by_name('Fusor Base').domain_id)}",
                                             :proxy => Domain.find(1).proxy
                                           })

          validate_openshift_subdomain(deployment, subdomain)
        end

        validate_storage_share(deployment, deployment.openshift_storage_host, deployment.openshift_export_path, -1, -1)
      end

      private

      def validate_storage_path(deployment, path)
        error = nil
        if deployment.rhev_storage_type == 'NFS'
          # See https://tools.ietf.org/html/rfc2224#section-1
          # NFS paths cannot end in slash or contain non-ascii chars
          if path.end_with?("/") && path.length > 1
            error = 'NFS path specified ends in a "/", which is invalid'
          end
          # NFS paths must start with a slash
          if !path.start_with?("/")
            error = 'NFS path specified does not start with a "/", which is invalid'
          end
          if !path.ascii_only?
            error = 'NFS path specified contains non-ascii characters, which is invalid'
          end
        elsif deployment.rhev_storage_type == 'glusterfs'
          if path.end_with?("/") && path.length > 1
            error = 'Gluster path specified ends in a "/", which is invalid'
          end

          if path.start_with?("/")
            error = 'Gluster path specified starts with a "/", which is invalid'
          end

          if !path.ascii_only?
            error = 'Gluster path specified contains non-ascii characters, which is invalid'
          end
        end
        return error
      end

      def validate_storage_share(deployment, address, path, uid, gid)
        # validate that the NFS server exists
        # don't proceed if it doesn't
        return unless validate_storage_server(deployment, address)

        # validate that the NFS share exists and is clean
        validate_storage_mount(deployment, address, path, uid, gid)
      end

      def validate_storage_server(deployment, address)
        cmd = "showmount #{address}"
        status, output = Utils::Fusor::CommandUtils.run_command(cmd)

        if status != 0
          message = _("Could not connect to address '%s'. " \
                      "Make sure the NFS server exists and is up.") % "#{address}"
          add_warning(deployment, message, output)
          return false
        end

        return true
      end

      def validate_storage_mount(deployment, address, path, uid, gid)
        if deployment.rhev_storage_type == "NFS"
          type = "nfs"
        else
          type = "glusterfs"
        end
        cmd = "sudo safe-mount.sh '#{deployment.id}' '#{address}' '#{path}' '#{type}'"
        status, output = Utils::Fusor::CommandUtils.run_command(cmd)

        if status != 0
          add_warning(deployment, _("Could not mount the NFS share '%s' in order to inspect it. " \
                                    "Please check that the NFS share exists.") % "#{address}:#{path}",
                      output)
          return
        end

        # Check if we want to verify NFS mount credentials as well
        # If specified UID is -1, do not check
        if uid != -1
          validate_storage_credentials(deployment, uid, gid)
        end

        files = Dir["/tmp/fusor-test-mount-#{deployment.id}/*"] # this may return [] if it can't read the share
        Utils::Fusor::CommandUtils.run_command("sudo safe-umount.sh #{deployment.id}")

        if files.length > 0
          add_warning(deployment, _("NFS file share '%s' is not empty. This could cause deployment problems.") %
                      "#{address}:#{path}"
                     )
        end
      end

      def validate_storage_credentials(deployment, uid, gid)
        if File.stat("/tmp/fusor-test-mount-#{deployment.id}").uid != uid
          add_warning(deployment, _("NFS share has an invalid UID. The expected UID is '%s'. " \
                                    "Please check NFS share permissions.") % "#{uid}")
          return
        end

        if File.stat("/tmp/fusor-test-mount-#{deployment.id}").gid != gid
          add_warning(deployment, _("NFS share has an invalid GID. The expected GID is '%s'. " \
                                    "Please check NFS share permissions.") % "#{gid}")
          return
        end
      end

      def validate_openshift_subdomain(deployment, subdomain)
        if !subdomain.conflicts.empty?
          conflicting_subdomain_entry = subdomain.conflicts[0]
          conflicting_ip = conflicting_subdomain_entry.to_s.split('/')[1]
          active_conflicting_host = Host::Managed.all.select { |h| h.ip == conflicting_ip }

          # If the conflicting subdomain points to an active managed host, display a warning
          # Otherwise, delete the stale entry
          if !active_conflicting_host.empty?
            add_warning(deployment, _("The specified subdomain name to deploy Openshift applications is already in use. " \
                                      "Please specify a different subdomain name or the wildcard region will not be created."))
          else
            conflicting_subdomain_entry.destroy
          end
        end
      end

      def validate_hostname(deployment)
        regex = /^[A-z0-9\.\_\-]+$/

        unless deployment.rhev_engine_host.nil?
          unless deployment.rhev_engine_host.name =~ regex
            deployment.errors[:base] << _("RHV engine host '%s' does not have proper mac naming scheme." % "#{deployment.rhev_engine_host.name}")
          end
        end

        deployment.rhev_hypervisor_hosts.each do |host|
          unless host.name =~ regex
            deployment.errors[:base] << _("RHV hypervisor hosts '%s' does not have proper mac naming scheme." % "#{host.name}")
          end
        end
      end

      def validate_storage_addresses(deployment)
        regex = /^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9\-]*[A-Za-z0-9])$/

        unless deployment.rhev_storage_address.nil?
          unless deployment.rhev_storage_address =~ regex
            deployment.errors[:base] << _("RHV storage address '%s' is an invalid host or ip address." % "#{deployment.rhev_storage_address}")
          end
        end

        unless deployment.rhev_export_domain_address.nil?
          unless deployment.rhev_export_domain_address =~ regex
            deployment.errors[:base] << _("RHV export domain address '%s' is an invalid host or ip address" % "#{deployment.rhev_export_domain_address}")
          end
        end

        unless deployment.hosted_storage_address.nil?
          unless deployment.hosted_storage_address =~ regex
            deployment.errors[:base] << _("RHV self hosted storage address '%s' is an invalid host or ip address" % "#{deployment.hosted_storage_address}")
          end
        end
      end

      def add_warning(deployment, warning, other_info = "")
        deployment.warnings << warning
        full_warning = other_info.blank? ? warning : "#{warning} #{other_info}"
        ::Fusor.log.warn("#{full_warning}")
      end
    end
  end
end
