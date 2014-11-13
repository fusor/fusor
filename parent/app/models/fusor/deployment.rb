module Fusor
  class Deployment < ActiveRecord::Base
    include Authorizable
    self.table_name = :fusor_deployments

    scoped_search :on => :name, :complete_value => :true
    # TODO add taxonomi
  end

end
