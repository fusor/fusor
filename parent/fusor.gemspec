require File.expand_path('../lib/fusor/version', __FILE__)

Gem::Specification.new do |s|
  s.name        = "fusor"
  s.version     = Fusor::VERSION
  s.date        = Date.today.to_s
  s.author     = "Fusor team"
  s.email       = "fusor@example.com"
  # s.homepage    = "TODO"
  s.summary     = "RHCI installer"
  s.description = "RHCI installer"

  s.files      = Dir["{app,config,db,lib}/**/*"] + ["LICENSE", "Rakefile", "README.md"]
  s.test_files = Dir["test/**/*"]

  s.add_dependency "deface"
  s.add_development_dependency "sqlite3"
end
