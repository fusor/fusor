#
# Copyright 2015 Red Hat, Inc.
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

module Fusor
  module OSEInstaller
    class Launch
      attr_accessor :output_dir

      def initialize
        @output_dir = "./tmp"
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
          opts.on('-v', '--verbose', 'Run verbosely') { |v| options[:verbose] = v }
        end.parse!

        options
      end

      def write_inventory(opts, inventory_file_name = "#{@output_dir}/ansible.hosts", template_file_name = "templates/ansible.hosts.template")
        template = File.read("#{File.dirname(__FILE__)}/#{template_file_name}")

        template = template.gsub(/<ssh_user>/, opts[:username])
        template = template.gsub(/<ssh_private_key>/, opts[:ssh_key])

        # if user is not root, we need to enable ansible_sudo flag
        if !opts[:username].eql? "root"
          template = template.gsub(/#ansible_sudo=true/, "ansible_sudo=true")
        end

        # master and worker node list
        masters_list = opts[:masters].join("\n")
        template = template.gsub(/<master_nodes>/, masters_list)

        nodes_list = opts[:nodes].join("\n")
        template = template.gsub(/<worker_nodes>/, nodes_list)

        # docker storage specifics
        template = template.gsub(/<docker_storage>/, opts[:docker_storage])
        template = template.gsub(/<docker_volume>/, opts[:docker_volume])
        template = template.gsub(/<docker_registry_host>/, opts[:docker_registry_host])
        template = template.gsub(/<docker_registry_path>/, opts[:docker_registry_path])

        # ose post installation specifics
        template = template.gsub(/<ose_user>/, opts[:ose_user])
        template = template.gsub(/<ose_password>/, opts[:ose_password])

        template = template.gsub(/<subdomain_name>/, opts[:subdomain_name])

        template = template.gsub(/<output_dir>/, @output_dir)

        unless Dir.exist?(@output_dir)
          FileUtils.mkdir_p(@output_dir)
        end

        File.open(inventory_file_name, 'w') { |file| file.puts template }

        inventory_file_name
      end

      def write_atomic_installer_answer_file(opts, answer_file_name = "#{@output_dir}/atomic-openshift-installer.answers.cfg.yml",
                                             template_file_name = "templates/atomic-openshift-installer.answers.cfg.yml.template")
        template = File.read("#{File.dirname(__FILE__)}/#{template_file_name}")

        node_entries = nil
        opts[:nodes].each do |n|
          stdout = `getent hosts #{n}`
          if stdout.empty?
            p "Cannot resolve ip for #{n}, skipping"
            next
          else
            ip = stdout.split("\n").first.split("  ").first
          end

          entry = "- connect_to: #{n}\n  hostname: #{n}\n  ip: #{ip}\n  node: true\n  public_hostname: #{n}\n  public_ip: #{ip}\n"
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
            p "Cannot resolve ip for #{m}, skipping"
            next
          else
            ip = stdout.split("\n").first.split("  ").first
          end

          entry = "- connect_to: #{m}\n  hostname: #{m}\n  ip: #{ip}\n  master: true\n  node: true\n  public_hostname: #{m}\n  public_ip: #{ip}\n"
          if master_entries.nil?
            master_entries = entry
          else
            master_entries += entry
          end
        end

        template = template.gsub(/<master_entries>/, master_entries) if !master_entries.nil?

        unless Dir.exist?(@output_dir)
          FileUtils.mkdir_p(@output_dir)
        end

        File.open(answer_file_name, 'w') { |file| file.puts template }
      end

      def spawn_process(cmd)
        proc = Process.spawn(cmd)
        Process.wait(proc)
        $?.exitstatus
      end

      def create_ansible_config
        # Create logging entry in ansible.cfg
        ansible_config_file = "ansible.cfg"
        File.open("#{@output_dir}/#{ansible_config_file}", 'w') { |file| file.puts "[default]\nhost_key_checking = False\nlog_path = #{@output_dir}/ansible.log" }
      end

      def update_docker_storage_setup(opts)
        docker_storage_setup_file = "files/docker-storage-setup"
        template = File.read("#{File.dirname(__FILE__)}/templates/docker-storage-setup.template")
        if !opts[:docker_storage].nil? and !opts[:docker_volume].nil?
          template = template.gsub(/<docker_storage>/, opts[:docker_storage])
          template = template.gsub(/<docker_volume>/, opts[:docker_volume])
        end
        File.open("#{File.dirname(__FILE__)}/#{docker_storage_setup_file}", 'w') { |file| file.puts template }
      end

      def set_output_dir(output_dir)
        @output_dir = output_dir
      end

      def prep_run_environment
        #ENV['ANSIBLE_CONFIG'] = "#{@output_dir}/ansible.cfg"
        ENV['ANSIBLE_HOST_KEY_CHECKING'] = "False"
        ENV['ANSIBLE_LOG_PATH'] = "#{@output_dir}/ansible.log"
      end

      def setup(inventory, verbose = false, playbook = "#{File.dirname(__FILE__)}/playbooks/setup.yml")
        flags = ""
        if verbose
          flags = "-v"
        end

        prep_run_environment
        puts "ansible: executing #{playbook} with #{inventory}"
        spawn_process("ansible-playbook #{flags} #{playbook} -i #{inventory}")
      end

      def install(inventory, verbose = false, playbook = "#{File.dirname(__FILE__)}/playbooks/install.yml")
        flags = ""
        if verbose
          flags = "-v"
        end

        prep_run_environment
        puts "ansible: executing #{playbook} with #{inventory}"
        spawn_process("ansible-playbook #{flags} #{playbook} -i #{inventory}")
      end

      def post_install(inventory, verbose = false, playbook = "#{File.dirname(__FILE__)}/playbooks/post_install.yml")
        flags = ""
        if verbose
          flags = "-v"
        end

        prep_run_environment
        puts "ansible: executing #{playbook} with #{inventory}"
        spawn_process("ansible-playbook #{flags} #{playbook} -i #{inventory}")
      end

      def prepare(opts, output_dir)
        set_output_dir(output_dir)
        inventory = write_inventory(opts)
        write_atomic_installer_answer_file(opts)
        create_ansible_config
        update_docker_storage_setup(opts)
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
end
