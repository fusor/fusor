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
  class Api::V2::DeploymentsController < Api::V2::BaseController

   before_filter :find_deployment, :only => [:destroy, :show, :update, :deploy]

    def index
      respond :collection => Deployment.all
    end

    def show
      respond :resource => @deployment
    end

    def create
      @deployment = Deployment.create!(params[:deployment])
      respond_for_show :resource => @deployment
    end

    def update
      @deployment.update_attributes!(params[:deployment])
      respond_for_show :resource => @deployment
    end

    def destroy
      @deployment.destroy
      respond_for_show :resource => @deployment
    end

    def deploy
      task = async_task(::Actions::Fusor::Deploy, @deployment)
      respond_for_async :resource => task
    end

    def find_deployment
      not_found and return false if params[:id].blank?
      @deployment = Deployment.find(params[:id])
    end
  end
end
