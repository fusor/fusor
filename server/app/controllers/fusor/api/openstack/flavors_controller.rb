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

require 'egon'

module Fusor
  module Api
    module Openstack
      class FlavorsController < Api::V2::BaseController
        
        def index
          h = Overcloud::UndercloudHandle.new('admin','a20a4b1d3b337bed7cd111714e9adbb814100ac7','192.0.2.1', 5001)
          render :json => h.list_flavors
        end
        
        def show
          h = Overcloud::UndercloudHandle.new('admin','a20a4b1d3b337bed7cd111714e9adbb814100ac7','192.0.2.1', 5001)
          render :json => h.get_flavor(params[:id])
        end
        
      end
    end
  end
end
