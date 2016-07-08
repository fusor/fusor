require 'test_plugin_helper'

module Actions::Fusor::Deployment::Rhev
  class DeployTest < FusorActionTest
    TriggerProvisioning = ::Actions::Fusor::Host::TriggerProvisioning
    WaitUntilProvisioned = ::Actions::Fusor::Host::WaitUntilProvisioned
    CreateEngineHostRecord = ::Actions::Fusor::Deployment::Rhev::CreateEngineHostRecord

    class ID
      def id
        return 1
      end
    end

    def setup
      @deploy = create_action ::Actions::Fusor::Deployment::Rhev::Deploy
      ::Puppetclass.stubs(:where).returns([ID.new])
      ::Puppetclass.stubs(:find).returns(ID.new)
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
                                @deployment.rhev_engine_host.id, true)

      for hypervisor in @deployment.rhev_hypervisor_hosts
        assert_action_planed_with(@deploy,
                                  TriggerProvisioning,
                                  @deployment,
                                  'RHEV-Hypervisor',
                                  hypervisor)
        assert_action_planed_with(@deploy,
                                  WaitUntilProvisioned,
                                  hypervisor.id, true)
      end
    end
    test "plan call should schedule provision and wait actions for each host for self-hosted" do
      @deployment = fusor_deployments(:rhev_self_hosted)
      plan_action(@deploy, fusor_deployments(:rhev_self_hosted))
      assert_action_planed_with(@deploy,
                                CreateEngineHostRecord,
                                @deployment,
                                'RHEV-Self-hosted')

      first_host = @deployment.rhev_hypervisor_hosts[0]
      additional_hosts = @deployment.rhev_hypervisor_hosts[1..-1]
      puppetclass_id = 1

      assert_action_planed_with(@deploy,
                                  TriggerProvisioning,
                                @deployment,
                                'RHEV-Self-hosted',
                                first_host)
      assert_action_planed_with(@deploy,
                                WaitUntilProvisioned,
                                first_host.id, true)

      additional_hosts.each_with_index do |hypervisor, index|
        override = {
          puppetclass_id => {
            :additional_host => true,
            :host_id => index + 2
          }
        }
        assert_action_planed_with(@deploy,
                                  TriggerProvisioning,
                                  @deployment,
                                  'RHEV-Self-hosted',
                                  hypervisor, override)
        assert_action_planed_with(@deploy,
                                  WaitUntilProvisioned,
                                  hypervisor.id, true)
      end
    end

  end
end
