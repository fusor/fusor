#!/bin/bash

if [ $1 == "install" ]; then 
  cd ..
  gem install bundler
  # I don't think these are needed in Travis Ci environment, will have to test though
  #sudo su -c 'echo "local all all trust" > /etc/postgresql/9.1/main/pg_hba.conf'
  #sudo su -c 'echo "host all all 127.0.0.1/32 trust" >> /etc/postgresql/9.1/main/pg_hba.conf'
  #sudo su -c 'echo "host all all ::1/128 trust" >> /etc/postgresql/9.1/main/pg_hba.conf'
  #sudo service postgresql restart
  #sudo -u postgres createuser katello --superuser

  # Our db migrations don't apply to foreman 1.8-stable and katello-2.2, but we don't want our tests breaking everytime develop and master branches are unstable either. There may be a better way to do this, but for now let's get develop / master branches and then checkout out a known working state.
  git clone -b develop https://github.com/theforeman/foreman.git
  git clone -b master https://github.com/Katello/katello.git
  git clone https://github.com/fusor/foretello_api_v21.git

  cd katello
  git checkout b17759cc8bff193781e20415f7e446cd80e5e582
  cp script/ci/katello.yml config/katello.yml
  # Hack out some qpid dependencies in katello so that it can build on ubuntu 12.04
  sed -i 's/gem.add_dependency "qpid_messaging"/#gem.add_dependency "qpid_messaging"/' katello.gemspec
  sed -i "s/require 'qpid_messaging'/#require 'qpid_messaging'/" lib/katello.rb
  sed -i "s/Qpid::Messaging::Connection/#Qpid::Messaging::Connection'/" app/lib/actions/candlepin/candlepin_listening_service.rb
  sed -i "s/Qpid::Messaging::Duration/1#Qpid::Messaging::Duration'/" app/lib/actions/candlepin/candlepin_listening_service.rb

  cd ../foreman
  git checkout 3a30ac9e54c60f82b68076b6e6815312dfc31781
  sed -e 's/:locations_enabled: false/:locations_enabled: true/' config/settings.yaml.example > config/settings.yaml
  sed -i 's/:organizations_enabled: false/:organizations_enabled: true/' config/settings.yaml
  cp ../fusor/.foreman_database.yml config/database.yml
  echo "gem 'fusor_server', :path => '../fusor/server'" >> bundler.d/local.rb
  echo "gem 'katello', :path => '../katello'" >> bundler.d/local.rb
  echo "gem 'foretello_api_v21', :path => '../foretello_api_v21'" >> bundler.d/local.rb
  echo "gem 'foreman_discovery'" >> bundler.d/local.rb
  echo "gem 'dynflow'" >> bundler.d/local.rb
  echo "gem 'less-rails'" >> bundler.d/local.rb
  echo "gem 'logger'" >> bundler.d/local.rb
  bundle install

  # hacky, find a better way to do this...
  # rails only supports loading fixtures from one directory, so link the
  # katello / fusor fixtures in to forman so they all will be loaded
  cd test/fixtures
  ln -s ../../../fusor/server/test/fixtures/* .
  ln -s ln -s ../../../katello/test/fixtures/models/* .
else
  cd ../foreman
  rake db:create
  rake db:migrate
fi
