
module Utils
  module Fusor
    class SSHKeyUtils
      def initialize(deployment)
        @deployment = deployment
      end

      def generate_ssh_keys
        key = OpenSSL::PKey::RSA.new 2048
        private_key = key.to_s
        public_key = "#{key.ssh_type} #{[key.to_blob].pack('m0')}\n"
        FileUtils.mkdir_p("#{Rails.root}/.ssh/")

        key = File.open(get_ssh_private_key_path, "w", 0600)
        key.write(private_key)
        key.close

        key = File.open("#{get_ssh_private_key_path}.pub", "w", 0600)
        key.write(public_key)
        key.close

        { :private_key => private_key, :public_key => public_key }
      end

      def get_ssh_private_key_path
        "#{Rails.root}/.ssh/id_rsa-#{@deployment.label}"
      end

      def copy_keys_to_user(hostname, username, password = nil)
        copy_keys_to_root(hostname, password)
        client = Utils::Fusor::SSHConnection.new(hostname, 'root', password, get_ssh_private_key_path)

        client.execute("useradd #{username}")
        client.execute("echo '#{username}        ALL=(ALL)       NOPASSWD: ALL' > /etc/sudoers.d/#{username}")
        ssh_dir = "/home/#{username}/.ssh"
        client.execute("install -o #{username} -g #{username} -m 700 -d #{ssh_dir}")
        client.execute("install -o #{username} -g #{username} -m 600 ~/.ssh/id_rsa.pub #{ssh_dir}")
        client.execute("install -o #{username} -g #{username} -m 600 ~/.ssh/id_rsa     #{ssh_dir}")
        client.execute("install -o #{username} -g #{username} -m 600 #{ssh_dir}/id_rsa.pub #{ssh_dir}/authorized_keys")
      end

      def copy_keys_to_root(hostname, password = nil)
        client = Utils::Fusor::SSHConnection.new(hostname, 'root', password, get_ssh_private_key_path)

        client.execute("install -o root -g root -m 700 -d ~/.ssh")
        Net::SCP.start(hostname, "root", {:password => password, :keys => [get_ssh_private_key_path], :paranoid => false}) do |scp|
          scp.upload!(StringIO.new(@deployment.ssh_private_key), ".ssh/id_rsa")
          scp.upload!(StringIO.new(@deployment.ssh_public_key), ".ssh/id_rsa.pub")
        end
        client.execute("chmod 600 ~/.ssh/id_rsa*")
        copy_pub_key_to_auth_keys(hostname, 'root', password)
      end

      def copy_pub_key_to_auth_keys(hostname, username, password)
        ENV['SSHPASS'] = password
        oldhome = ENV['HOME']
        ENV['HOME'] = "#{Rails.root}" #FIXME: Why is HOME getting set under "/tmp/#{deployment.label}"
        system("sshpass -e ssh-copy-id -i #{get_ssh_private_key_path} -o UserKnownHostsFile=/dev/null -o StrictHostKeyChecking=no #{username}@#{hostname}")
        ENV['SSHPASS'] = nil
        ENV['HOME'] = oldhome
      end
    end
  end
end
