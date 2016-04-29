require File.expand_path('../lib/fusor/version', __FILE__)
require 'date'

Gem::Specification.new do |s|
  s.name        = "fusor_server"
  s.version     = Fusor::VERSION
  s.date        = Date.today.to_s
  s.author     = "Fusor team"
  s.email       = "fusor@example.com"
  s.homepage    = "https://github.com/fusor/fusor"
  s.summary     = "Plugin engine that is the RHCI backend server code"
  s.description = "Plugin engine that is the RHCI backend server code "

  s.files = Dir["{app,config,db,lib}/**/*"] + ["LICENSE", "Rakefile", "README.md"]
  s.files += Dir["config/fusor.yaml"]
  s.test_files = Dir["test/**/*"]

  s.add_dependency "active_model_serializers", '~> 0.9'
  s.add_dependency "rubyipmi"
  s.add_dependency "rubyzip"
  s.add_dependency "net-ssh", '2.9.2' # last ruby 1.9 version
  s.add_dependency 'net-scp'
  s.add_dependency "sys-filesystem"
  s.add_development_dependency 'rubocop', '0.33.0'
  s.add_development_dependency 'simplecov'
  s.add_development_dependency 'coveralls'
end
