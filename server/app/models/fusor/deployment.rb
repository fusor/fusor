#
# Copyright 2015 Red Hat, Inc.
#
# This software is licensed to you under the GNU General Public
# License as published by the Free Software Foundation; either version
# 2 of the License (GPLv2) or (at your option) any later version.
# There is NO WARRANTY for this software, express or implied,
# including the implied warranties of MERCHANTABILITY,
# NON-INFRINGEMENT, or FITNESS FOR A PARTICULAR PURPOSE. You should
# have received a copy of GPLv2 along with this software; if not, see
# http://www.gnu.org/licenses/old-licenses/gpl-2.0.txt.

module Fusor
  class Deployment < ActiveRecord::Base
    belongs_to :organization
    belongs_to :lifecycle_environment, :class_name => "Katello::KTEnvironment"

    validates :name, :presence => true, :uniqueness => {:scope => :organization_id}
    validates :organization_id, :presence => true
    validates :rhev_root_password, :allow_blank => true, :length => {:minimum => 8, :message => _('should be 8 characters or more')}
    validates :cfme_root_password, :allow_blank => true, :length => {:minimum => 8, :message => _('should be 8 characters or more')}

    belongs_to :rhev_engine_host, :class_name => "::Host::Base", :foreign_key => :rhev_engine_host_id
    has_many :rhev_hypervisor_hosts, :class_name => "::Host::Base", :through => :deployment_hosts
    validates_with ::Katello::Validators::KatelloNameFormatValidator, :attributes => :name


    belongs_to :discovered_host, :class_name => "::Host::Base", :foreign_key => :rhev_engine_host_id
    has_many :deployment_hosts, :class_name => "Fusor::DeploymentHost", :foreign_key => :deployment_id
    has_many :discovered_hosts, :through => :deployment_hosts, :foreign_key => :discovered_host_id, :source => :discovered_host
    has_many :rhev_hypervisor_hosts, :through => :deployment_hosts, :class_name => "::Host::Base"
    alias_attribute :discovered_host_id, :rhev_engine_host_id

  end
end
