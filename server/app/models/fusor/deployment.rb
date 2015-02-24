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
    validates :lifecycle_environment_id, :presence => true

    validates_with ::Katello::Validators::KatelloNameFormatValidator, :attributes => :name

    # TODO: need to figure out the syntax for this
    # has_one :host, foreign_key => :rhev_hypervisor_host_id, dependent => :nullify
    # has_one :host, foreign_key => :rhev_engine_host_id, dependent => :nullify
    #has_one :rhev_hypervisor_host_id
    #has_one :rhev_engine_host_id

  end
end
