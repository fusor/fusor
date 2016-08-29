module Utils
  module Fusor
    class ConfigTemplateUtils
      def initialize(params)
        @default_loc_name = params[:default_loc_name] ||= 'Default Location'
        @default_org_name = params[:default_org_name] ||= 'Default Organization'

        # set custom snippet names
        @rhevm_guest_agent_snippet_name = params[:rhevm_guest_agent_snippet_name] ||= 'rhevm_guest_agent'
        @enabled_repos = params[:enabled_repos] ||= []
      end

      def create_snippet(name)
        if !ProvisioningTemplate.find_by_name(name).nil?
          ::Fusor.log.error "====== Snippet '#{name}' already exists! ======"
          return nil
        end
        new_snippet = ProvisioningTemplate.create
        new_snippet.name = name
        new_snippet.snippet = true
        new_snippet.template = "<%#\nkind: snippet\nname: #{name}\n%>\n"
        new_snippet.locations << Location.find_by_name(@default_loc_name)
        new_snippet.organizations << Organization.find_by_name(@default_org_name)
        new_snippet.save!
      end

      def ensure_snippet(name)
        if !ProvisioningTemplate.find_by_name(name).nil?
          ::Fusor.log.debug "====== Snippet '#{name}' already exists! ======"
          return true
        end

        # create custom snippets
        if name.eql? @rhevm_guest_agent_snippet_name
          create_rhevm_guest_agent_snippet
        else
          ::Fusor.log.error "====== Unsupported custom snippet '#{name}'.  Cannot ensure snippet. ======"
          return nil
        end
      end

      def ensure_kickstart(name)
        if !ProvisioningTemplate.find_by_name(name).nil?
          ::Fusor.log.debug "====== Template '#{name}' already exists! ======"
          return true
        end

        default_template_name = 'Satellite Kickstart Default'
        default_template = ProvisioningTemplate.find_by_name(default_template_name)
        if default_template.nil?
          ::Fusor.log.error "====== Template '#{default_template_name}' does not exist! Cannot dup from default! ======"
          return nil
        end
        new_template = default_template.dup
        new_template.name = name
        str = new_template.template.clone
        str.sub! "name: #{default_template_name}", "name: #{name}"
        new_template.template = str
        new_template.locked = false

        # Add OS to template
        os_ids = []
        Operatingsystem.all.each do |os|
          os_ids << os.id
        end
        new_template.operatingsystem_ids = os_ids

        new_template.save!
      end

      def append(name, text)
        template = ProvisioningTemplate.find_by_name(name)
        if template.nil? || text.nil?
          ::Fusor.log.error "====== Input params is nil! Cannot append. ======"
          return nil
        end
        str = template.template.clone
        str.concat(text)
        template.template = str
        template.save!
      end

      def update(name, replacement_text, search_text)
        template = ProvisioningTemplate.find_by_name(name)
        if template.nil? || replacement_text.nil? || search_text.nil?
          ::Fusor.log.error "====== Input params is nil! Cannot update ======"
          return nil
        end

        if !template.template.include?(search_text)
          ::Fusor.log.error "====== Search text '#{search_text}' does not exist in the template! Cannot update ======"
          return nil
        end
        str = template.template.clone
        str.sub! search_text, replacement_text
        template.template = str
        template.save!
      end

      def ensure_ks_with_snippet(ks_name, snippet_name)
        return nil unless ensure_kickstart(ks_name)
        return nil unless ensure_snippet(snippet_name)

        # add snippets just before the 'sync' in the post section of ks
        search_text = "\nsync\n"
        snippet_include_line = "\n\n<%= snippet '#{snippet_name}' %>\n\n"

        ks = ProvisioningTemplate.find_by_name(ks_name)
        if ks.template.include?(snippet_include_line)
          ::Fusor.log.debug "====== Snippet '#{snippet_name}' already in the KS '#{ks_name}'.  Nothing to do. ======"
          return true
        end
        replacement_text = snippet_include_line + search_text
        update(ks_name, replacement_text, search_text)
      end

      #########################
      # create custom snippets
      #########################
      def create_rhevm_guest_agent_snippet
        name = @rhevm_guest_agent_snippet_name
        return nil unless create_snippet(name)
        append(name, "\nsubscription-manager --enable #{@enabled_repos.join ' --enable '}")
        append(name, "\nsubscription-manager --disable \"*\"")
        append(name, "\nyum install rhevm-guest-agent-common -y")
        append(name, "\nsystemctl start ovirt-guest-agent.service")
        append(name, "\nsystemctl enable ovirt-guest-agent.service\n")
      end
    end
  end
end
