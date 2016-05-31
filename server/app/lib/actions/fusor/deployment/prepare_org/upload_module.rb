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

module Actions
  module Fusor
    module Deployment
      module PrepareOrg
        class UploadModule < Actions::Fusor::FusorActionWithSubPlans
          def humanized_name
            _("Upload Module")
          end

          def plan
            super
            plan_self
          end

          def create_sub_plans
            repository = ::Katello::Repository.find_by_name('Puppet')
            file = File.new('/usr/share/ovirt-puppet/pkg/jcannon-ovirt-1.0.0.tar.gz')
            trigger(::Actions::Katello::Repository::UploadFiles, repository, [{:path => file.path}])
          end
        end
      end
    end
  end
end
