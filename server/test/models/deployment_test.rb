# encoding: utf-8
require 'test_plugin_helper'

class DeploymentTest < ActiveSupport::TestCase

  describe "deployment" do
    before do
      # skip nfs mount validation as it calls commands from the command line
      Fusor::Validators::DeploymentValidator.any_instance.stubs(:validate_storage_share)
    end

    test "should not save without name" do
      deployment = fusor_deployments(:rhev)
      deployment.name = nil
      assert_not deployment.save, "Saved deployment without a name"
    end

    test "should not save with duplicate name" do
      rhev_d = fusor_deployments(:rhev)
      rhev_d2 = fusor_deployments(:another_rhev)
      rhev_d2.name = rhev_d.name
      assert_not rhev_d2.save, "Saved deployment with a duplicate name"
    end

    test "should generate a label on create" do
      new_rhev = fusor_deployments(:rhev).dup
      new_rhev.name = "Name with space"
      new_rhev.label = nil
      new_rhev.save!
      assert_equal "Name_with_space", new_rhev.label, "Label was not properly generated on create"
    end

    test "should update a label on save" do
      rhev_d = fusor_deployments(:rhev)
      rhev_d.name = "Updated Name"
      rhev_d.save!
      assert_equal "Updated_Name", rhev_d.label, "Label was not properly updated on save"
    end

    test "should not save with duplicate label" do
      rhev_d2 = fusor_deployments(:another_rhev).dup
      rhev_d2.name = "another rhev" #space results in same label as "another_rhev"
      assert_not rhev_d2.save, "Saved deployment with a duplicate label"
    end

    test "should not save with no org" do
      rhev_d = fusor_deployments(:rhev)
      rhev_d.organization_id = nil
      assert_not rhev_d.save, "Saved with no organization"
    end

    describe "single deployment" do
      test "should validate deployment when no other deployment is running" do
        deployment = fusor_deployments(:rhev)
        assert deployment.valid?, 'Validation error for single deployment'
        assert_empty deployment.errors[:foreman_task_uuid]
      end

      test "should validate deployment when other deployments are complete" do
        deployment = fusor_deployments(:rhev)
        another_deployment = fusor_deployments(:another_rhev)
        another_deployment.foreman_task = foreman_tasks_tasks(:successful_deployment_task)
        assert deployment.valid?, 'Validation error for subsequent deployments'
        assert_empty deployment.errors[:foreman_task_uuid]
      end

      test "should not validate deployment when another deployment is running" do
        deployment = fusor_deployments(:rhev)
        another_deployment = fusor_deployments(:another_rhev)
        another_deployment.foreman_task = foreman_tasks_tasks(:running_deployment_task)
        another_deployment.save
        assert_not deployment.valid?, 'Validated deployment when another running deployment exists'
        assert_not_empty deployment.errors[:foreman_task_uuid]
      end
    end

    describe "rhev deployment" do
      test "should not save rhev deployment with empty password" do
        rhev_d = fusor_deployments(:rhev)
        rhev_d.rhev_root_password = ''
        assert rhev_d.deploy_rhev, "Is not a rhev deployment"
        assert_not rhev_d.save, "Saved with no password"
      end

      test "should not save rhev deployment with short password" do
        rhev_d = fusor_deployments(:rhev)
        rhev_d.rhev_root_password = 'redhat'
        assert rhev_d.deploy_rhev, "Is not a rhev deployment"
        assert_not rhev_d.save, "Saved with a short (< 8 char) password"
      end

      test "should not save rhev deployment with empty engine admin password" do
        rhev_d = fusor_deployments(:rhev)
        rhev_d.rhev_engine_admin_password = ''
        assert rhev_d.deploy_rhev, "Is not a rhev deployment"
        assert_not rhev_d.save, "Saved with no engine admin password"
      end

      test "should not save rhev deployment with duplicate rhev engine host" do
        skip # If we want to enable this test delete this line
        rhev_d = fusor_deployments(:rhev)
        rhev_d2 = fusor_deployments(:another_rhev)
        rhev_d2.rhev_engine_host = rhev_d.rhev_engine_host
        assert rhev_d.deploy_rhev, "Is not a rhev deployment"
        assert rhev_d2.deploy_rhev, "Is not a rhev deployment"
        assert_not rhev_d2.save, "Saved deployment with a rhev engine another deployment is using"
      end

      test "should not save rhev deployment with no rhev engine host" do
        rhev_d = fusor_deployments(:rhev)
        rhev_d.rhev_engine_host = nil
        assert rhev_d.deploy_rhev, "Is not a rhev deployment"
        assert_not rhev_d.save, "Saved rhev deployment with no rhev engine"
      end

      test "should not validate rhev deployment with a managed rhev engine host" do
        rhev_d = fusor_deployments(:rhev)
        rhev_d.rhev_engine_host.update_attribute(:managed, true)
        assert_not rhev_d.valid?, 'Validated rhev deployment using a managed host as an engine'
        assert_not_empty rhev_d.errors[:rhev_engine_host_id]
      end

      test "should not save rhev deployment with no rhev hypervisors" do
        rhev_d = fusor_deployments(:rhev)
        rhev_d.rhev_hypervisor_hosts.clear
        assert rhev_d.deploy_rhev, "Is not a rhev deployment"
        assert_not rhev_d.save, "Saved rhev deployment with no rhev hypervisors"
      end

      test "should not validate rhev deployment with a managed rhev engine host" do
        rhev_d = fusor_deployments(:rhev)
        rhev_d.discovered_hosts[0].update_attribute(:managed, true)
        assert_not rhev_d.valid?, 'Validated rhev deployment using a managed host as a hypervisor'
        assert_not_empty rhev_d.errors[:rhev_hypervisor_hosts]
      end

      test "should not save rhev deployment if hypervisor is used as rhev engine somewhere else" do
        skip # If we want to enable this test delete this line
        rhev_d = fusor_deployments(:rhev)
        assert rhev_d.deploy_rhev, "Is not a rhev deployment"
        rhev_d2 = fusor_deployments(:another_rhev)
        assert_not_nil rhev_d2.rhev_engine_host, "Test data is missing rhev engine"
        rhev_d.rhev_hypervisor_hosts.push(rhev_d2.rhev_engine_host)
        assert_not rhev_d.save, "Saved rhev deployment using hypervisor that is already in use as rhev engine"
      end

      test "should not save rhev deployment if engine is used as hypervisor somewhere else" do
        skip # If we want to enable this test delete this line
        rhev_d = fusor_deployments(:rhev)
        assert rhev_d.deploy_rhev, "Is not a rhev deployment"
        rhev_d2 = fusor_deployments(:another_rhev)
        assert_not_empty rhev_d2.rhev_hypervisor_hosts, "Test data is missing rhev hypervisor"
        rhev_d.rhev_engine_host = rhev_d2.rhev_hypervisor_hosts.first
        assert_not rhev_d.save, "Saved rhev deployment using hypervisor that is already in use as rhev engine"
      end

      test "should not save rhev deployment if storage type is not a recognized type" do
        rhev = fusor_deployments(:rhev)
        rhev.rhev_storage_type = 'asdf'
        assert_not rhev.save, "Saved rhev deployment with a nonsense storage type"
      end

      test "should not save rhev deployment if storage type is nfs and missing address" do
        rhev = fusor_deployments(:rhev)
        rhev.rhev_storage_type = 'NFS'
        rhev.rhev_storage_address = nil
        assert_not rhev.save, "Saved rhev deployment that used nfs but had no address"
      end

      test "should not save rhev deployment if storage type is nfs and missing path" do
        rhev = fusor_deployments(:rhev)
        rhev.rhev_storage_type = 'NFS'
        rhev.rhev_share_path = nil
        assert_not rhev.save, "Saved rhev deployment that used nfs but had no path"
      end

      test "should not save rhev deployment if nfs path ends in slash" do
        rhev = fusor_deployments(:rhev)
        rhev.rhev_storage_type = 'NFS'
        rhev.rhev_share_path = '/invalid/path/'
        assert_not rhev.save, "Saved rhev deployment who's nfs path ended in a slash"
      end

      test "should not save rhev deployment if nfs path contains non-ascii characters" do
        rhev = fusor_deployments(:rhev)
        rhev.rhev_storage_type = 'NFS'
        rhev.rhev_share_path = '/å'
        assert_not rhev.save, "Saved rhev deployment who's nfs path contained non-ascii characters"
      end

      test "should invalidate rhev deployment if NFS path does not have a leading slash" do
        rhev = fusor_deployments(:rhev)
        rhev.rhev_storage_type = 'NFS'
        rhev.rhev_share_path = 'test/this/out'
        assert rhev.invalid?
        assert_equal 'NFS path specified does not start with a "/", which is invalid',
                     rhev.errors[:rhev_share_path].first
      end

      test "should not save rhev deployment if storage type is local and missing local path" do
        rhev = fusor_deployments(:rhev)
        rhev.rhev_storage_type = 'Local'
        rhev.rhev_local_storage_path = nil
        assert_not rhev.save, "Saved rhev deployment that used local storage but had no path"
      end

      test "should not save rhev deployment if storage type is gluster and missing gluster address" do
        rhev = fusor_deployments(:rhev)
        rhev.rhev_storage_type = 'glusterfs'
        rhev.rhev_storage_address = nil
        assert_not rhev.save, "Saved rhev deployment that used gluster storage but had no address"
      end

      test "should not save rhev deployment if storage type is gluster and missing gluster path" do
        rhev = fusor_deployments(:rhev)
        rhev.rhev_storage_type = 'glusterfs'
        rhev.rhev_share_path = nil
        assert_not rhev.save, "Saved rhev deployment that used gluster storage but had no path"
      end

      test "should not save rhev deployment if storage type is gluster and gluster path contains non-ascii characters" do
        rhev = fusor_deployments(:rhev)
        rhev.rhev_storage_type = 'glusterfs'
        rhev.rhev_share_path = 'å'
        assert_not rhev.save, "Saved rhev deployment who's gluster path contained non-ascii characters"
      end

      test "should not save rhev deployment if glusterfs path ends in slash" do
        rhev = fusor_deployments(:rhev)
        rhev.rhev_storage_type = 'glusterfs'
        rhev.rhev_share_path = 'gv1/'
        assert_not rhev.save, "Saved rhev deployment who's glusterfs path ended in a slash"
      end

      test "should not save rhev deployment if glusterfs path starts in slash" do
        rhev = fusor_deployments(:rhev)
        rhev.rhev_storage_type = 'glusterfs'
        rhev.rhev_share_path = '/gv0'
        assert_not rhev.save, "Saved rhev deployment who's glusterfs path ended in a slash"
      end

      test "should not save rhev deployment if self hosted and storage is empty" do
        rhev = fusor_deployments(:rhev_self_hosted)
        rhev.hosted_storage_address = nil
        assert_not rhev.save, "Saved self hosted rhev deployment who's hosted storage address is empty"
      end

      test "should not save rhev deployment if self hosted and path is empty" do
        rhev = fusor_deployments(:rhev_self_hosted)
        rhev.hosted_storage_path = nil
        assert_not rhev.save, "Saved self hosted rhev deployment who's hosted storage path is empty"
      end

      test "should not save rhev deployment if self hosted and gluster path ends in a slash" do
        rhev = fusor_deployments(:rhev_self_hosted)
        rhev.rhev_storage_type = 'glusterfs'
        rhev.hosted_storage_path = 'gv0/'
        assert_not rhev.save, "Saved self hosted rhev deployment who's hosted gluster storage path ends in a slash"
      end

      test "should not save rhev deployment if self hosted and gluster path begins with a slash" do
        rhev = fusor_deployments(:rhev_self_hosted)
        rhev.rhev_storage_type = 'glusterfs'
        rhev.hosted_storage_path = '/gv0'
        assert_not rhev.save, "Saved self hosted rhev deployment who's hosted gluster storage path begins with a slash"
      end

      test "should not save rhev self hosted deployment if hosted nfs storage path ends in slash" do
        rhev = fusor_deployments(:rhev_self_hosted)
        rhev.rhev_storage_type = 'NFS'
        rhev.hosted_storage_path = '/invalid/path/'
        assert_not rhev.save, "Saved rhev self hosted deployment who's hosted nfs storage path ended in a slash"
      end

      test "should invalidate rhev self hosted deployment if hosted NFS path does not have a leading slash" do
        rhev = fusor_deployments(:rhev_self_hosted)
        rhev.rhev_storage_type = 'NFS'
        rhev.hosted_storage_path = 'test/this/out'
        assert rhev.invalid?
        assert_equal 'NFS path specified does not start with a "/", which is invalid',
                     rhev.errors[:hosted_storage_path].first
      end

      test "should not save rhev self hosted deployment if hosted storage path contains non-ascii characters" do
        rhev = fusor_deployments(:rhev_self_hosted)
        rhev.hosted_storage_path = '/å'
        assert_not rhev.save, "Saved rhev self hosted deployment who's storage path contained non-ascii characters"
      end
    end

    describe "cfme deployment" do
      test "should not save cfme deployment with short password" do
        cfme_d = fusor_deployments(:rhev_and_cfme)
        cfme_d.cfme_root_password = 'redhat'
        assert cfme_d.deploy_cfme, "Is not a cfme deployment"
        assert_not cfme_d.save, "Saved with a short (< 8 char) password"
      end

      test "cfme deployments must also deploy rhev or openstack" do
        cfme = fusor_deployments(:rhev_and_cfme)
        cfme.deploy_cfme = true
        cfme.deploy_rhev = false
        cfme.deploy_openstack = false
        assert_not cfme.save, "Saved cfme deployment that did not deploy rhev or openstack"
      end

      test "cfme deployments must specify install location" do
        cfme = fusor_deployments(:rhev_and_cfme)
        cfme.cfme_install_loc = ''
        assert_not cfme.save, "Saved cfme deployment that did not specify install location"
      end

      test "cfme deployments must specify root password" do
        cfme = fusor_deployments(:rhev_and_cfme)
        cfme.cfme_root_password = ''
        assert_not cfme.save, "Saved cfme deployment that did not specify root password"
      end

      test "cfme deployments should not save if export storage address is empty" do
        cfme = fusor_deployments(:rhev_and_cfme)
        cfme.rhev_export_domain_address = nil
        assert_not cfme.save, "Saved cfme deployment with empty export storage address"
      end

      test "cfme deployments should not save if export storage path is empty" do
        cfme = fusor_deployments(:rhev_and_cfme)
        cfme.rhev_export_domain_path = nil
        assert_not cfme.save, "Saved cfme deployment with empty export storage path"
      end

      test "cfme deployments should not save if export gluster storage path ends in a slash" do
        cfme = fusor_deployments(:rhev_and_cfme)
        cfme.rhev_storage_type = 'glusterfs'
        cfme.rhev_export_domain_path = "gv0/"
        assert_not cfme.save, "Saved cfme deployment with gluster storage path that ends in a slash"
      end

      test "cfme deployments should not save if export gluster storage path begins with a slash" do
        cfme = fusor_deployments(:rhev_and_cfme)
        cfme.rhev_storage_type = 'glusterfs'
        cfme.rhev_export_domain_path = "/gv0"
        assert_not cfme.save, "Saved cfme deployment with gluster storage path beginning in a slash"
      end
    end
  end

  describe "deployment with nfs share" do
    test "should set warning if nfs share not found" do
      result = [1, []]
      Utils::Fusor::CommandUtils.stubs(:run_command).returns(result)
      rhev = fusor_deployments(:rhev)
      assert rhev.valid? # warnings don't invalidate the deployment
      assert_match /Could not connect to address/, rhev.warnings.first
    end
  end

end
