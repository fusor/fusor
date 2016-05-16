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
  class Api::V3::OrganizationsController < Api::V3::BaseController

    #include Api::Version3

    before_filter :find_organization, :only => [:show]

    def index
      @organizations = ::Organization.all
      render :json => @organizations, :each_serializer => Fusor::OrganizationSerializer
    end

    def show
      render :json => @organization, :serializer => Fusor::OrganizationSerializer
    end

    private

    def find_organization
      @organization = ::Organization.find_by_id(params[:id])
      return @organization if @organization
      return :json => {:error => "Couldn't find organization" }
    end

  end
end
