require 'test_plugin_helper'

module Actions::Fusor::Deployment::Rhev
  class OseLaunchTest < FusorActionTest
    TriggerProvisioning = ::Actions::Fusor::Host::TriggerProvisioning
    WaitUntilProvisioned = ::Actions::Fusor::Host::WaitUntilProvisioned

    #def setup
      #@launch = create_and_plan OseLaunch
      #@deployment = fusor_deployments(:rhev_and_cfme)
    #end

    test "launch ose" do
      launch = create_and_plan_action(OseLaunch, fusor_deployments(:rhev_and_cfme))

      action = run_action(launch)

    end

  end
end
