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
    class SubscriptionInfo
      def initialize(name)
        @name = name
        @product_ids = {} # hash of arrays keyed by product name. MUST MATCH BELOW
        @counts = {} # hash of integers keyed by product name. MUST MATCH ABOVE
      end

      def add_product_ids(product, ids)
        ::Fusor.log.debug "SUB-INFO: #{@name} adding product [#{product}] ids: [#{ids}]"
        @product_ids[product] = [] if !@product_ids.key?(product)
        @product_ids[product].concat ids
        @product_ids[product].uniq! # remove duplicates, the ! operates on the actual array
        ::Fusor.log.debug "SUB-INFO: after addition to [#{product}] this is what we have: #{@product_ids[product]}"
      end

      def get_product_ids
        return @product_ids
      end

      def get_product_keys(pids)
        ::Fusor.log.debug "SUB-INFO: #{@name}.get_product_key: pids: #{pids}"
        # if pids - values is empty we found our best match
        # otherwise if any of the items matched add the key to the list
        # skip if pids - values == pids
        #
        keys = []
        @product_ids.each do |key, values|
          #return key if (pids - values).empty?

          diff = (pids - values)
          if diff.empty?
            return [key] # best match
          end

          if diff.count < pids.count
            # found at least one add it to the list
            keys << key
          end
        end

        return keys
      end

      def get_product_ids_by_name(product)
        ::Fusor.log.debug "SUB-INFO: #{@name}.get_product_ids_by_name:  product: #{product} values: #{@product_ids[product]}"
        return @product_ids[product]
      end

      def flatten_product_ids
        return @product_ids.values.flatten.uniq
      end

      def update_counts(product, count)
        @counts[product] = 0 if !@counts.key?(product)
        @counts[product] += count if !count.nil?
        ::Fusor.log.debug "SUB-INFO: product #{product} incremented by #{count} for a quantity #{@counts[product]}"
      end

      def get_counts
        return @counts
      end

      def get_counts_by_name(product)
        ::Fusor.log.debug "SUB-INFO: getting counts for #{product}"
        return @counts[product]
      end

    end
  end
end
