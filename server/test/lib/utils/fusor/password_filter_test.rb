require 'set'
require 'test_plugin_helper'
require 'fusor/password_filter'

class PasswordFilterTest < ActiveSupport::TestCase
  def assert_passwords_match_expections(expected_passwords, passwords, passwords_cached)
    # assert password set sizes match
    assert passwords.size == expected_passwords.size,
      "passwords.size(#{passwords.size}) != expected_passwords.size(#{expected_passwords.size})"
    assert passwords_cached.size == expected_passwords.size,
      "passwords_cached.size(#{passwords.size}) != expected_passwords.size(#{expected_passwords.size})"

    # assert that all expected passwords are present
    expected_passwords.each do |expected_password|
      assert passwords.include?(expected_password),
        "expected_password(#{expected_password}) not found in passwords(#{passwords})"
      assert passwords_cached.include?(expected_password),
        "expected_password(#{expected_password}) not found in passwords_cache(#{passwords_cached})"
    end
  end

  test "In production env, PasswordFilter should extract all RHEV passwords and cache them." do
    # extracting: rhev_engine_admin_password, rhev_root_password
    Rails.env = "production"

    # stage 1: grab deployment record for a rhev deployment with a single password.
    deployment_rhev = fusor_deployments(:rhev)
    expected_passwords = [
      "redhat1234"
    ]
    password_set = PasswordFilter.extract_deployment_passwords(deployment_rhev)
    assert_passwords_match_expections(expected_passwords, password_set, PasswordFilter.password_cache)

    # stage 2: grab deployment record for a rhev deployment with two passwords
    deployment_rhev = fusor_deployments(:rhev_different_passwords)
    expected_passwords = [
      "redhat1234",
      "redhat4321"
    ]
    password_set = PasswordFilter.extract_deployment_passwords(deployment_rhev)
    assert_passwords_match_expections(expected_passwords, password_set, PasswordFilter.password_cache)
  end

  test "In production env, PasswordFilter should extract all RHEV+CFME passwords and cache them." do
    # extracting: rhev_engine_admin_password, rhev_root_password
    #             cfme_root_password, cfme_admin_password, cfme_db_password
    Rails.env = "production"

    # stage 1: grab deployment record for a rhev/cfme deploy with two passwords
    deployment_rhev_cfme = fusor_deployments(:rhev_and_cfme_different_passwords)

    expected_passwords = [
      "redhat1234",
      "redhat4321"
    ]
    password_set = PasswordFilter.extract_deployment_passwords(deployment_rhev_cfme)
    assert_passwords_match_expections(expected_passwords, password_set, PasswordFilter.password_cache)
  end

  test "In production env, PasswordFilter should extract all RHEV+CFME+OSP passwords and cache them." do
    # extracting: rhev_engine_admin_password, rhev_root_password
    #             cfme_root_password, cfme_admin_password, cfme_db_password
    #             undercloud_admin_password, undercloud_ssh_password, overcloud_password
    Rails.env = "production"

    # stage 1: grab deployment record for rhev+cfme, and an osp deployment record
    deployment_rhev_cfme_osp = fusor_deployments(:rhev_and_cfme_different_passwords)
    deployment_osp = fusor_openstack_deployments(:osp)

    # attach osp deployment to base deployment object
    deployment_rhev_cfme_osp.openstack_deployment = deployment_osp

    expected_passwords = [
      "undercloudAdminPassword",
      "undercloudSshPassword1234",
      "overcloudAdminPassword",
      "redhat1234",
      "redhat4321"
    ]
    password_set = PasswordFilter.extract_deployment_passwords(deployment_rhev_cfme_osp)
    assert_passwords_match_expections(expected_passwords, password_set, PasswordFilter.password_cache)
  end

  test "In production env, PasswordFilter should cache passwords and be able to use them for filtering." do
    # extracting: rhev_engine_admin_password, rhev_root_password
    Rails.env = "production"

    # stage 1: grab deployment record for a rhev deployment with a single password.
    deployment_rhev = fusor_deployments(:rhev)

    expected_passwords = [
      "redhat1234"
    ]
    password_set = PasswordFilter.extract_deployment_passwords(deployment_rhev)
    assert_passwords_match_expections(expected_passwords, password_set, PasswordFilter.password_cache)

    # stage 2: run extract_deployment_passwords with a nil deployment and verify cache remains
    password_set = PasswordFilter.extract_deployment_passwords(nil)
    assert password_set.size == 0
    assert PasswordFilter.password_cache.size == 1
  end


  test "In production env, PasswordFilter.filter_passwords should accept a custom password Set." do
    # extracting: rhev_engine_admin_password, rhev_root_password
    Rails.env = "production"

    # stage 1: ensure the filtering function works on a manually defined password set
    custom_password_set = Set.new
    custom_password_set.add("redhat1234")
    custom_password_set.add("redhat4321")
    custom_password_array = custom_password_set.to_a
    text_to_filter = "ERROR: About to show passwords. #{custom_password_array[0]} and #{custom_password_array[1]}"
    filtered_text = PasswordFilter.filter_passwords(text_to_filter, custom_password_set)

    assert !filtered_text.include?(custom_password_array[0])
    assert !filtered_text.include?(custom_password_array[1])
  end


  test "In development with force_show_passwords on, PasswordFilter should act as passthrough." do
    Rails.env = "development"

    # stage 1: grab deployment record for a rhev deployment with a single password.
    deployment_rhev = fusor_deployments(:rhev)
    password_set = PasswordFilter.extract_deployment_passwords(deployment_rhev)

    if SETTINGS[:fusor][:system][:logging][:show_passwords]
      assert password_set.nil?
    else
      assert password_set.size == 1
    end
  end

  test "filter_passwords should catch all common layouts of passwords in logs" do
    Rails.env = "production"

    # stage 1: simulate common password contexts, ensure filtered result
    password = "redhat1234"
    text_to_filter = "'password': '#{password}'\n"
    text_to_filter += "'password': '#{password}',\n"
    text_to_filter += "'rhev_pw': '#{password}', 'cfme_pw': '#{password}', 'osp8_pw': '#{password}' \n"
    text_to_filter += "\"rhev_pw': \"#{password}\", \"cfme_pw\": \"#{password}\", \"osp8_pw\": \"#{password}\" \n"
    text_to_filter += "ssh --password= #{password} \n"
    text_to_filter += "ssh --password = #{password}\n"
    text_to_filter += "ssh --password=#{password},\n"
    text_to_filter += " #{password},\n"
    text_to_filter += "#{password},\n"

    filtered_text = PasswordFilter.filter_passwords(text_to_filter.clone, Set.new([password]))
    assert !filtered_text.include?(password), "filtered_text should not contain any passwords"

    # stage 2: use password of 'password'
    password = "password"
    text_to_filter = '"rhev_engine_admin_password": "password",'
    text_to_filter += '"rhev_root_password": "password",'
    text_to_filter += '"cfme_root_password": "password",'
    text_to_filter += '"cfme_admin_password": "password",'
    text_to_filter += '"openshift_user_password": "password",'
    text_to_filter += '"openshift_root_password": "password",'
    text_to_filter += '"cfme_db_password": "password",'

    filtered_text = PasswordFilter.filter_passwords(text_to_filter.clone, Set.new([password]))

    assert !filtered_text.include?("\"#{password}\""), "PasswordFilter should filter passwords when isolated."

    assert filtered_text.include?("rhev_root_password"), "PasswordFilter should not filter passwords in the context of a field label."
    assert filtered_text.include?("cfme_root_password"), "PasswordFilter should not filter passwords in the context of a field label."
    assert filtered_text.include?("cfme_admin_password"), "PasswordFilter should not filter passwords in the context of a field label."
    assert filtered_text.include?("openshift_user_password"), "PasswordFilter should not filter passwords in the context of a field label."
    assert filtered_text.include?("openshift_root_password"), "PasswordFilter should not filter passwords in the context of a field label."
    assert filtered_text.include?("cfme_db_password"), "PasswordFilter should not filter passwords in the context of a field label."
  end

  after do
    Rails.env = "test"
  end
end
