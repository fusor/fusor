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
  class Api::V3::SubscriptionsController < Api::V3::BaseController

    #include Api::Version3
    skip_before_filter :check_content_type, :only => [:upload]

    def index
      if params[:deployment_id] && params[:source]
        ::Fusor.log.debug "filtering by deployment_id AND by source: #{params[:source]}"
        @subscriptions = Fusor::Subscription.where(:deployment_id => params[:deployment_id],
                                                     :source => params[:source])
      elsif params[:deployment_id]
        ::Fusor.log.debug "filtering by deployment_id"
        @subscriptions = Fusor::Subscription.where(:deployment_id => params[:deployment_id])
      elsif params[:source]
        ::Fusor.log.debug "filtering by source: #{params[:source]}"
        @subscriptions = Fusor::Subscription.where(:source => params[:source])
      else
        ::Fusor.log.debug "finding all"
        @subscriptions = Subscription.all
      end
      render :json => @subscriptions, :each_serializer => Fusor::SubscriptionSerializer
    end

    def create
      @subscription = Fusor::Subscription.new(subscription_params)
      if @subscription.save
        render :json => @subscription, :serializer => Fusor::SubscriptionSerializer
      else
        render json: {errors: @subscription.errors}, status: 422
      end
    end

    def show
      @subscription = Fusor::Subscription.find(params[:id])
      render :json => @subscription, :serializer => Fusor::SubscriptionSerializer
    end

    def update
      @subscription = Fusor::Subscription.find(params[:id])
      if @subscription.update_attributes(subscription_params)
        render :json => @subscription, :serializer => Fusor::SubscriptionSerializer
      else
        render json: {errors: @subscription.errors}, status: 422
      end
    end

    def destroy
      @subscription = Fusor::Subscription.find(params[:id])
      @subscription.destroy
      render json: {}, status: 204
    end

    def upload
      ::Fusor.log.debug "upload params #{params}"
      fail ::Katello::HttpErrors::BadRequest, _("No manifest file uploaded") if params[:manifest_file][:file].blank?
      fail ::Katello::HttpErrors::BadRequest, _("No deployment specified") if params[:manifest_file][:deployment_id].blank?

      deployment = Deployment.find(params[:manifest_file][:deployment_id])

      begin
        # candlepin requires that the file has a zip file extension
        temp_file = File.new(File.join("#{Rails.root}/tmp", "import_#{SecureRandom.hex(10)}.zip"), 'wb+', 0600)
        temp_file.write params[:manifest_file][:file].read
        deployment.update_attribute("manifest_file", temp_file.path)
      ensure
        temp_file.close
      end

      ::Fusor.log.info "Import the manifest into the DB"

      mi = Fusor::Manifest::ManifestImporter.new
      entitlements = mi.prepare_manifest(temp_file.path, deployment.id)

      entitlements.each do |entitlement|
        @subscription = Fusor::Subscription.where(:deployment_id => deployment.id, :contract_number => entitlement['pool']['contractNumber']).first_or_initialize
        @subscription.deployment_id = deployment.id
        @subscription.contract_number = entitlement['pool']['contractNumber']
        @subscription.product_name = entitlement['pool']['productName']
        @subscription.start_date = entitlement['startDate']
        @subscription.end_date = entitlement['endDate']
        @subscription.quantity_attached = entitlement['quantity']
        @subscription.total_quantity = entitlement['pool']['quantity']
        @subscription.source = "imported"
        @subscription.save!
      end

      render json: {manifest_file: temp_file.path}, status: 200
    end

    private

    def subscription_params
      # add belongs_to attribute: deployment_id
      if params[:data][:relationships]
        if (deployment = params[:data][:relationships][:deployment])
          deployment_id = deployment[:data] ? deployment[:data][:id] : nil
          params[:data][:attributes][:deployment_id] = deployment_id
        end
      end

      params.require(:data).require(:attributes).permit(:deployment_id, :contract_number,
         :product_name, :quantity_attached, :start_date, :end_date, :total_quantity,
         :source, :quantity_to_add)
    end

  end
end
