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
        class CreateRepository < Actions::Fusor::FusorActionWithSubPlans
          def humanized_name
            _("Create Repository")
          end

          def plan(name, type, label, url, upstream_name)
            super()
            plan_self(:name => name, :type => type, :label => label, :url => url, :upstream_name => upstream_name)
          end

          def create_sub_plans
            product = ::Katello::Product.find_by_name('Fusor')
            repository = product.add_repo(input[:label], input[:name], input[:url], input[:type], true)
            if input[:upstream_name]
              repository[:docker_upstream_name] = input[:upstream_name]
            end

            trigger(::Actions::Katello::Repository::Create, repository, false, true)
          end
        end
      end
    end
  end
end
