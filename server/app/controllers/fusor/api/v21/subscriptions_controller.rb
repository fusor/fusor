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
  class Api::V21::SubscriptionsController < Api::V2::BaseController
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
      render :json => @subscriptions, :each_serializer => Fusor::SubscriptionSerializer, :serializer => RootArraySerializer
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

    def validate
      valid = false
      if params[:deployment_id]
        ::Fusor.log.error "XXX We have a deployment id"
        deployment = Deployment.find(params[:deployment_id])
        # TODO: make sure deployment isn't nil

        # Get all the products we plan on consuming with this deployment
        pids = []

        pids.concat get_product_ids(/rhev/) if deployment.deploy_rhev
        pids.concat get_product_ids(/cloudforms/) if deployment.deploy_cfme
        pids.concat get_product_ids(/openshift/) if deployment.deploy_openshift
        pids.concat get_product_ids(/openstack/) if deployment.deploy_openstack

        pids.uniq! # remove duplicates, the ! operates on the actual array

        if !manifest_imported? && deployment.is_disconnected?
          # new disconnected
          ::Fusor.log.error "XXX DISCONNECTED! with no existing manifest"
          # TODO: verify the manifest file exists
          mi = Fusor::Manifest::ManifestImporter.new
          manifest_prods = mi.get_product_ids(deployment.manifest_file, deployment.id)
          valid = products_covered?(pids, manifest_prods)
        elsif !manifest_imported? && !deployment.is_disconnected?
          # new connected
          ::Fusor.log.error "XXX CONNECTED! with no existing manifest"
          ::Fusor.log.error session
          portal_prods = get_product_ids_from_portal(deployment.upstream_consumer_uuid,
                    { :username => session[:portal_username], :password => session[:portal_password] })
          valid = products_covered?(pids, portal_prods)
        elsif manifest_imported?
          # new with existing manifest
          ::Fusor.log.error "XXX EXISTING MANIFEST! Subsequent deployment"
          satellite_prods = get_product_ids_from_satellite
          valid = products_covered?(pids, satellite_prods)
        else
          ::Fusor.log.error "XXX DANGER WILL ROBINSON! We shouldn't be here!"
        end

      else
        ::Fusor.log.error "XXX NO DEPLOYMENT ID"
        valid = false
      end

      render json: {valid: valid}, status: 200
    end

    private

    # TODO: consider moving to SubscriptionValidator
    def manifest_imported?
      # if there are no subscriptions besides Fusor, we haven't
      # imported a manifest yet
      return !::Katello::Subscription.where.not(name: "Fusor").empty?
    end

    # TODO: consider moving to SubscriptionValidator
    def get_product_ids(key)
      # get product ids from configuration
      return [] if key.nil?

      # takes in a regexp and looks it up in the content settings
      products_hash = SETTINGS[:fusor][:content].select { |k, v| k.to_s.match(key) }
      pids = []
      products_hash.values.each do |products|
        pids.concat(products)
      end
      return pids.map { |p| p[:product_id] }.uniq
    end

    # TODO: consider moving to SubscriptionValidator
    def get_product_ids_from_portal(uuid, auth)
      # get the product ides from customer portal
      #{ username: 'rhci-test', password: 'rhcirhci' }))
      entitlements = JSON.parse(::Fusor::Resources::CustomerPortal::Proxy.get("/consumers/#{uuid}/entitlements", auth))

      pids = []
      entitlements.each do |e|
        pids.concat(e["pool"]["providedProducts"].map { |p| p["productId"] })
      end
      return pids.uniq
    end

    # TODO: consider moving to SubscriptionValidator
    def get_product_ids_from_satellite
      subs = ::Katello::Subscription.where.not(name: "Fusor")
      pids = []
      subs.each do |sub|
        pids.concat(sub.products.map { |p| p.cp_id })
      end
      return pids.uniq
    end

    # TODO: consider moving to SubscriptionValidator
    def get_product_ids_from_manifest(manifest_file)
    end

    # TODO: consider moving to SubscriptionValidator
    def products_covered?(dep_prods, man_prods)
      if dep_prods.nil? || man_prods.nil?
        return false
      end

      return (dep_prods - man_prods).empty?
    end

    def subscription_params
      params.require(:subscription).permit(:contract_number, :product_name, :quantity_to_add, :quantity_attached,
                                           :start_date, :end_date, :total_quantity, :source, :deployment_id)
    end

  end
end
