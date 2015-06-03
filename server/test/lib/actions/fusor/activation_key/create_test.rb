require 'test_plugin_helper'

module Actions::Fusor::ActivationKey
  class CreateTest < FusorActionTest
    KatelloCreate = ::Actions::Katello::ActivationKey::Create

    def setup
      @create = create_action Create
    end

    test "plan call should call Katello AC Create plan menthod" do
      KatelloCreate.any_instance.expects(:plan).once
      @create.plan(1)
    end

    test "run call should call Katello AC Create finalize" do
      KatelloCreate.any_instance.expects(:run).never
      KatelloCreate.any_instance.expects(:finalize).once
      @create.run
    end

    test "finalize call should do nothing" do
      KatelloCreate.any_instance.expects(:finalize).never
      @create.finalize
    end

  end
end
