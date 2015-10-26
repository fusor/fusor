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
    # on update because we don't want to validate the empty object when
    # it is first created
    validates_with Fusor::Validators::DeploymentValidator, on: :update
    belongs_to :organization
    belongs_to :lifecycle_environment, :class_name => "Katello::KTEnvironment"

    validates :name, :presence => true, :uniqueness => {:scope => :organization_id}
    validates :organization_id, :presence => true
    validates :rhev_root_password, :allow_blank => true, :length => {:minimum => 8, :message => _('should be 8 characters or more')}
    validates :cfme_root_password, :allow_blank => true, :length => {:minimum => 8, :message => _('should be 8 characters or more')}
    validates :cfme_admin_password, :allow_blank => true, :length => {:minimum => 8, :message => _('should be 8 characters or more')}

    belongs_to :rhev_engine_host, :class_name => "::Host::Base", :foreign_key => :rhev_engine_host_id
    # if we want to envorce discovered host uniqueness uncomment this line
    #validates :rhev_engine_host_id, uniqueness: { :message => _('This Host is already a RHEV Engine for a different deployment') }
    has_many :rhev_hypervisor_hosts, :class_name => "::Host::Base", :through => :deployment_hosts, :source => :discovered_host
    validates_with ::Katello::Validators::KatelloNameFormatValidator, :attributes => :name

    belongs_to :discovered_host, :class_name => "::Host::Base", :foreign_key => :rhev_engine_host_id
    has_many :deployment_hosts, :class_name => "Fusor::DeploymentHost", :foreign_key => :deployment_id, :inverse_of => :deployment
    has_many :discovered_hosts, :through => :deployment_hosts, :foreign_key => :discovered_host_id, :source => :discovered_host
    alias_attribute :discovered_host_id, :rhev_engine_host_id

    has_many :subscriptions, :class_name => "Fusor::Subscription", :foreign_key => :deployment_id
    has_many :introspection_tasks, :class_name => 'Fusor::IntrospectionTask'

    scoped_search :on => [:id, :name], :complete_value => true

    # used by ember-data for .find('model', {id: [1,2,3]})
    scope :by_id, proc { |n| where(:id => n) if n.present? }

    DEPLOYMENT_TYPES = [:rhev, :cfme, :openstack]

    def deploy?(deploy_type)
      fail _("Invalid deployment type: %s") % deploy_type unless DEPLOYMENT_TYPES.include?(deploy_type.to_sym)
      send("deploy_#{deploy_type}")
    end
  end
end
