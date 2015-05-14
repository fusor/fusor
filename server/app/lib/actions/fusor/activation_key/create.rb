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
    module ActivationKey
      class Create < Actions::Katello::ActivationKey::Create
        def plan(activation_key)
          super(activation_key)
        end

        def humanized_name
          _("Create")
        end

        def run
          # Invoke the finalize method from the parent
          ::Actions::Katello::ActivationKey::Create.instance_method(:finalize).bind(self).call
        end

        def finalize
          # Do nothing; however, override the method to avoid the parent's finalize being called
        end
      end
    end
  end
end
