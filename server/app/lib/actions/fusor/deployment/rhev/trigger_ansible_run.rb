module Actions
  module Fusor
    module Deployment
      module Rhev
        class TriggerAnsibleRun < Actions::Fusor::FusorBaseAction

          def humanized_name
            _('Trigger ansible run for RHV deployment')
          end

          def plan(deployment)
            super(deployment)
            plan_self(deployment_id: deployment.id)
          end

          def run
            ::Fusor.log.debug '====== TriggerAnsibleRun run method ======'

            deployment = ::Fusor::Deployment.find input[:deployment_id]
            playbook = "/usr/share/ansible-ovirt/#{deployment.rhev_is_self_hosted ? 'self_hosted' : 'engine_and_hypervisor'}.yml"
            inventory = generate_inventory(deployment)
            vars = generate_vars(deployment)
            config_dir = "#{Rails.root}/tmp/ansible-ovirt/#{deployment.label}"
            private_key = generate_private_key(deployment, "#{config_dir}/.ssh")
            environment = get_environment(deployment, config_dir, private_key)

            unless Dir.exist?(config_dir)
              FileUtils.mkdir_p(config_dir)
            end
            File.open(config_dir + '/inventory', 'w') { |file| file.write(inventory) }


            trigger_ansible_run(playbook, vars, config_dir, environment)

            ::Fusor.log.debug '====== Leaving TriggerAnsibleRun run method ======'
          end

          private

          def generate_inventory(deployment)
            if deployment.rhev_is_self_hosted
              generate_self_hosted_inventory(deployment)
            else
              generate_engine_hypervisor_inventory(deployment)
            end
          end

          def generate_self_hosted_inventory(deployment)
            first_host, *hypervisors = *deployment.discovered_hosts
            ["[self_hosted_first_host]",
             "#{first_host.fqdn} mac_address=#{first_host.mac}",
             "[self_hosted_additional_hosts]",
             "#{hypervisors.map.with_index { |h, i| "#{h.fqdn} host_id=#{i + 2} mac_address=#{h.mac}" }.join("\n")}",
             "[self_hosted:children]",
             "self_hosted_first_host",
             "self_hosted_additional_hosts",
             "[self_hosted:vars]",
             "repositories=#{repositories_for(:rhevh)}"].join("\n")
          end

          def generate_engine_hypervisor_inventory(deployment)
            engine = deployment.rhev_engine_host
            hypervisors = deployment.discovered_hosts
            ["[engine]",
             "#{engine.fqdn} mac_address=#{engine.mac}",
             "[engine:vars]",
             "repositories=#{repositories_for(:rhevm)}",
             "[hypervisors]",
             "#{hypervisors.map { |h| "#{h.fqdn}" }.join("\n")}",
             "[hypervisors:vars]",
             "repositories=#{repositories_for(:rhevh)}"].join("\n")
          end

          def repositories_for(product)
            SETTINGS[:fusor][:content][product].map { |p|
              p[:repository_set_label] if p[:repository_set_label] =~ /rpms$/
            }.compact
          end

          def generate_vars(deployment)
            hostgroup = deployment.rhev_engine_host.hostgroup
            cpu_type = deployment.rhev_cpu_type || 'Intel Nehalem Family'
            {
              "admin_password" => deployment.rhev_engine_admin_password,
              "cluster_name" => deployment.rhev_cluster_name,
              "dc_name" => deployment.rhev_data_center_name,
              "cpu_model" => get_cpu_model(cpu_type),
              "cpu_type" => cpu_type,
              "hosted_storage_address" => deployment.hosted_storage_address,
              "hosted_storage_name" => deployment.hosted_storage_name,
              "hosted_storage_path" => deployment.hosted_storage_path,
              "data_storage_address" => deployment.rhev_storage_address,
              "data_storage_name" => deployment.rhev_storage_name,
              "data_storage_path" => deployment.rhev_share_path,
              "create_export_domain" => deployment.deploy_cfme,
              "export_storage_address" => deployment.rhev_export_domain_address,
              "export_storage_name" => deployment.rhev_export_domain_name,
              "export_storage_path" => deployment.rhev_export_domain_path,
              "engine_activation_key" => hostgroup.group_parameters.where(:name => 'kt_activation_keys').try(:first).try(:value),
              "engine_db_password" => deployment.rhev_engine_admin_password,
              "engine_fqdn" => deployment.rhev_engine_host.name,
              "engine_mac_address" => deployment.rhev_engine_host.mac,
              "gateway" => ::Subnet.find_by_name('default').gateway,
              "mac_address_range" => get_mac_address_range(deployment.id),
              "mac_pool_name" => "qci",
              "root_password" => deployment.rhev_root_password,
              "satellite_fqdn" => ::SmartProxy.first.hostname,
              "config_dir" => "/etc/qci/",
              "storageDatacenterName" => "hosted_storage",
              "storage_type" => deployment.rhev_storage_type.downcase,
              "engine_repositories": repositories_for(:rhevm)
            }
          end

          def get_environment(deployment, config_dir, private_key)
            {
              'ANSIBLE_HOST_KEY_CHECKING' => "False",
              'ANSIBLE_LOG_PATH' => "#{::Fusor.log_file_dir(deployment.label, deployment.id)}/ansible.log",
              'ANSIBLE_RETRY_FILES_ENABLED' => "False",
              'ANSIBLE_SSH_CONTROL_PATH' => "/tmp/%%h-%%r",
              'ANSIBLE_ASK_SUDO_PASS' => "False",
              'ANSIBLE_PRIVATE_KEY_FILE' => private_key,
              'HOME' => config_dir
            }
          end

          def generate_private_key(deployment, key_path)
            keyutils = Utils::Fusor::SSHKeyUtils.new(deployment, 'rsa', key_path)

            keyutils.generate_ssh_keys


            if !deployment.rhev_is_self_hosted
              distribute_key_to_host keyutils, deployment.rhev_engine_host.name, deployment.rhev_root_password
            end

            deployment.discovered_hosts.each do |host|
              distribute_key_to_host keyutils, host.name, deployment.rhev_root_password
            end

            keyutils.get_ssh_private_key_path
          end


          def distribute_key_to_host(keyutils, host, password)
            time_to_sleep = 30
            tries ||= 10
            keyutils.copy_keys_to_root host, password
          rescue Errno::ECONNREFUSED, Errno::EHOSTUNREACH, Net::SCP::Error
            ::Fusor.log.debug "======= SSH is not yet available on host #{host}, #{tries - 1} retries remaining ======"
            if (tries -= 1) > 0
              ::Fusor.log.debug "====== Sleeping for #{time_to_sleep} seconds"
              sleep time_to_sleep
              retry
            else
              raise
            end
          end


          def trigger_ansible_run(playbook, vars, config_dir, environment)
            cmd = "ansible-playbook #{playbook} -i #{config_dir}/inventory -e '#{vars.to_json}'"
            status, output = ::Utils::Fusor::CommandUtils.run_command(cmd, true, environment)
            if status != 0
              fail _("ansible-ovirt returned a non-zero return code\n#{output.join.gsub('\n', "\n")}")
            else
              ::Fusor.log.debug(output)
              status
            end
          end

          def get_mac_address_range(deployment_id)
            fail _('Too many deployments to generate a unique mac address pool') if deployment_id > 255
            identifier = deployment_id.to_s(16).rjust(2, '0')
            start = "00:1A:#{identifier}:00:00:00"
            end_ = "00:1A:#{identifier}:FF:FF:FF"
            "#{start},#{end_}"
          end

          def get_cpu_model(cpu_type)
            {
              'Intel Penryn Family' => 'model_Penryn',
              'Intel Nehalem Family' => 'model_Nehalem',
              'Intel Westmere Family' => 'model_Westmere',
              'Intel SandyBridge Family' => 'model_SandyBridge',
              'Intel Haswell Family' => 'model_Haswell',
              'Intel Haswell-noTSX Family' => 'model_Haswell-noTSX',
              'Intel Broadwell Family' => 'model_Broadwell',
              'Intel Broadwell-noTSX Family' => 'model_Broadwell-noTSX',
              'AMD Opteron G1' => 'model_Opteron_G1',
              'AMD Opteron G2' => 'model_Opteron_G2',
              'AMD Opteron G3' => 'model_Opteron_G3',
              'AMD Opteron G4' => 'model_Opteron_G4',
              'AMD Opteron G5' => 'model_Opteron_G5',
              # 'IBM POWER 8' => 'UNSUPPORTED',
            }[cpu_type]
          end
        end
      end
    end
  end
end
