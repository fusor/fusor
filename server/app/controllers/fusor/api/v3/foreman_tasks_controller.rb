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
  class Api::V3::ForemanTasksController < ::ForemanTasks::Api::TasksController

    #include Api::Version3

    def index
      @foreman_tasks = ForemanTasks::Task.search_for(params[:search]).select('DISTINCT foreman_tasks_tasks.*')

      ordering_params =  {
                           sort_by: params[:sort_by] || 'started_at',
                           sort_order: params[:sort_order] || 'DESC'
                         }
      @foreman_tasks = ordering_scope(@foreman_tasks, ordering_params)


      pagination_params = {
                            page: params[:page] || 1,
                            per_page: params[:per_page] || 20
                          }
      @foreman_tasks = pagination_scope(@foreman_tasks, pagination_params)

      render :json => @foreman_tasks, :each_serializer => ForemanTaskSerializer
    end

    def show
      @foreman_task = ForemanTasks::Task.find(params[:id])
      render :json => @task, :serializer => Fusor::ForemanTaskSerializer
    end

  end
end
