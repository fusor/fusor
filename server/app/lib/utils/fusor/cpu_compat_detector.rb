##
# CpuCompatDetector
# =================
# Detects compatible CPU families for a RHV cluster

module Utils
  module Fusor
    class CpuCompatDetector
      def self.rhv_cpu_families(discovered_hosts)
        # gets cpu families that will be compatible with a rhv hypervisor cluster
        # returns { cpu_families: ['intelX', 'intelZ'], default_family: 'intelX'}
        # requires @deployment to have hypervisor host(s) attached.
        processors = processor_concat(discovered_hosts)
        return resolve_compatible_cpus(processors)
      end

      def self.processor_concat(discovered_hosts)
        processor_concat = ''
        host_ids = discovered_hosts.map { |h| h.id }
        # snippet by jesusr
        # get fact_values for the 'processors' fact_name, for all hypervisors (discovered_hosts)
        FactValue.joins(:fact_name).where(:fact_names => { :name => 'processors' }, :host_id => host_ids).each do |procs|
          processor_concat << (JSON.parse(procs.value.gsub('=>', ':'))["models"].join(' ; ').downcase)
        end
        return processor_concat
      end

      def self.resolve_compatible_cpus(processor_concat)
        # description: finds oldest cpu architecture, brand in rhv cluster.
        #              returns compatible cpus (oldest found + older)

        # input:  processor_concat = all processors in cluster as string
        # output: a compatible list of cpu families will be returned oldest first.
        # output: a best guess default cpu family to display

        # if intel processors are being used, installed generation and older will be returned
        # if amd processors are being used, all amd processors will returned
        # if ibm processors are being used, all ibm processors will be returned
        # if auto-detection doesn't match any processors, all options will be returned
        cpu_fam_candidates = {
          'intel': [
            'Intel Conroe Family',
            'Intel Penryn Family',
            'Intel Nehalem Family',
            'Intel Westmere Family',
            'Intel SandyBridge Family',
            'Intel Haswell-noTSX Family',
            'Intel Haswell Family'
          ],
          'amd': [
            'AMD Opteron G1',
            'AMD Opteron G2',
            'AMD Opteron G3',
            'AMD Opteron G4',
            'AMD Opteron G5'
          ],
          'ibm': [
            'IBM POWER 8'
          ]
        }

        # cpu family of cluster should match the oldest cpu present
        # in the cluster, therefore newest processors are checked first
        # and can be overwritten by older processor later in iteration
        cpu_fams = [
          # Intel processor families
          { brand: 'intel', keywords: ['intel'], position: -1 }, #intel wildcard
          { brand: 'intel', keywords: ['haswell'], position: 6 },
          { brand: 'intel', keywords: ['haswell', 'no', 'tsx'], position: 5 },
          { brand: 'intel', keywords: ['sandy', 'bridge'], position: 4 },
          { brand: 'intel', keywords: ['westmere'], position: 3 },
          { brand: 'intel', keywords: ['nehalem'], position: 2 },
          { brand: 'intel', keywords: ['penryn'], position: 1 },
          { brand: 'intel', keywords: ['conroe'], position: 0 },
          # AMD processor families - no generational trimming
          { brand: 'amd', keywords: ['amd'], position: -1 }, #amd wildcard
          # IBM processor families
          { brand: 'ibm', keywords: ['ibm'], position: -1 }, #ibm wildcard
          { brand: 'ibm', keywords: ['ibm', 'power', '8'], position: 0 }
        ]

        # placeholder for best compatible cpu family for cluster
        best_cpu_fam = { brand: 'none', keywords: [], value: -1 }

        # iterate through cpu_fams looking for keyword matches
        cpu_fams.each do |cpu_fam|
          # if brand_X cpu found, break once we start checking brand_Z
          if !(best_cpu_fam[:brand] == (cpu_fam[:brand]) || best_cpu_fam[:brand] == ('none'))
            break
          end
          # ensure that all keywords match before setting new compatible best cpu family
          if cpu_fam[:keywords].all? { |keyword| processor_concat.include? keyword }
            best_cpu_fam = cpu_fam
          end
        end

        if best_cpu_fam[:brand] == 'none'
          # return all cpu families if keyword matches failed
          all_cpu_fams = []
          cpu_fam_candidates.values.each do |brand_fams| all_cpu_fams << brand_fams end
          all_cpu_fams.flatten!
          return {
            cpu_families: all_cpu_fams,
            default_family: 'Intel Nehalem Family'
          }
        else
          # we were able to detect a brand
          if best_cpu_fam[:position] == -1
            # set default cpu family per brand
            # this is used if a specific CPU family cannot be detected
            case best_cpu_fam[:brand]
            when 'intel'
              default_fam = 'Intel Nehalem Family'
            when 'amd'
              default_fam = 'AMD Opteron G3'
            when 'ibm'
              default_fam = 'IBM POWER 8'
            end
          else
            # if a known cpu family is detected in the cluster, set it as the default
            default_fam = cpu_fam_candidates[best_cpu_fam[:brand].to_sym][best_cpu_fam[:position]]
          end

          return {
            # keep all families from best_cpu_fam and older
            cpu_families: cpu_fam_candidates[best_cpu_fam[:brand].to_sym][0..best_cpu_fam[:position]],
            default_family: default_fam
          }
        end
      end
    end
  end
end
