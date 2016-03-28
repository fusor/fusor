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

module Fusor::Concerns::HostgroupExtensions
  extend ActiveSupport::Concern

  def current_param_value(key)
    lookup_value = LookupValue.where(:lookup_key_id => key.id, :id => lookup_values).first
    if lookup_value
      [lookup_value.value, to_label]
    else
      inherited_lookup_value(key)
    end
  end

  def current_param_value_str(key)
    lookup_value, _ = current_param_value(key)
    return key.value_before_type_cast(lookup_value)
  end

  def set_param_value_if_changed(puppetclass, key, value)
    if puppetclass
      lookup_key         = puppetclass.class_params.where(:key => key).first
      fail _("Failed to find puppet parameter for key #{key} in #{puppetclass.name}") unless  !lookup_key.nil?
      lookup_value_value = current_param_value(lookup_key)[0]
      current_value      = lookup_key.value_before_type_cast(lookup_value_value).to_s.chomp
      if current_value != value
        lookup       = LookupValue.where(:match         => hostgroup.send(:lookup_value_match),
                                         :lookup_key_id => lookup_key.id).first_or_initialize
        lookup.value = value
        lookup.use_puppet_default = value.blank? ? true : false
        lookup.save!
      end
    end
  end
end
