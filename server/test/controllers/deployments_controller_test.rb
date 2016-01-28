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
        @deployment_log_dir =  "#{Rails.root}/test/fixtures/logs/test-deployment"
        ::Fusor.stubs(:log_file_dir).returns(@deployment_log_dir)
      end

      test 'returns nil when no log file exists' do
        log_path = File.join(@deployment_log_dir, 'missing.log')
        ::Fusor.stubs(:log_file_path).returns(log_path)

        response = JSON.parse(get(:log, :id => @deployment.id, :log_type => 'fusor_log').body)
        assert_response :success
        assert_nil response['fusor_log'], 'Response did not return nil'
      end

      test 'returns fusor log when no log_type param' do
        log_path = File.join(@deployment_log_dir, 'deployment.log')
        ::Fusor.stubs(:log_file_path).returns(log_path)

        Fusor::Logging::RailsLogReader.any_instance
            .expects(:read_full_log)
            .with(log_path)
            .returns(Fusor::Logging::Log.new)
            .once

        response = JSON.parse(get(:log, :id => @deployment.id).body)
        assert_response :success
        assert_not_nil response['fusor_log'], 'Response missing fusor log'
      end

      test 'get log with log_type fusor_log uses RailsLogReader to read the full fusor log' do
        log_path = File.join(@deployment_log_dir, 'deployment.log')
        ::Fusor.stubs(:log_file_path).returns(log_path)

        Fusor::Logging::RailsLogReader.any_instance
            .expects(:read_full_log)
            .with(log_path)
            .returns(Fusor::Logging::Log.new)
            .once

        response = JSON.parse(get(:log, :id => @deployment.id, :log_type => 'fusor_log').body)
        assert_response :success
        assert_not_nil response['fusor_log'], 'Response missing fusor log'
      end

      test 'get log with log_type fusor_log and line_number_gt uses RailsLogReader to tail the fusor log' do
        log_path = File.join(@deployment_log_dir, 'deployment.log')
        line_number = 5
        ::Fusor.stubs(:log_file_path).returns(log_path)

        Fusor::Logging::RailsLogReader.any_instance
            .expects(:tail_log_since)
            .with(log_path, line_number)
            .returns(Fusor::Logging::Log.new)
            .once

        response = JSON.parse(get(:log, :id => @deployment.id, :log_type => 'fusor_log', :line_number_gt => line_number).body)
        assert_response :success
        assert_not_nil response['fusor_log'], 'Response missing fusor log'
      end

      test 'get log with log_type foreman_log uses RailsLogReader to read the full foreman log' do
        log_path = File.join(@deployment_log_dir, 'var/log/foreman', 'production.log')

        Fusor::Logging::RailsLogReader.any_instance
            .expects(:read_full_log)
            .with(log_path)
            .returns(Fusor::Logging::Log.new)
            .once

        response = JSON.parse(get(:log, :id => @deployment.id, :log_type => 'foreman_log').body)
        assert_response :success
        assert_not_nil response['foreman_log'], 'Response missing foreman log'
      end

      test 'get log with log_type foreman_log and line_number_gt uses RailsLogReader to tail the foreman log' do
        log_path = File.join(@deployment_log_dir, 'var/log/foreman', 'production.log')
        line_number = 5

        Fusor::Logging::RailsLogReader.any_instance
            .expects(:tail_log_since)
            .with(log_path, line_number)
            .returns(Fusor::Logging::Log.new)
            .once

        response = JSON.parse(get(:log, :id => @deployment.id, :log_type =>  'foreman_log', :line_number_gt => line_number).body)
        assert_response :success
        assert_not_nil response['foreman_log'], 'Response missing foreman log'
      end

      test 'get log with log_type foreman_proxy_log uses ProxyLogReader to read the full proxy log' do
        log_path = File.join(@deployment_log_dir, 'var/log/foreman-proxy', 'proxy.log')

        Fusor::Logging::ProxyLogReader.any_instance
            .expects(:read_full_log)
            .with(log_path)
            .returns(Fusor::Logging::Log.new)
            .once

        response = JSON.parse(get(:log, :id => @deployment.id, :log_type => 'foreman_proxy_log').body)
        assert_response :success
        assert_not_nil response['foreman_proxy_log'], 'Response missing foreman proxy log'
      end

      test 'get log with log_type foreman_proxy_log and line_number_gt uses ProxyLogReader to tail the proxy log' do
        log_path = File.join(@deployment_log_dir, 'var/log/foreman-proxy', 'proxy.log')
        line_number = 5

        Fusor::Logging::ProxyLogReader.any_instance
            .expects(:tail_log_since)
            .with(log_path, line_number)
            .returns(Fusor::Logging::Log.new)
            .once

        response = JSON.parse(get(:log, :id => @deployment.id, :log_type =>  'foreman_proxy_log', :line_number_gt => line_number).body)
        assert_response :success
        assert_not_nil response['foreman_proxy_log'], 'Response missing foreman proxy log'
      end

      test 'get log with log_type candlepin_log uses JavaLogReader to read the full candlepin log' do
        log_path = File.join(@deployment_log_dir, 'var/log/candlepin', 'candlepin.log')

        Fusor::Logging::JavaLogReader.any_instance
            .expects(:read_full_log)
            .with(log_path)
            .returns(Fusor::Logging::Log.new)
            .once

        response = JSON.parse(get(:log, :id => @deployment.id, :log_type => 'candlepin_log').body)
        assert_response :success
        assert_not_nil response['candlepin_log'], 'Response missing candlepin log'
      end

      test 'get log with log_type candlepin_log and line_number_gt uses JavaLogReader to tail the candlepin log' do
        log_path = File.join(@deployment_log_dir, 'var/log/candlepin', 'candlepin.log')
        line_number = 5

        Fusor::Logging::JavaLogReader.any_instance
            .expects(:tail_log_since)
            .with(log_path, line_number)
            .returns(Fusor::Logging::Log.new)
            .once

        response = JSON.parse(get(:log, :id => @deployment.id, :log_type =>  'candlepin_log', :line_number_gt => line_number).body)
        assert_response :success
        assert_not_nil response['candlepin_log'], 'Response missing candlepin log'
      end

      test 'get log with log_type messages_log uses LogReader to read the full messages log' do
        log_path = File.join(@deployment_log_dir, 'var/log', 'messages')

        Fusor::Logging::LogReader.any_instance
            .expects(:read_full_log)
            .with(log_path)
            .returns(Fusor::Logging::Log.new)
            .once

        response = JSON.parse(get(:log, :id => @deployment.id, :log_type => 'messages_log').body)
        assert_response :success
        assert_not_nil response['messages_log'], 'Response missing messages log'
      end

      test 'get log with log_type messages_log and line_number_gt uses LogReader to tail the messages log' do
        log_path = File.join(@deployment_log_dir, 'var/log', 'messages')
        line_number = 5

        Fusor::Logging::LogReader.any_instance
            .expects(:tail_log_since)
            .with(log_path, line_number)
            .returns(Fusor::Logging::Log.new)
            .once

        response = JSON.parse(get(:log, :id => @deployment.id, :log_type =>  'messages_log', :line_number_gt => line_number).body)
        assert_response :success
        assert_not_nil response['messages_log'], 'Response missing messsages log'
      end
    end
  end
end
