require File.expand_path('../lib/fusor/version', __FILE__)

Gem::Specification.new do |s|
  s.name        = "fusor_server"
  s.version     = Fusor::VERSION
  s.date        = Date.today.to_s
  s.author     = "Fusor team"
  s.email       = "fusor@example.com"
  s.homepage    = "https://github.com/fusor/fusor"
  s.summary     = "Fusor installer"
  s.description = "Fusor installer"

  s.files = Dir["{app,config,db,lib}/**/*"] + ["LICENSE", "Rakefile", "README.md"]
  s.files += Dir["config/fusor.yaml"]
  s.test_files = Dir["test/**/*"]

  s.add_dependency "active_model_serializers", '~> 0.9'
  s.add_dependency "mechanize"
  s.add_development_dependency 'rubocop', '0.33.0'
end
