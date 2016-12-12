#
# Copyright 2016 Red Hat, Inc.
#
# This software is licensed to you under the GNU General Public
# License as published by the Free Software Foundation; either version
# 2 of the License (GPLv2) or (at your option) any later version.
# There is NO WARRANTY for this software, express or implied,
# including the implied warranties of MERCHANTABILITY,
# NON-INFRINGEMENT, or FITNESS FOR A PARTICULAR PURPOSE. You should
# have received a copy of GPLv2 along with this software; if not, see
# http://www.gnu.org/licenses/old-licenses/gpl-2.0.txt.

#!/usr/bin/env ruby

require 'fileutils'
require 'optparse'
require 'ostruct'
require 'logger'

module OSEInstaller
  # rubocop:disable ClassLength
  class Launch
    attr_accessor :output_dir, :logger

    def initialize(output_dir = nil, log_dir = nil, logger = nil, ansible_playbooks_root = nil)
      @output_dir = output_dir
      @output_dir ||= "/tmp/"

      @log_dir = log_dir
      @log_dir ||= "/tmp/"

      @logger = logger
      @logger ||= Logger.new("#{@log_dir}/ose_installer.log", File::WRONLY | File::APPEND)

      @ansible_playbooks_root = ansible_playbooks_root
      @ansible_playbooks_root ||= "/usr/share/ansible-ocp/"
    end

    # rubocop:disable Style/MethodCalledOnDoEndBlock
    def parse
      options = OpenStruct.new
      options.masters = Array.new
      options.nodes = Array.new
      options.log = "./output/ansible.log"
      options.verbose = false

      OptionParser.new do |opts|
        opts.banner = "Usage: launch.rb [options]"

        opts.on('-m', '--master [STRING]', String, 'hostname of master') { |m| options[:masters] << m }
        opts.on('-n', '--node [STRING]', String, 'hostname of node') { |n| options[:nodes] << n }
        opts.on('-d', '--docker_storage [STRING]', String, 'docker storage') { |d| options[:docker_storage] = d }
        opts.on('-g', '--docker_volume_name [STRING]', String, 'docker volume group name') { |g| options[:docker_volume] = g }
        opts.on('-r', '--docker_registry_host [STRING]', String, 'docker registry hostname') { |r| options[:docker_registry_host] = r }
        opts.on('-p', '--docker_registry_path [STRING]', String, 'docker registry paty') { |p| options[:docker_registry_path] = p }
        opts.on('-t', '--storage_type [STRING]', String, 'storage type') { |t| options[:storage_type] = t }
        opts.on('-s', '--storage_name [STRING]', String, 'storage name') { |s| options[:storage_name] = s }
        opts.on('-c', '--storage_desc [STRING]', String, 'storage description') { |c| options[:storage_description] = c }
        opts.on('-e', '--export_path [STRING]', String, 'export path') { |e| options[:export_path] = e }
        opts.on('-x', '--subdomain_name [STRING]', String, 'subdomain name') { |x| options[:subdomain_name] = x }
        opts.on('-u', '--username [STRING]', String, 'ssh username') { |u| options[:username] = u }
        opts.on('-k', '--ssh_key [STRING]', String, 'ssh key file') { |k| options[:ssh_key] = k }
        opts.on('-o', '--ose_user [STRING]', String, 'OSE login username') { |o| options[:ose_user] = o }
        opts.on('-w', '--ose_password [STRING]', String, 'OSE login password') { |w| options[:ose_password] = w }
        opts.on('-l', '--log [STRING]', String, 'log file path') { |l| options[:log] = l }
        opts.on('-y', '--helloworld_sample_app', 'Deploy sample hello world application') { |y| options[:helloworld_sample_app] = y }
        opts.on('-h', '--satelite_hostname', 'Satellite Hostname') { |h| options[:satellite_hostname] = h }
        opts.on('-b', '--org_label [STRING]', String, 'organization label') { |b| options[:org_label] = b }
        opts.on('-v', '--verbose', 'Run verbosely') { |v| options[:verbose] = v }
      end.parse!

      options
    end

    def write_inventory(opts, inventory_file_name = "#{@output_dir}/ansible.hosts", template_file_name = "templates/ansible.hosts.template")
      @logger.info "Parsing options to create inventory file."
      @logger.debug opts

      template = File.read("#{@ansible_playbooks_root}/#{template_file_name}")

      template = template.gsub(/<ssh_user>/, opts[:username])
      template = template.gsub(/<ssh_private_key>/, opts[:ssh_key])

      # if user is not root, we need to enable ansible_sudo flag
      if !opts[:username].eql? "root"
        template = template.gsub(/#ansible_become=true/, "ansible_become=true")
      end

      # master and worker node list
      masters_list = opts[:masters].join("\n")
      template = template.gsub(/<master_nodes>/, masters_list)

      nodes_list = opts[:nodes].join("\n")
      template = template.gsub(/<worker_nodes>/, nodes_list)

      if !opts[:ha_nodes].nil? and opts[:ha_nodes].length > 1
        # split it by two
        ha_list = opts[:ha_nodes].each_slice(2).to_a
        ha_master_list = ha_list.first.join("\n")
        ha_infra_list = ha_list.last.join("\n")
      end

      ha_master_list ||= ""
      ha_infra_list ||= ""

      template = template.gsub(/<ha_master_nodes>/, ha_master_list)
      template = template.gsub(/<ha_infra_nodes>/, ha_infra_list)

      if opts[:masters].length > 1
        template = template.gsub(/<primary_master>/, opts[:masters].first)

        if opts[:nodes].length > 2 # this should always happen for HA setup
          infra_node_list = opts[:nodes][1..2].join("\n")
          template = template.gsub(/<infra_nodes>/, infra_node_list)
        end
      else
        template = template.gsub(/<primary_master>/, "")
        template = template.gsub(/<infra_nodes>/, "")
      end

      # docker storage specifics
      template = template.gsub(/<docker_storage>/, opts[:docker_storage])
      template = template.gsub(/<docker_volume>/, opts[:docker_volume])
      template = template.gsub(/<docker_registry_host>/, opts[:docker_registry_host])
      template = template.gsub(/<docker_registry_path>/, opts[:docker_registry_path])
      template = template.gsub(/<storage_type>/, opts[:storage_type])

      # ose post installation specifics
      template = template.gsub(/<ose_user>/, opts[:ose_user])
      template = template.gsub(/<ose_password>/, opts[:ose_password])

      template = template.gsub(/<subdomain_name>/, opts[:subdomain_name])
      template = template.gsub(/<helloworld_sample_app>/, opts[:helloworld_sample_app] ? "true" : "false")

      template = template.gsub(/<org_label>/, opts[:org_label])
      template = template.gsub(/<satellite_hostname>/, opts[:satellite_hostname])

      template = template.gsub(/<output_dir>/, @output_dir)

      unless Dir.exist?(@output_dir)
        FileUtils.mkdir_p(@output_dir)
      end

      File.open(inventory_file_name, 'w') { |file| file.puts template }

      @logger.info "Inventory file saved at: #{inventory_file_name}"

      inventory_file_name
    end

    def write_atomic_installer_answer_file(opts, answer_file_name = "#{@output_dir}/atomic-openshift-installer.answers.cfg.yml",
                                           template_file_name = "templates/atomic-openshift-installer.answers.cfg.yml.template")

      @logger.info "Parsing options to create answers file."
      @logger.debug opts

      if opts[:masters].length > 1
        template_file_name = "templates/atomic-openshift-installer_ha.answers.cfg.yml.template"
      end

      template = File.read("#{@ansible_playbooks_root}/#{template_file_name}")

      # if user is not root, we need to enable ansible_sudo flag
      if !opts[:username].eql? "root"
        template = template.gsub(/#ansible_sudo=true/, "ansible_sudo=true")
      end

      template = template.gsub(/<ssh_user>/, opts[:username])
      template = template.gsub(/<satellite_hostname>/, opts[:satellite_hostname])

      node_entries = nil
      opts[:nodes].each do |n|
        stdout = `getent hosts #{n}`
        if stdout.empty?
          @logger.info "Cannot resolve ip for #{n}, skipping"
          next
        else
          ip = stdout.split("\n").first.split(" ").first
        end

        entry = "- connect_to: #{n}\n    hostname: #{n}\n    ip: #{ip}\n    node: true\n    public_hostname: #{n}\n    public_ip: #{ip}\n    roles:\n    - node\n  "
        if node_entries.nil?
          node_entries = entry
        else
          node_entries += entry
        end
      end

      template = template.gsub(/<node_entries>/, node_entries) if !node_entries.nil?

      master_entries = nil
      opts[:masters].each do |m|
        stdout = `getent hosts #{m}`
        if stdout.empty?
          @logger.info "Cannot resolve ip for #{m}, skipping"
          next
        else
          ip = stdout.split("\n").first.split(" ").first
        end

        entry = "- connect_to: #{m}\n    hostname: #{m}\n    ip: #{ip}\n    master: true\n    node: true\n    public_hostname: #{m}\n    " +
                "public_ip: #{ip}\n    roles:\n     - node\n     - master\n     - etcd\n  "
        if master_entries.nil?
          master_entries = entry
        else
          master_entries += entry
        end
      end

      template = template.gsub(/<master_entries>/, master_entries) if !master_entries.nil?

      ha_node_entries = nil
      if opts[:ha_nodes].first
        n = opts[:ha_nodes].first
        stdout = `getent hosts #{n}`
        if stdout.empty?
          @logger.info "Cannot resolve ip for #{n}, skipping"
        else
          ip = stdout.split("\n").first.split(" ").first
        end

        entry = "- connect_to: #{n}\n    hostname: #{n}\n    ip: #{ip}\n    master_lb: true\n    public_hostname: #{n}\n    preconfigured: true\n    roles:\n    - master_lb\n  "
        if ha_node_entries.nil?
          ha_node_entries = entry
        else
          ha_node_entries += entry
        end

        template = template.gsub(/<ha_node_entries>/, ha_node_entries) if !ha_node_entries.nil?
      end

      unless Dir.exist?(@output_dir)
        FileUtils.mkdir_p(@output_dir)
      end

      File.open(answer_file_name, 'w') { |file| file.puts template }

      @logger.info "Answers file saved at: #{answer_file_name}"
    end

    def spawn_process(cmd)
      proc = Process.spawn(cmd)
      Process.wait(proc)
      $?.exitstatus
    end

    def create_ansible_config
      @logger.info "Creating ansible configuration."
      # Create logging entry in ansible.cfg
      ansible_config_file = "ansible.cfg"
      File.open("#{@output_dir}/#{ansible_config_file}", 'w') { |file| file.puts "[default]\nhost_key_checking = False\nlog_path = #{@output_dir}/ansible.log" }
      @logger.info "Ansible configuration saved at: #{ansible_config_file}"
    end

    def update_docker_storage_setup(opts)
      @logger.info "Updating docker storage setup file."
      docker_storage_setup_file = "docker-storage-setup"
      template = File.read("#{@ansible_playbooks_root}/templates/docker-storage-setup.template")
      if !opts[:docker_storage].nil? and !opts[:docker_volume].nil?
        template = template.gsub(/<docker_storage>/, opts[:docker_storage])
        template = template.gsub(/<docker_volume>/, opts[:docker_volume])
      end
      File.open("#{@output_dir}/#{docker_storage_setup_file}", 'w') { |file| file.puts template }
      @logger.info "Docker storage setup file saved at: #{@output_dir}/#{docker_storage_setup_file}"
    end

    def update_docker_config(opts)
      @logger.info "Updating docker configuration file."
      docker_config_file = "docker"
      template = File.read("#{@ansible_playbooks_root}/templates/docker.template")
      if !opts[:satellite_hostname].nil?
        template = template.gsub(/<satellite_hostname>/, opts[:satellite_hostname])
      end
      File.open("#{@output_dir}/#{docker_config_file}", 'w') { |file| file.puts template }
      @logger.info "Docker configuration file saved at: #{@output_dir}/#{docker_config_file}"
    end

    def update_ha_master_config(opts)
      if opts[:ha_nodes].length > 0
        @logger.info "Updating HA master configuration files."
        template = File.read("#{@ansible_playbooks_root}/templates/haproxy_masters.cfg.template")
        ha_config_file = "haproxy_master.cfg"

        entries = nil
        counter = 1
        opts[:masters].each do |m|
          entry = "    server master#{counter} #{m}:8443\n"
          counter += 1

          if entries.nil?
            entries = entry
          else
            entries += entry
          end
        end

        template = template.gsub(/<master_mirrors>/, entries) if !entries.nil?
        File.open("#{@output_dir}/#{ha_config_file}", 'w') { |file| file.puts template }
        @logger.info "Master HAProxy configuration file saved at: #{@output_dir}/#{ha_config_file}"
      end
    end

    def update_ha_infra_config(opts)
      if opts[:ha_nodes].length > 0
        @logger.info "Updating HA configuration files."
        template = File.read("#{@ansible_playbooks_root}/templates/haproxy_infras.cfg.template")
        ha_config_file = "haproxy_infra.cfg"

        entries = nil
        counter = 1
        opts[:nodes].each do |n|
          if counter > 2 # we only want the first 2
            break
          else
            entry = "    server infra#{counter} #{n}:443\n    server infra#{counter} #{n}:80\n"
            counter += 1

            if entries.nil?
              entries = entry
            else
              entries += entry
            end
          end
        end

        template = template.gsub(/<infras_mirrors>/, entries) if !entries.nil?
        File.open("#{@output_dir}/#{ha_config_file}", 'w') { |file| file.puts template }
        @logger.info "Infra HAProxy configuration file saved at: #{@output_dir}/#{ha_config_file}"
      end
    end

    def prep_run_environment
      #ENV['ANSIBLE_CONFIG'] = "#{@output_dir}/ansible.cfg"
      ENV['ANSIBLE_HOST_KEY_CHECKING'] = "False"
      @logger.info "Setting ansible log to #{@log_dir}/ansible.log"
      ENV['ANSIBLE_LOG_PATH'] = "#{@log_dir}/ansible.log"
      ENV['ANSIBLE_RETRY_FILES_ENABLED'] = "False"
      ENV['ANSIBLE_SSH_CONTROL_PATH'] = "/tmp/%%h-%%r"
      ENV['ANSIBLE_ASK_SUDO_PASS'] = "False"
      ENV['HOME'] = @output_dir
    end

    def setup(inventory, verbose = false, playbook = "#{@ansible_playbooks_root}/playbooks/setup.yml")
      flags = ""
      if verbose
        flags = "-v"
      end

      prep_run_environment
      @logger.info "ansible: executing #{playbook} with #{inventory}"
      spawn_process("ansible-playbook #{flags} #{playbook} -i #{inventory}")
    end

    def install(inventory, verbose = false, playbook = "#{@ansible_playbooks_root}/playbooks/install.yml")
      flags = ""
      if verbose
        flags = "-v"
      end

      prep_run_environment
      @logger.info "ansible: executing #{playbook} with #{inventory}"
      spawn_process("ansible-playbook #{flags} #{playbook} -i #{inventory}")
    end

    def post_install(inventory, verbose = false, playbook = "#{@ansible_playbooks_root}/playbooks/post_install.yml")
      flags = ""
      if verbose
        flags = "-v"
      end

      prep_run_environment
      @logger.info "ansible: executing #{playbook} with #{inventory}"
      spawn_process("ansible-playbook #{flags} #{playbook} -i #{inventory}")
    end

    def ha_setup(inventory, verbose = false, playbook = "#{@ansible_playbooks_root}/playbooks/ha/setup.yml")
      flags = ""
      if verbose
        flags = "-v"
      end

      prep_run_environment
      @logger.info "ansible: executing #{playbook} with #{inventory}"
      spawn_process("ansible-playbook #{flags} #{playbook} -i #{inventory}")
    end

    def ha_install(inventory, verbose = false, playbook = "#{@ansible_playbooks_root}/playbooks/ha/install.yml")
      flags = ""
      if verbose
        flags = "-v"
      end

      prep_run_environment
      @logger.info "ansible: executing #{playbook} with #{inventory}"
      spawn_process("ansible-playbook #{flags} #{playbook} -i #{inventory}")
    end

    def ha_post_install(inventory, verbose = false, playbook = "#{@ansible_playbooks_root}/playbooks/ha/post_install.yml")
      flags = ""
      if verbose
        flags = "-v"
      end

      prep_run_environment
      @logger.info "ansible: executing #{playbook} with #{inventory}"
      spawn_process("ansible-playbook #{flags} #{playbook} -i #{inventory}")
    end

    def prepare(opts)
      inventory = write_inventory(opts)
      write_atomic_installer_answer_file(opts)
      create_ansible_config
      update_docker_storage_setup(opts)
      update_docker_config(opts)
      update_ha_master_config(opts)
      update_ha_infra_config(opts)
      return inventory
    end

    def main
      opts = parse
      inventory = prepare(opts)
      setup(inventory, opts.verbose)
      install(inventory, opts.verbose)
      post_install(inventory, opts.verbose)
    end
  end
end
