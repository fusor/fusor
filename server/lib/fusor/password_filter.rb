##
# PasswordFilter
# ================
# Extracts passwords from deployment objects.
# Provides functionality for filtering sensitive data (passwords) from text.

class PasswordFilter
  def self.password_cache
    return @password_cache
  end

  def self.extract_deployment_passwords(deployment)
    # act as passthrough (no filtering) if we're in dev/test AND show_passwords is enabled
    if !Rails.env.production? && SETTINGS[:fusor][:system][:logging][:show_passwords]
      return nil
    end

    main_deployment_passwords = [
      :rhev_engine_admin_password,
      :rhev_root_password,
      :rhev_gluster_root_password,
      :cfme_root_password,
      :cfme_admin_password,
      :cfme_db_password,
      :openshift_user_password,
      :openshift_root_password
    ]
    osp_deployment_passwords = [
      :undercloud_admin_password,
      :undercloud_ssh_password,
      :overcloud_password
    ]

    # get passwords from main deployment
    extracted_passwords = cautious_get_attrs(main_deployment_passwords, deployment)

    # check if osp deployment exists, if so get passwords from it as well
    if deployment.respond_to? :openstack_deployment
      osp_deployment = deployment.send(:openstack_deployment)
      extracted_passwords += cautious_get_attrs(osp_deployment_passwords, osp_deployment)
    end

    if !extracted_passwords.empty?
      @password_cache = extracted_passwords.clone
    end
    return extracted_passwords
  end

  # cautiously gets a list of attributes from an object
  def self.cautious_get_attrs(attr_symbols, obj_to_search)
    attr_values = Set.new
    attr_symbols.each do |attr_symbol|
      if obj_to_search.respond_to?(attr_symbol)
        attr_value = obj_to_search.send(attr_symbol)
        if !attr_value.nil?
          attr_values.add(attr_value)
        end
      end
    end
    return attr_values
  end

  def self.filter_passwords(text_to_filter, passwords = nil, replacement_text = "[FILTERED]")
    # act as passthrough (no filtering) if we're in dev/test AND show_passwords is enabled
    if !Rails.env.production? && SETTINGS[:fusor][:system][:logging][:show_passwords]
      return text_to_filter
    end
    # convert arrays etc. to strings so that gsub! is possible
    if !text_to_filter.is_a?(String)
      text_to_filter = text_to_filter.to_s
    end
    # read from the password_cache if passwords aren't passed in
    if passwords.nil? and !@password_cache.nil?
      passwords = @password_cache
    end
    # ensure that we have a set of passwords to filter out
    if !passwords.nil? and passwords.is_a?(Set)
      passwords.each do |password|
        # matches context in which passwords characteristically appear in logs
        # e.g. passwords are normally surrounded by quotes, spaces, an equals
        # sign on the left, a newline character on the right, etc. there are
        # many possibilities, this regex should cover every case in fusor and
        # avoid filtering non-password strings happening to contain the user's
        # password as a substring. if the user selects 'password' as their
        # master password, we don't want to filter the string "cfme_password"
        # to become "cfme_[FILTERED]" and reveal the weak password via logs.
        text_to_filter.gsub!(/([\W\=\"\'\ ])(#{password})(\z|[\"\'\ \n,;])/, "\\1#{replacement_text}\\3")
      end
    end
    return text_to_filter
  end
end
