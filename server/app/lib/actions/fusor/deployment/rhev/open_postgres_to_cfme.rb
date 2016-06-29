#
# Copyright 2016 Red Hat, Inc.
#
# This software is licensed to you under the GNU General Public
# License as published by the Free Software Foundation; either version
# 2 of the License (GPLv2) or (at your option) any later version.
# There is NO WARRANTY for this software, express or implied,
# including the implied warranties of MERCHANTABILITY,
# NON-INFRINGEMENT, or FITNESS FOR A PARTICULAR PURPOSE. You should
# have received a copy of GPLv2 along with this software; if not, see
# http://www.gnu.org/licenses/old-licenses/gpl-2.0.txt.
require 'stringio'

module Actions
  module Fusor
    module Deployment
      module Rhev
        class OpenPostgresToCFME < Actions::Fusor::FusorBaseAction

          def humanized_name
            _("Allow CFME access to the RHEV Engine history database")
          end

          def plan(deployment)
            super(deployment)
            plan_self(deployment_id: deployment.id)
          end

          def run
            ::Fusor.log.debug "================ OpenPostgresToCFME run method ===================="

            deployment = ::Fusor::Deployment.find(input[:deployment_id])
            fail _("CFME address not found, cannot whitelist IP in postgres") unless deployment.cfme_address

            ssh_host = deployment.rhev_engine_host.ip
            ssh_username = "root"

            pg_conf_line = "host    all    all    #{deployment.cfme_address}/32    md5"
            pg_conf_file = '/var/lib/pgsql/data/pg_hba.conf'

            cmd = "if ! grep -q '^#{pg_conf_line}' #{pg_conf_file} ; then "\
                "echo '#{pg_conf_line}' >> #{pg_conf_file} && "\
                "service postgresql restart ; fi"

            # RHEV-host username password
            client = Utils::Fusor::SSHConnection.new(ssh_host, ssh_username, deployment.rhev_root_password)
            client.on_complete(lambda { open_postgres_completed })
            client.on_failure(lambda { open_postgres_failed })
            ::Fusor.log.debug "Running command: #{cmd}"
            client.execute(cmd)

            ::Fusor.log.debug "================ Leaving OpenPostgresToCFME run method ===================="
          end

          def open_postgres_completed
            ::Fusor.log.info "Successfully opened postgres to CFME"
          end

          def open_postgres_failed
            fail _("Failed to open postgres to CFME")
          end
        end
      end
    end
  end
end
