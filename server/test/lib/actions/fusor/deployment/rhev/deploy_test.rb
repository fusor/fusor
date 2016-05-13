require 'test_plugin_helper'

module Actions::Fusor::Deployment::Rhev
  class DeployTest < FusorActionTest
    TriggerProvisioning = ::Actions::Fusor::Host::TriggerProvisioning
    WaitUntilProvisioned = ::Actions::Fusor::Host::WaitUntilProvisioned
    CreateEngineHostRecord = ::Actions::Fusor::Deployment::Rhev::CreateEngineHostRecord

    def setup
      @deploy = create_action Deploy
    end

    test "plan call should schedule provision and wait actions for each host for hypervisor + engine" do
      @deployment = fusor_deployments(:rhev_and_cfme)
      plan_action(@deploy, fusor_deployments(:rhev_and_cfme))
      assert_action_planed_with(@deploy,
                                TriggerProvisioning,
                                @deployment,
                                'RHEV-Engine',
                                @deployment.rhev_engine_host)
      assert_action_planed_with(@deploy,
                                WaitUntilProvisioned,
                                @deployment.rhev_engine_host.id)

      for hypervisor in @deployment.rhev_hypervisor_hosts
        assert_action_planed_with(@deploy,
                                  TriggerProvisioning,
                                  @deployment,
                                  'RHEV-Hypervisor',
                                  hypervisor)
        assert_action_planed_with(@deploy,
                                  WaitUntilProvisioned,
                                  hypervisor.id)
      end
    end
    test "plan call should schedule provision and wait actions for each host for self-hosted" do
      @deployment = fusor_deployments(:rhev_self_hosted)
      plan_action(@deploy, fusor_deployments(:rhev_self_hosted))
      assert_action_planed_with(@deploy,
                                CreateEngineHostRecord,
                                @deployment,
                                'RHEV-Self-hosted')

      for hypervisor in @deployment.rhev_hypervisor_hosts
        assert_action_planed_with(@deploy,
                                  TriggerProvisioning,
                                  @deployment,
                                  'RHEV-Self-hosted',
                                  hypervisor)
        assert_action_planed_with(@deploy,
                                  WaitUntilProvisioned,
                                  hypervisor.id)
      end
    end

  end
end
