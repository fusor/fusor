require 'test_plugin_helper'

module Utils::Fusor
  class CommandUtilsTest < ActiveSupport::TestCase

    test "should run command without incident" do
      status, output = CommandUtils.run_command("/bin/ls -l")
      assert_equal 0, status, "status was not 0"
      assert_not_nil output
    end

    test "should raise an error if command not found" do
      assert_raise Errno::ENOENT do
        CommandUtils.run_command("sl")
      end
    end

    test "should failed command correctly" do
      status, output = CommandUtils.run_command("test -d /foobar")
      assert_not_equal 0, status, "failed command not handled correctly"
      assert_empty output
    end
  end
end
