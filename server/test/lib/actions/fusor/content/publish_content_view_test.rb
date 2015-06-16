require 'test_plugin_helper'

module Actions::Fusor::Content
  class PublishContentViewTest < FusorActionTest
    Update = ::Actions::Katello::ContentView::Update
    Publish = ::Actions::Katello::ContentView::Publish
    Promote = ::Actions::Katello::ContentView::Promote

    def setup
      @deployment = fusor_deployments(:rhev)
      @repositories = [ katello_repositories(:fedora_17_x86_64) ]
      @rpm_view = katello_content_views(:library_dev_staging_view)
      @rpm_view.repositories = @repositories
      @rpm_view.save
      @composite_view = katello_content_views(:composite_view)
      @action = create_action PublishContentView
      @puppet_view = katello_content_views(:library_dev_view)
      PublishContentView.any_instance.stubs(:puppet_content_view_name).returns(@puppet_view.name)
      library = @deployment.organization.library
      @composite_view.component_ids = [@rpm_view.version(library).id, @puppet_view.version(library).id].compact
      @composite_view.save
    end

    # Flow of plan:
    # 1) if the composit content view does not already exist, create it
    # 2) if the rpm content view does not already exist, create it
    # 3) if the rpm cv contains repos that are not explicitly passed in
    #       to plan, update and publish it
    # 4) if the puppet cv and rpm cv's versions are not in the composite
    #       cv's component_ids, update and publish the composit cv
    # 5) if the deployment's environment is not library and the composit cv
    #       has not already been promoted to this environment, promote it
    # 6) plan_self

    test "plan should plan_self if everything already exists" do
      PublishContentView.any_instance.stubs(:composite_content_view_name).returns(@composite_view.name)
      # this content view has no repositories
      PublishContentView.any_instance.stubs(:rpm_content_view_name).returns(@rpm_view.name)
      Dynflow::Action.any_instance.expects(:plan_self).once
      ::Katello::ContentView.expects(:create!).never
      plan_action @action, @deployment, @repositories
      refute_action_planed @action, Update
      refute_action_planed @action, Publish
      refute_action_planed @action, Promote
    end

    test "plan should create rpm view and schedule update / publish if it doesn't already exist" do
      PublishContentView.any_instance.stubs(:composite_content_view_name).returns(@composite_view.name)
      Dynflow::Action.any_instance.expects(:plan_self).once
      plan_action @action, @deployment, @repositories
      assert_action_planed @action, Update
      assert_action_planed @action, Publish
      refute_action_planed @action, Promote
    end

    test "plan should create composite view and schedule update / publish if it doesn't already exist" do
      # this content view has no repositories
      PublishContentView.any_instance.stubs(:rpm_content_view_name).returns(@rpm_view.name)
      Dynflow::Action.any_instance.expects(:plan_self).once
      plan_action @action, @deployment, @repositories
      assert_action_planed @action, Update
      assert_action_planed @action, Publish
      refute_action_planed @action, Promote
    end

    test "plan should promote the composite view if we're deploying to dev" do 
      PublishContentView.any_instance.stubs(:composite_content_view_name).returns(@composite_view.name)
      # this content view has no repositories
      PublishContentView.any_instance.stubs(:rpm_content_view_name).returns(@rpm_view.name)
      Dynflow::Action.any_instance.expects(:plan_self).once
      ::Katello::ContentView.expects(:create!).never

      @deployment.lifecycle_environment = katello_environments(:dev)
      plan_action @action, @deployment, @repositories
      refute_action_planed @action, Update
      refute_action_planed @action, Publish
      assert_action_planed @action, Promote
    end

    test "plan should schedule update / publish if rpm view is missing a required repository" do
      PublishContentView.any_instance.stubs(:composite_content_view_name).returns(@composite_view.name)
      # this content view has no repositories
      PublishContentView.any_instance.stubs(:rpm_content_view_name).returns(@rpm_view.name)
      Dynflow::Action.any_instance.expects(:plan_self).once
      ::Katello::ContentView.expects(:create!).never

      @repositories.push katello_repositories(:rhel_7_x86_64)
      plan_action @action, @deployment, @repositories
      assert_action_planed @action, Update
      assert_action_planed @action, Publish
      refute_action_planed @action, Promote
    end

    test "plan should schedule update / publish if composite view is not correctly linked with its components" do
      PublishContentView.any_instance.stubs(:composite_content_view_name).returns(@composite_view.name)
      # this content view has no repositories
      PublishContentView.any_instance.stubs(:rpm_content_view_name).returns(@rpm_view.name)
      Dynflow::Action.any_instance.expects(:plan_self).once
      ::Katello::ContentView.expects(:create!).never

      @composite_view.component_ids = []
      @composite_view.save
      plan_action @action, @deployment, @repositories
      assert_action_planed @action, Update
      assert_action_planed @action, Publish
      refute_action_planed @action, Promote
    end

    test "run needs to call update_puppet_environment so we'll have the puppet class available" do
      PublishContentView.any_instance.stubs(:composite_content_view_name).returns(@composite_view.name)
      # this content view has no repositories
      PublishContentView.any_instance.stubs(:rpm_content_view_name).returns(@rpm_view.name)
      #::Katello::ContentView.stubs(:find).returns("content view")
      #::Katello::KTEnvironment.stubs(:find).returns("environment")
      ::Katello::Foreman.expects(:update_puppet_environment).once
      plan = plan_action @action, @deployment, @repositories
      run_action plan
    end

  end
end
