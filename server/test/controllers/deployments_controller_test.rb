require 'test_plugin_helper'

module Fusor
  class Api::V21::DeploymentsControllerTest < ActionController::TestCase

    def setup
      @deployment = fusor_deployments(:rhev)
      # magic, without this some of the routes don't resolve for some reason
      fix_routes
    end

    test "index request should return array of deployments" do
      response = JSON.parse(get(:index).body)
      assert_response :success
      names = []
      for deployment in response['deployments']
        names.push(deployment['name'])
      end
      assert names.include?(@deployment.name), "Response was not correct, did not include rhev deployment"
    end

    test "show request should return the deployment" do
      response = JSON.parse(get(:show, :id => @deployment.id).body)
      assert_response :success
      assert_equal @deployment.name, response['deployment']['name'], "Response was not correct, deployment was not returned"
    end

    test "update request should successfully update deployment name" do
      new_name = "New Awesome Name"
      response = JSON.parse(put(:update, :id => @deployment.id, deployment: {name: new_name}).body)
      assert_response :success
      assert_equal new_name, response['deployment']['name'], "Response was not correct, name was not updated"
      assert_not_nil Deployment.find_by_name new_name, "The deployment was not really updated in the database"
    end

    test "create request should successfully create deployment" do
      new_name = "My new deployment"
      response = nil # set scope
      assert_difference('Deployment.count', +1, 'The number of deployments should increase by one if we create a new one') do
        response = JSON.parse(post(:create, {deployment: {
          name: new_name,
          organization_id: 1,
          deploy_openstack: true}}).body)
      end
      assert_response :success
      assert_equal new_name, response['deployment']['name'], "Response was not correct, did not return deployment"
      assert_not_nil Deployment.find_by_name new_name, "The deployment was not really created in the database"
    end

    test "delete request should successfully delete deployment" do
      # failing after recent changes in foreman / katello. TODO: investigate and fix
      skip
      response = nil # set scope
      assert_difference('Deployment.count', -1, 'The number of deployments should decrease by one if we delete one') do
        response = JSON.parse(delete(:destroy, :id => @deployment.id).body)
      end
      assert_response :success
      assert_equal @deployment.name, response['name'], "Response was not correct, did not return deployment"
      assert_nil Deployment.find_by_name @deployment.name, "The deployment was not really deleted in the database"
    end

    test "deploy request should successfully deploy deployment" do
      skip # this one does not work yet, investigate why "undefined method `owner_details' for nil:NilClass"
      response = JSON.parse(put(:deploy, :id => @deployment.id).body)
      assert_response :success
      assert_equal "Actions::Fusor::Deploy", response['label'], "The deploy request did not return the expected task"
    end

    context 'log' do
      setup do
        @missing_log_path = "#{Rails.root}/test/fixtures/missing_file.log"
        @test_log_path = "#{Rails.root}/test/fixtures/log_reader_test_file.log"
      end

      test 'returns nil when no log file exists' do
        @controller.stubs(:get_log_path).with('fusor_log').returns(@missing_log_path).once
        response = JSON.parse(get(:log, :id => @deployment.id, :log_type => 'fusor_log').body)

        assert_response :success
        assert_nil response['fusor_log'], 'Response did not return nil'
      end

      test 'returns fusor log when no log_type param' do
        @controller.stubs(:get_log_path).with('fusor_log').returns(@test_log_path).once
        response = JSON.parse(get(:log, :id => @deployment.id).body)

        assert_response :success
        assert_not_nil response['fusor_log'], 'Response missing fusor log'
      end

      test 'get full fusor log returns all entries from the fusor log' do
        @controller.stubs(:get_log_path).with('fusor_log').returns(@test_log_path).once
        response = JSON.parse(get(:log, :id => @deployment.id, :log_type => 'fusor_log').body)

        assert_response :success
        assert_not_nil response['fusor_log'], 'Response missing fusor log'
        assert_equal @test_log_path, response['fusor_log']['path'], 'Path name incorrect'
        assert_not_nil response['fusor_log']['entries'], 'Did not retrieve any entries'
        assert_equal 7, (response['fusor_log']['entries']).length, 'Did not retrieve all entries'
      end

      test 'get tail of fusor log returns entries since the last line' do
        @controller.stubs(:get_log_path).with('fusor_log').returns(@test_log_path).once
        response = JSON.parse(get(:log, :id => @deployment.id, :log_type => 'fusor_log', :line_number_gt => 5).body)

        assert_response :success
        assert_not_nil response['fusor_log'], 'Response missing fusor log'
        assert_equal @test_log_path, response['fusor_log']['path'], 'Path name incorrect'
        assert_not_nil response['fusor_log']['entries'], 'Did not retrieve any entries'
        assert_equal 2, (response['fusor_log']['entries']).length, 'Did not retrieve all entries'
      end
    end

    context 'create_log_reader' do
      test 'defaults to basic log reader when no type is provided' do
        reader = @controller.send :create_log_reader, nil
        assert_equal Fusor::Logging::LogReader, reader.class, 'Incorrect reader created'
      end

      test 'returns RailsLogReader for fusor_log' do
        reader = @controller.send :create_log_reader, 'fusor_log'
        assert_equal Fusor::Logging::RailsLogReader, reader.class, 'Incorrect reader created'
      end

      test 'returns RailsLogReader for foreman_log' do
        reader = @controller.send :create_log_reader, 'foreman_log'
        assert_equal Fusor::Logging::RailsLogReader, reader.class, 'Incorrect reader created'
      end

      test 'returns JavaLogReader for candlepin_log' do
        reader = @controller.send :create_log_reader, 'candlepin_log'
        assert_equal Fusor::Logging::JavaLogReader, reader.class, 'Incorrect reader created'
      end

      test 'returns ProxyLogReader for foreman_proxy_log' do
        reader = @controller.send :create_log_reader, 'foreman_proxy_log'
        assert_equal Fusor::Logging::ProxyLogReader, reader.class, 'Incorrect reader created'
      end
    end

    context 'get_log_path' do
      test 'gets the correct path for fusor log' do
        ::Fusor.stubs(:log_file_dir).returns('/test_path').once
        ::Fusor.stubs(:log_file_path).returns('/test_path/deployment.log').once

        @controller.params = {:id => @deployment.id}
        @controller.send :find_deployment

        path = @controller.send :get_log_path, 'fusor_log'
        assert_equal '/test_path/deployment.log', path, 'Incorrect path to fusor log'
      end

      test 'gets the correct path for messages log' do
        ::Fusor.stubs(:log_file_dir).returns('/test_path').once

        @controller.params = {:id => @deployment.id}
        @controller.send :find_deployment

        path = @controller.send :get_log_path, 'messages_log'
        assert_equal '/test_path/var/log/messages', path, 'Incorrect path to messages log'
      end

      test 'gets the correct path for candlepin log' do
        ::Fusor.stubs(:log_file_dir).returns('/test_path').once

        @controller.params = {:id => @deployment.id}
        @controller.send :find_deployment

        path = @controller.send :get_log_path, 'candlepin_log'
        assert_equal '/test_path/var/log/candlepin/candlepin.log', path, 'Incorrect path to candlepin log'
      end

      test 'gets the correct path for foreman log' do
        ::Fusor.stubs(:log_file_dir).returns('/test_path').once

        @controller.params = {:id => @deployment.id}
        @controller.send :find_deployment

        path = @controller.send :get_log_path, 'foreman_log'
        assert_equal '/test_path/var/log/foreman/production.log', path, 'Incorrect path to foreman log'
      end

      test 'gets the correct path for foreman proxy log' do
        ::Fusor.stubs(:log_file_dir).returns('/test_path').once

        @controller.params = {:id => @deployment.id}
        @controller.send :find_deployment

        path = @controller.send :get_log_path, 'foreman_proxy_log'
        assert_equal '/test_path/var/log/foreman-proxy/proxy.log', path, 'Incorrect path to foreman proxy log'
      end

      test 'defaults to the path for fusor log' do
        ::Fusor.stubs(:log_file_dir).returns('/test_path').once
        ::Fusor.stubs(:log_file_path).returns('/test_path/deployment.log').once

        @controller.params = {:id => @deployment.id}
        @controller.send :find_deployment

        path = @controller.send :get_log_path, ''
        assert_equal '/test_path/deployment.log', path, 'Incorrect path to fusor log'
      end
    end
  end
end
