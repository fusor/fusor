require 'test_plugin_helper'

module Actions::Fusor
  class ConfigureHostGroupsTest < FusorActionTest
    class ID
      def id
        return 1
      end
    end

    class OS
      def id
        return 1
      end

      def media
        return [ID.new]
      end

      def ptables
        return [ID.new]
      end

      def architectures
        return [ID.new]
      end

      def save
        return nil
      end
    end


    def setup
      @deployment = fusor_deployments(:rhev)
      @action = create_action ConfigureHostGroups
      @rhev_hostgroup = SETTINGS[:fusor][:host_groups][:rhev]
      @rhev_hostgroup_length = @rhev_hostgroup[:host_groups].length
      @rhev_hostgroup[:host_groups].each do |hg|
        hg[:parent] = nil
        hg[:puppet_classes] = nil
      end
      @content_view = katello_content_views(:library_view)
      ::Katello::ContentView.stubs(:where).returns([@content_view])
      @hostgroup = hostgroups(:parent)
      key_params = @rhev_hostgroup[:host_groups].select do |hg|
        hg[:activation_key].present?
      end
      @activation_key_length = key_params.length
      ::Hostgroup.stubs(:where).returns([@hostgroup])
      ::Redhat.any_instance.stubs(:ptables).returns([nil])
      ::Ptable.stubs(:where).returns([nil])
      ::GroupParameter.stubs(:where).returns([parameters(:group)])
      ConfigureHostGroups.any_instance.stubs(:find_hostgroup).returns(@hostgroup)
      ConfigureHostGroups.any_instance.stubs(:find_operating_system).returns(OS.new)
      set_user
    end

    test "plan call should call plan_self" do
      Dynflow::Action.any_instance.expects(:plan_self).once
      plan_action @action, @deployment, 'rhev', @rhev_hostgroup
    end

    test "run should create hostgroup if it doesn't already exist" do
      ConfigureHostGroups.any_instance.stubs(:find_hostgroup).returns(nil)
      # I can't think of a great way to test this. for now just check to
      # ensure the methods were called

      ConfigureHostGroups.any_instance.expects(:apply_setting_parameter_overrides).times(@rhev_hostgroup_length)
      ::GroupParameter.expects(:create!).times(@activation_key_length)
      plan = plan_action @action, @deployment, 'rhev', @rhev_hostgroup
      assert_difference('Hostgroup.count', +@rhev_hostgroup_length, 'The number of hostgroups should increase') do
        run_action plan
      end
    end

    test "run should update hostgroup if it already exists" do
      # I can't think of a great way to test this. for now just check to
      # ensure the methods were called
      ConfigureHostGroups.any_instance.expects(:apply_setting_parameter_overrides).times(@rhev_hostgroup_length)
      @hostgroup.expects(:update_attributes!).times(@rhev_hostgroup_length)
      ::GroupParameter.any_instance.expects(:update_attributes!).times(@activation_key_length)
      @rhev_hostgroup[:parent] = nil
      plan = plan_action @action, @deployment, 'rhev', @rhev_hostgroup
      run_action plan
    end

  end
end
