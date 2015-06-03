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

  end
end
