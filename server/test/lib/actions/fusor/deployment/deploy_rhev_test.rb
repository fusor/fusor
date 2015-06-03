require 'test_plugin_helper'

module Actions::Fusor::Deployment
  class DeployRhevTest < FusorActionTest
    TriggerProvisioning = ::Actions::Fusor::Host::TriggerProvisioning
    WaitUntilProvisioned = ::Actions::Fusor::Host::WaitUntilProvisioned

    def setup
      @deploy = create_action DeployRhev
      @deployment = fusor_deployments(:rhev_and_cfme)
    end

    test "plan call should schedule provision and wait actions for each host" do
      plan_action(@deploy, fusor_deployments(:rhev_and_cfme))
      assert_action_planed_with(@deploy,
                                TriggerProvisioning,
                                @deployment,
                                'RHEV-Engine',
                                @deployment.rhev_engine_host)
      assert_action_planed_with(@deploy,
                                WaitUntilProvisioned,
                                @deployment.rhev_engine_host)

      for hypervisor in @deployment.rhev_hypervisor_hosts
        assert_action_planed_with(@deploy,
                                  TriggerProvisioning,
                                  @deployment,
                                  'RHEV-Hypervisor',
                                  hypervisor)
        assert_action_planed_with(@deploy,
                                  WaitUntilProvisioned,
                                  hypervisor)
      end
    end

  end
end
