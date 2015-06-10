require 'net/ssh'

# TODO: Remove this class when this branch is merged,
# https://github.com/fusor/fusor/blob/deploy-cfme/server/app/lib/utils/fusor/command_utils.rb,
# and additional changes here have been applied.
module Utils
  module Fusor
    class SSHConnection
      def initialize(host, user, password)
        @host = host
        @user = user
        @password = password
      end

      def call_complete
        @on_complete.call if @on_complete
      end

      def on_complete(hook)
        @on_complete = hook
      end

      def call_failure
        @on_failure.call if @on_failure
      end

      def on_failure(hook)
        @on_failure = hook
      end

      def execute(commands)
        begin
          # :timeout => how long to wait for the initial connection to be made
          Net::SSH.start(@host, @user, :password => @password, :timeout => 2,
                         :auth_methods => ["password"],
                         :number_of_password_prompts => 0) do |ssh|
            # open a new channel and configure a minimal set of callbacks, then run
            # the event loop until the channel finishes (closes)
            channel = ssh.open_channel do |ch|
              ch.request_pty do |ch, success|
                if !success
                  puts "Error: could not obtain pty"
                  call_failure
                  call_complete
                end
              end
              ch.exec commands do |ch, success|
                call_failure unless success

                # "on_data" is called when the process writes something to stdout
                ch.on_data do |c, data|
                  $stdout.print data
                end

                # "on_extended_data" is called when the process writes something to stderr
                ch.on_extended_data do |c, type, data|
                  $stderr.print data
                  call_failure
                end

                ch.on_close { call_complete }
              end
            end

            channel.wait
          end
        rescue Exception => e
          puts e.message
          puts e.backtrace.inspect
          call_failure
          call_complete
          e.message
        end
      end
    end
  end
end
