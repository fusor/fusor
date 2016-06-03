module Fusor
  module Concerns
    module HostExtensions
      extend ActiveSupport::Concern

      def current_param_value(key)
        lookup_value = LookupValue.where(:lookup_key_id => key.id, :id => lookup_values).first
        if lookup_value
          [lookup_value.value, to_label]
        else
          [nil, nil]
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
            lookup       = LookupValue.where(:match         => lookup_value_match,
                                            :lookup_key_id => lookup_key.id).first_or_initialize
            lookup.value = value
            lookup.use_puppet_default = value.blank? ? true : false
            lookup.save!
          end
        end
      end
    end
  end
end
