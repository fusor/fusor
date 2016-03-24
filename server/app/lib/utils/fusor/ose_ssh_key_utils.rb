
module Utils
  module Fusor
    class OseSshKeyUtils
      def initialize(deployment, key_type)
        @deployment = deployment
        @key_type = key_type
        @key_from_path = File.join(Rails.root, 'ssh-keys', 'openshift', "#{@deployment.label}-#{@deployment.id}")
        @key_to_path   = ".ssh"
        @key_base_name = "id_#{@key_type}"

        #TODO need to read this from deployment set from WebUI
        @root_password = 'dog8code'
      end

      def get_ssh_private_key_path
        return "#{@key_from_path}/#{@key_base_name}"
      end

      def generate_ssh_keys
        if File.directory?(@key_from_path)
          ::Fusor.log.debug "====== ssh keys folder '#{@key_from_path}' already exists! skipping key generation"
        else
          Utils::Fusor::CommandUtils.run_command("mkdir -p #{@key_from_path}")
          Utils::Fusor::CommandUtils.run_command("ssh-keygen -f #{@key_from_path}/#{@key_base_name} -N '' -t #{@key_type}")
          ::Fusor.log.debug "====== ssh keys have been generated"
        end
      end

      def copy_keys_to_user(hostname, username)
        copy_keys_to_root(hostname)
        client = Utils::Fusor::SSHConnection.new(hostname, 'root', @root_password)
        client.execute("useradd #{username}")
        client.execute("runuser -l #{username} -c 'mkdir ~/#{@key_to_path} && chmod 700 ~/#{@key_to_path}'")
        client.execute("cp ~/#{@key_to_path}/#{@key_base_name}.pub /home/#{username}/#{@key_to_path}/")
        client.execute("chown #{username} /home/#{username}/#{@key_to_path}/#{@key_base_name}.pub")
        client.execute("chgrp #{username} /home/#{username}/#{@key_to_path}/#{@key_base_name}.pub")
        client.execute("cp ~/#{@key_to_path}/#{@key_base_name} /home/#{username}/#{@key_to_path}/")
        client.execute("chown #{username} /home/#{username}/#{@key_to_path}/#{@key_base_name}")
        client.execute("chgrp #{username} /home/#{username}/#{@key_to_path}/#{@key_base_name}")
        client.execute("runuser -l #{username} -c 'more ~/#{@key_to_path}/#{@key_base_name}.pub > ~/#{@key_to_path}/authorized_keys'")
        client.execute("runuser -l #{username} -c 'chmod 644 ~/#{@key_to_path}/#{@key_base_name}.pub'")
        client.execute("runuser -l #{username} -c 'chmod 600 ~/#{@key_to_path}/#{@key_base_name}'")
        client.execute("runuser -l #{username} -c 'chmod 644 ~/#{@key_to_path}/authorized_keys'")
      end

      private

      def copy_keys_to_root(hostname)
        client = Utils::Fusor::SSHConnection.new(hostname, 'root', @root_password)
        client.execute("mkdir -p ~/#{@key_to_path} && chmod 700 ~/#{@key_to_path}")
        ssh_keys = ["#{@key_base_name}", "#{@key_base_name}.pub"]
        ssh_keys.each { |key|
          from_path = "#{@key_from_path}/#{key}"
          to_path   = "/root/#{@key_to_path}/#{key}"
          Net::SCP.start(hostname, "root", :password => @root_password, :paranoid => false) do |scp|
            scp.upload!(from_path, to_path)
          end
        }
      end
    end
  end
end
