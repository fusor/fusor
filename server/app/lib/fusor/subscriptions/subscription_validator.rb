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
#
module Fusor
  module Subscriptions
    class SubscriptionValidator

      # need a subscription info for both deployment and source (disconnected,
      # connected, or satellite)
      #
      # rhev product ids and rhev counts, etc
      #

      def validate(deployment, session, manifest_imported = false, disconnected = false)
        ::Fusor.log.debug "SUB-VAL.validate: Entering SubscriptionValidator.validate"
        valid = false
        deployment_subinfo = build_subinfo_from_deployment(deployment)

        if !manifest_imported && disconnected
          # new disconnected
          ::Fusor.log.info "SUB-VAL.validate: DISCONNECTED! with no existing manifest"
          manifest_subinfo = build_subinfo_from_manifest(deployment)
          valid = compare(deployment_subinfo, manifest_subinfo)
        elsif !manifest_imported && !disconnected
          # new connected
          ::Fusor.log.info "SUB-VAL.validate: CONNECTED! with no existing manifest"
          unless (session[:portal_username] && session[:portal_password])
            ::Fusor.log.error "SUB-VAL: missing portal credentials"
            fail ::Katello::HttpErrors::BadRequest, _("Customer portal credentials are required.  Please provide them using login.")
          end
          credentials = { :username => session[:portal_username], :password => session[:portal_password] }
          portal_subinfo = build_subinfo_from_portal(deployment.id, deployment.label, deployment.upstream_consumer_uuid, credentials)

          valid = compare(deployment_subinfo, portal_subinfo)
        elsif manifest_imported
          # new with existing manifest
          ::Fusor.log.info "SUB-VAL.validate: EXISTING MANIFEST! Subsequent deployment"
          satellite_subinfo = build_subinfo_from_satellite(deployment.label)
          valid = compare(deployment_subinfo, satellite_subinfo)
        else
          ::Fusor.log.error "SUB-VAL.validate: DANGER WILL ROBINSON! We shouldn't be here!"
        end

        ::Fusor.log.debug "SUB-VAL.validate: Leaving SubscriptionValidator.validate returning, valid is #{valid}"
        return valid
      end

      private

      #
      # Compares the deployment subscription info with a subscription info
      # created from one of the backend sources: portal, manifest, satellite.
      # It checks to see if the subscription source has enough entitlement
      # counts to handle the deployment as well as whether all of the products
      # are covered as well.
      #
      def compare(deployment_si, other_si)
        # validate product ids first
        valid = products_covered?(deployment_si.flatten_product_ids, other_si.flatten_product_ids)
        if valid
          ::Fusor.log.info "SUB-VAL.compare: products are covered, validating counts now"
          # only check the counts if all the products are covered
          deployment_si.get_counts.each do |product, count|
            ::Fusor.log.info "SUB-VAL.compare: deployment has product: #{product} with count: #{count}"
            ::Fusor.log.info "SUB-VAL.compare: #{deployment_si.get_product_ids_by_name(product)}"

            # get the set of keys that encompass the counts
            # for each of the keys, get their count
            # each count has to be >= to the count we need
            keys = other_si.get_product_keys(deployment_si.get_product_ids_by_name(product))
            if keys.empty?
              ::Fusor.log.error "SUB-VAL.compare: COULD NOT FIND any keys for product [#{product}]. #{deployment_si.get_product_ids_by_name(product)}"
            end

            dep_count = deployment_si.get_counts_by_name(product)
            keys.each do |key|
              count = other_si.get_counts_by_name(key)
              valid &&= (dep_count <= count)  # valid = valid && (dep_count <= count)
              ::Fusor.log.info "SUB-VAL.compare: deployment needs #{dep_count}. subscriptions supply #{count}. Valid? #{valid}"
            end
          end
        end

        ::Fusor.log.debug "SUB-VAL.compare: Returning valid? #{valid}"
        return valid
      end

      #
      # Gets the list of product ids we need to sync content to deploy. These
      # are defined in the fusor.yaml configuration file.
      #
      def get_product_ids_from_config(key)
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

      #
      # Builder methods, build_subinfo_from_*, to build SubscriptionInfo
      # objects from the various sources.
      #
      # portal - connects to the customer portal through the satellite to get
      #   product ids and subscription counts
      # satellite - talks to the satellite to get the imported manifest
      #   information
      # manifest - parses the uploaded manifest zip file to get the product ids
      #   and subscription counts
      #

      def get_all_subscriptions(uuid, auth)
        lookup_map = {}
        all_subs = JSON.parse(::Fusor::Resources::CustomerPortal::Proxy.get("/pools/?consumer=#{uuid}&listall=false", auth))
        all_subs.each do |s|
          lookup_map[s["productName"]] = s["providedProducts"].map { |p| p["productId"] }
        end
        return lookup_map
      end

      def build_subinfo_from_portal(id, label, uuid, auth)
        subinfo = Fusor::Subscriptions::SubscriptionInfo.new("portal-" + label)
        # get the product ides from customer portal
        entitlements = JSON.parse(::Fusor::Resources::CustomerPortal::Proxy.get("/consumers/#{uuid}/entitlements", auth))

        entitlements.each do |e|
          product_name = e["pool"]["productName"]
          subinfo.add_product_ids(product_name, e["pool"]["providedProducts"].map { |p| p["productId"] })
          subinfo.update_counts(product_name, e["quantity"])
        end

        # get the list of subscriptions from deployment in case they added
        # some to account for those.
        # We only want subscriptions for this deployment which were added
        # and have an actual quantity to add.
        added_subscriptions = Fusor::Subscription.where(:deployment_id => id).where(:source => 'added').where('quantity_to_add > 0')

        # if we have added some subscriptions, let's see if we need to add
        # their product ids as well
        if !added_subscriptions.empty?
          all_subs = get_all_subscriptions(uuid, auth)
        end

        added_subscriptions.each do |s|
          subinfo.update_counts(s.product_name, s.quantity_to_add)
          subinfo.add_product_ids(s.product_name, all_subs[s.product_name])
        end

        ::Fusor.log.info "SUB-VAL.build-si-portal: built subscription info from portal. #{subinfo.inspect}"
        return subinfo
      end

      def build_subinfo_from_satellite(label)
        subinfo = Fusor::Subscriptions::SubscriptionInfo.new("satellite-" + label)
        subs = ::Katello::Subscription.where.not(name: "Fusor")
        subs.each do |sub|
          sub.pools.each do |p|
            subinfo.update_counts(sub.name, p.quantity)
          end
          subinfo.add_product_ids(sub.name, sub.products.map { |p| p.cp_id })
        end
        ::Fusor.log.info "SUB-VAL.build-si-sat: built subscription info from satellite. #{subinfo.inspect}"
        return subinfo
      end

      def build_subinfo_from_manifest(deployment)
        subinfo = Fusor::Subscriptions::SubscriptionInfo.new("manifest-" + deployment.label)
        mi = Fusor::Manifest::ManifestImporter.new
        subs = mi.get_subscriptions(deployment.manifest_file, deployment.id)
        subs.each do |sub|
          subinfo.update_counts(sub['pool']['productName'], sub['quantity'])
          pids = sub['pool']['providedProducts'].map { |p| p['productId'] }.uniq
          subinfo.add_product_ids(sub['pool']['productName'], pids)
        end
        ::Fusor.log.info "SUB-VAL.build-si-man: built subscription info from manifest. #{subinfo.inspect}"
        return subinfo
      end

      def build_subinfo_from_deployment(deployment)
        subinfo = Fusor::Subscriptions::SubscriptionInfo.new(deployment.label)

        # count rhev nodes
        if deployment.deploy_rhev
          subinfo.update_counts(:rhev, 1) if !deployment.rhev_engine_host.nil?
          subinfo.update_counts(:rhev, deployment.discovered_hosts.count) if !deployment.discovered_hosts.empty?
        end

        # count openshift nodes
        if deployment.deploy_openshift
          subinfo.update_counts(:openshift, deployment.openshift_number_master_nodes)
          subinfo.update_counts(:openshift, deployment.openshift_number_worker_nodes)
        end

        # count openstack nodes
        if deployment.deploy_openstack && !deployment.openstack_deployment.nil?
          openstack = deployment.openstack_deployment
          subinfo.update_counts(:openstack, openstack.overcloud_compute_count)
          subinfo.update_counts(:openstack, openstack.overcloud_controller_count)
          subinfo.update_counts(:openstack, openstack.overcloud_block_storage_count)
          subinfo.update_counts(:openstack, openstack.overcloud_object_storage_count)
        end

        ::Fusor.log.debug "SUB-VAL.build-si-dep: deploy_rhv: #{deployment.deploy_rhev}"
        ::Fusor.log.debug "SUB-VAL.build-si-dep: deploy_cfme: #{deployment.deploy_cfme}"
        ::Fusor.log.debug "SUB-VAL.build-si-dep: deploy_openshift: #{deployment.deploy_openshift}"
        ::Fusor.log.debug "SUB-VAL.build-si-dep: deploy_openstack: #{deployment.deploy_openstack}"

        subinfo.add_product_ids(:rhev, get_product_ids_from_config(/rhev/)) if deployment.deploy_rhev
        subinfo.add_product_ids(:cloudforms, get_product_ids_from_config(/cloudforms/)) if deployment.deploy_cfme
        subinfo.add_product_ids(:openshift, get_product_ids_from_config(/openshift/)) if deployment.deploy_openshift
        subinfo.add_product_ids(:openstack, get_product_ids_from_config(/openstack/)) if deployment.deploy_openstack

        ::Fusor.log.info "SUB-VAL.build-si-dep: built subscription info from deployment. #{subinfo.inspect}"
        return subinfo
      end

      #
      # Determines if the deployment products are covered by a particular
      # manifest.
      #
      def products_covered?(dep_prods, man_prods)
        if dep_prods.nil? || man_prods.nil?
          return false
        end

        return (dep_prods - man_prods).empty?
      end

    end
  end
end
