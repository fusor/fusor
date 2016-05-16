require 'test_plugin_helper'

module Fusor
  class Api::V3::DeploymentsControllerTest < ActionController::TestCase

    def setup
      @deployment = fusor_deployments(:rhev)
      # magic, without this some of the routes don't resolve for some reason
      setup_fusor_routes
      @controller = ::Fusor::Api::V21::DeploymentsController.new
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
      assert_not_nil Deployment.find_by_name new_name
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
      assert_not_nil Deployment.find_by_name new_name
    end

    test "delete request should successfully delete deployment" do
      response = nil # set scope
      assert_difference('Deployment.count', -1, 'The number of deployments should decrease by one if we delete one') do
        response = JSON.parse(delete(:destroy, :id => @deployment.id).body)
      end
      assert_response :success
      assert_equal @deployment.name, response['name'], "Response was not correct, did not return deployment"
      assert_nil Deployment.find_by_name @deployment.name
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

    context 'validate_cdn' do
      test 'validate_cdn endpoint responds 200 with 200 payload if valid CDN' do
        mock_res = Object.new
        def mock_res.code
          "200"
        end

        Net::HTTP.any_instance
          .stubs(:request).returns(mock_res)

        response = JSON.parse(get(
          :validate_cdn,
          :id => @deployment.id,
          :cdn_url => 'http://porsche.rdu.redhat.com/pub/sat-import').body)

        assert_response :success
        cdn_url_code = response['cdn_url_code']
        assert_not_nil cdn_url_code
        assert_equal cdn_url_code, "200"
      end

      test 'if cdn url returns a 301, should make additional request to location and report 200' do
        # Initial URI
        initial_uri = 'http://porsche.rdu.redhat.com/pub/sat-import'

        valid_res = Object.new
        def valid_res.code
          "200"
        end

        redirect_res = Object.new
        def redirect_res.code
          "301"
        end

        def redirect_res.[](_)
          # Mock object only ever needs to return uri_with_slash, expecting
          # we'll receive key == 'location', no other case is valid
          # Method definition does not close over initial_uri, end up with
          # "undefined local variable or method" error. Need to fully qualify
          'http://porsche.rdu.redhat.com/pub/sat-import/content/'
        end

        # NOTE: The full uri is not publically available on the request instance
        # here <Net::HTTP::Head> for some absurd reason. Best we can test is
        # the path, since that is available.
        Net::HTTP.any_instance
          .stubs(:request)
          .with { |request| request.path == '/pub/sat-import/content' }
          .returns(redirect_res)

        Net::HTTP.any_instance
          .stubs(:request)
          .with { |request| request.path == '/pub/sat-import/content/' }
          .returns(valid_res)

        response = JSON.parse(get(
          :validate_cdn,
          :id => @deployment.id,
          :cdn_url => initial_uri).body)

        assert_response :success
        cdn_url_code = response['cdn_url_code']
        assert_not_nil cdn_url_code
        assert_equal cdn_url_code, "200"
      end

      test 'validate_cdn should return a 400 if cdn_url param is missing' do
        mock_res = Object.new
        def mock_res.code
          "200"
        end

        Net::HTTP.any_instance
          .stubs(:request).returns(mock_res)

        response = JSON.parse(get(:validate_cdn, :id => @deployment.id).body)

        assert_response 400
        response_error = response['error']
        assert_not_nil response_error
        assert_equal response_error, 'cdn_url parameter missing'
      end

      test 'unexpected exception should return a 400' do
        mock_res = Object.new
        def mock_res.code
          raise 'ForcedError'
        end

        Net::HTTP.any_instance
          .stubs(:request).returns(mock_res)

        response = JSON.parse(get(
          :validate_cdn,
          :id => @deployment.id,
          :cdn_url => 'http://porsche.rdu.redhat.com/pub/sat-import').body)

        assert_response 400
        response_error = response['error']
        assert_not_nil response_error
        assert_equal response_error, 'ForcedError'
      end
    end

    context 'openshift_disk_space' do
      test 'openshift_disk_space should return a 200 and the correct disk space' do
        mock_stats = Object.new

        def mock_stats.block_size
          1024
        end

        def mock_stats.blocks_available
          1024 * 1024
        end

        expected_size = 1024

        Utils::Fusor::CommandUtils.stubs(:run_command).returns(0, :foo)
        Sys::Filesystem.stubs(:stat).returns(mock_stats)

        response = JSON.parse(get(
          :openshift_disk_space,
          :id => @deployment.id).body)

        assert_response 200
        assert_equal response['openshift_disk_space'], expected_size
      end

      test 'openshift_disk_space should return a 500 if mount fails' do
        Utils::Fusor::CommandUtils.stubs(:run_command).returns(1, :foo)

        response = JSON.parse(get(
          :openshift_disk_space,
          :id => @deployment.id).body)

        assert_response 500
        assert_equal response['error'],
          'Unable to mount NFS share at specified mount point'
      end
    end
  end
end
