require File.expand_path('../lib/fusor_ui/version', __FILE__)

Gem::Specification.new do |s|
  s.name        = "fusor_ui"
  s.version     = FusorUi::VERSION
  s.date        = '2014-11-23'
  s.authors     = ["Joseph Magen"]
  s.email       = ["jmagen@redhat.com"]
  s.homepage    = "http://github.com/fusor/fusor"
  s.summary     = "Plugin engine to enable the User Interface (UI) for RHCI"
  s.description = "Plugin engine to enable the User Interface (UI) for RHCI"

  s.files = Dir["{app,config,db,lib,public}/**/*"] + ["LICENSE", "Rakefile", "README.md"]
  s.test_files = Dir["test/**/*"]

  s.add_dependency "fusor_server"
end
