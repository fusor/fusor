require 'test_plugin_helper'

class DeploymentHostTest < ActiveSupport::TestCase

  test "can only have one deployment host per discovered host" do
    skip # If we want to enable this test delete this line
    host = fusor_deployment_hosts(:deployment_host1)
    host2 = fusor_deployment_hosts(:deployment_host2)
    host.discovered_host = host2.discovered_host
    assert_not host.save, "Saved deployment host that mapped to same discovered host as another deployment host"
  end

end
