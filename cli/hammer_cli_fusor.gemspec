$:.unshift File.expand_path("../lib", __FILE__)
require "hammer_cli_fusor/version"

Gem::Specification.new do |s|

  s.name     = "hammer_cli_fusor"
  s.authors  = ["Me"]
  s.version  = HammerCLIFusor.version.dup
  s.platform = Gem::Platform::RUBY
  s.summary  = %q{Fusor CLI client}

  s.files         = Dir['lib/**/*.rb']
  s.require_paths = ["lib"]

  s.add_dependency 'hammer_cli_foreman', '>= 0.1.3'
end
