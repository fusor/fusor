require 'test_plugin_helper'
require 'net/ssh/test'
require 'stringio'

module Utils::Fusor
  class SSHConnectionTest < ActiveSupport::TestCase
    include Net::SSH::Test

    def setup
      @io = StringIO.new
    end

    def teardown
      @io.close unless @io.closed?
    end

    test "ssh connection should not call complete more than once " do
      cmd = "sudo yum -y localinstall /tmp/katello-ca-consumer-latest.noarch.rpm"

      # setup
      authentication_session = mock('authentication_session')
      authentication_session.stubs(:authenticate).returns(true)
      Net::SSH::Authentication::Session.stubs(:new).returns(authentication_session)
      Net::SSH::Transport::Session.stubs(:new).returns(mock('transport_session'))
      connection_session = mock('connection_session')
      Net::SSH::Connection::Session.expects(:new => connection_session)

      channel = mock('channel')
      channel.expects(:request_pty).yields(channel, true)
      channel.expects(:exec).with(cmd).yields(channel, true)
      channel.expects(:wait).at_least_once
      channel.expects(:on_data).yields(nil, "output from cmd")
      channel.expects(:on_extended_data).at_least_once
      channel.expects(:on_close).yields

      connection_session.expects(:open_channel).returns(channel).yields(channel)
      connection_session.expects(:closed?).returns(false)
      connection_session.expects(:close).once

      callback = mock('complete')
      callback.expects(:complete).at_most_once

      # actual test
      client = SSHConnection.new('localhost', 'testuser', 'notapassword')
      client.on_complete(lambda { callback.complete })
      client.execute(cmd, @io)
    end

  end
end
