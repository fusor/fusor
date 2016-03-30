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
      module OpenShift
        class Deploy < Actions::Fusor::FusorBaseAction
          def humanized_name
            _("Deploy OpenShift Enterprise")
          end

          def plan(deployment)
            super(deployment)
            ::Fusor.log.info "Planning OpenShift Deployment"
            sequence do
              plan_action(::Actions::Fusor::Deployment::Rhev::OseLaunch,
                          deployment)

              plan_action(::Actions::Fusor::Deployment::OpenShift::CopySshKey,
                          deployment, 'rsa')
            end
          end
        end
      end
    end
  end
end
