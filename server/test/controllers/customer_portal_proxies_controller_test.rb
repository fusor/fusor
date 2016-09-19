require 'test_plugin_helper'

module Fusor
  class Api::CustomerPortalProxiesControllerTest < ActionController::TestCase
    include ActionDispatch::TestProcess

    def setup
      setup_fusor_routes
      @controller = ::Fusor::Api::CustomerPortal::CustomerPortalProxiesController.new
    end

    test "is_authenticated returns false when both are empty" do
      session[:portal_username] = ""
      session[:portal_password] = ""
      response = get(:is_authenticated, session: session).body
      assert_response :success
      assert "false" == response
    end

    test "is_authenticated returns true when session is not empty" do
      session[:portal_username] = "joeuser"
      session[:portal_password] = "password"

      response = get(:is_authenticated, session: session).body
      assert_response :success
      assert "true" == response
    end

    test "is_authenticated returns false when username is empty" do
      session[:portal_username] = ""
      session[:portal_password] = "password"

      response = get(:is_authenticated, session: session).body
      assert_response :success
      assert "false" == response
    end

    test "is_authenticated returns false when password is empty" do
      session[:portal_username] = "joeuser"
      session[:portal_password] = ""

      response = get(:is_authenticated, session: session).body
      assert_response :success
      assert "false" == response
    end

    test "is_authenticated returns false when password is nil" do
      session[:portal_username] = "joeuser"
      session[:portal_password] = nil

      response = get(:is_authenticated, session: session).body
      assert_response :success
      assert "false" == response
    end

    test "is_authenticated returns false when username is nil" do
      session[:portal_username] = nil
      session[:portal_password] = "password"

      response = get(:is_authenticated, session: session).body
      assert_response :success
      assert "false" == response
    end

    test "is_authenticated returns false when both are nil" do
      session[:portal_username] = nil
      session[:portal_password] = nil

      response = get(:is_authenticated, session: session).body
      assert_response :success
      assert "false" == response
    end

    test "logout deletes credentialas" do
      session[:portal_username] = "joeuser"
      session[:portal_password] = "password"

      JSON.parse(post(:logout, session: session).body)
      assert_response :success
      assert session[:portal_username].nil?
      assert session[:portal_password].nil?
    end

  end
end
