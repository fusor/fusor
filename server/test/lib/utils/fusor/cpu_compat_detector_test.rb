require 'test_plugin_helper'

module Utils::Fusor
  class CpuCompatDetectorTest < ActiveSupport::TestCase

    test 'cpu_compat_detector should resolve "processors" facts from discovered hosts' do
      rhv_hypervisors_list = []
      rhv_hypervisors_list << hosts(:host_haswell)
      result = CpuCompatDetector.processor_concat(rhv_hypervisors_list)
      assert result.scan('haswell-notsx').count == 2
    end

    test 'cpu_compat_detector should return all cpus if no known brands found in cluster cpu list' do
      processor_concat = 'unlisted brand quad core processor ; ' * 4
      cpu_families_and_default = CpuCompatDetector.resolve_compatible_cpus(processor_concat)
      cpu_families = cpu_families_and_default[:cpu_families]
      default_family = cpu_families_and_default[:default_family]
      cpu_families_concat = cpu_families.join(" ; ")
      assert cpu_families_concat.downcase.include?('intel')
      assert cpu_families_concat.downcase.include?('amd')
      assert cpu_families_concat.downcase.include?('ibm')
      assert default_family.downcase.include?('intel nehalem')
    end

    test 'cpu_compat_detector should return all intel cpus if "intel" found, but known arch not found' do
      processor_concat = 'intel core processor (baybridge, not_real) ; ' * 4
      cpu_families_and_default = CpuCompatDetector.resolve_compatible_cpus(processor_concat)
      cpu_families = cpu_families_and_default[:cpu_families]
      cpu_families.each do |cpu_fam| assert cpu_fam.downcase.include?('intel') end
    end

    test 'cpu_compat_detector should return all amd cpus if "amd" found, but known arch not found' do
      processor_concat = 'amd opteron(tm) processor 6172 ; ' * 4
      processor_concat << 'amd opteron(tm) processor 4362 ; ' * 4
      cpu_families_and_default = CpuCompatDetector.resolve_compatible_cpus(processor_concat)
      cpu_families = cpu_families_and_default[:cpu_families]
      cpu_families.each do |cpu_fam| assert cpu_fam.downcase.include?('amd') end
    end

    test 'cpu_compat_detector should return all ibm cpus if "ibm" found, but known arch not found' do
      processor_concat = 'ibm powerpc processor ; ' * 4
      cpu_families_and_default = CpuCompatDetector.resolve_compatible_cpus(processor_concat)
      cpu_families = cpu_families_and_default[:cpu_families]
      cpu_families.each do |cpu_fam| assert cpu_fam.downcase.include?('ibm') end
    end

    test 'cpu_compat_detector should return haswell-notsx and older if entire cluster is haswell-notsx' do
      processor_concat = 'intel core processor (haswell, no tsx) ; ' * 4
      cpu_families_and_default = CpuCompatDetector.resolve_compatible_cpus(processor_concat)
      cpu_families = cpu_families_and_default[:cpu_families]
      default_family = cpu_families_and_default[:default_family]
      assert default_family.downcase.include?('notsx')
      assert cpu_families.count == 6
      cpu_families.each do |cpu_fam| assert cpu_fam.downcase.include?('intel') end
    end

    test 'cpu_compat_detector should return nehalem, penryn, and conroe if sandybridge and nehalem cpus in cluster' do
      processor_concat = 'intel core processor (sandybridge, no tsx) ; ' * 4
      processor_concat << 'intel core processor (nehalem, no tsx) ; ' * 4
      cpu_families_and_default = CpuCompatDetector.resolve_compatible_cpus(processor_concat)
      cpu_families = cpu_families_and_default[:cpu_families]
      default_family = cpu_families_and_default[:default_family]
      assert cpu_families.count == 3
      assert default_family.downcase.include?('nehalem')
    end

  end
end
