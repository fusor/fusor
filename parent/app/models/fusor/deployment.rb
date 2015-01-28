module Fusor
  class Deployment < ActiveRecord::Base
    serialize :rhev_params, Hash
    serialize :cfme_params, Hash
    serialize :openstack_params, Hash
  end
end
