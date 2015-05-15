require 'net/ssh'

module Utils
  module Fusor
    class SSHConnection
      def initialize(host, user, password)
        @host = host
        @user = user
        @password = password
      end

      def on_complete(hook)
        @on_complete = hook
      end

      def on_failure(hook)
        @on_failure = hook
      end

      def execute(commands)
        Net::SSH.start(@host, @user, :password => @password) do |ssh|
          # open a new channel and configure a minimal set of callbacks, then run
          # the event loop until the channel finishes (closes)
          channel = ssh.open_channel do |ch|
            ch.request_pty do |ch, success|
              if !success
                puts "Error: could not obtain pty"
                @on_failure.call
                @on_complete.call
              end
            end
            ch.exec commands do |ch, success|
              @on_failure.call unless success

              # "on_data" is called when the process writes something to stdout
              ch.on_data do |c, data|
                $stdout.print data
              end

              # "on_extended_data" is called when the process writes something to stderr
              ch.on_extended_data do |c, type, data|
                $stderr.print data
                @on_failure.call
              end

              ch.on_close { @on_complete.call }
            end
          end

          channel.wait
        end
      end
    end
  end
end
